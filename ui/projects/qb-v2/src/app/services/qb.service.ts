import { IQuery } from './../models/query';
import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpService } from './http.service';
import { Subject } from 'rxjs';
import { DrillDownConstants } from '../constants/drill-down.cnst';

@Injectable({
  providedIn: 'root'
})
export class QbService {

  loading = new Subject();

  constructor(
    private commonSrv: CommonService,
    private httpSrv: HttpService
  ) { }

  /**
   * 
   * @param val - Loading state true | false.
   */
  setLoadingState(val: boolean) {
    this.loading.next(val);
  }
  
  /**
   * 
   * @param attrs - Attributes which we got from api.
   * @description - This method will add parent key for each attribute and add some new flags like operationType(ot), 
   * aggregationType(aggType), value - to hold the selected filter values, rangeValue - to hold the range value as we are having two values 
   * if operation type is RANGE.  
   */
  formatAttrs(attrs) {
    let modifiedAttrs = [];
    attrs.forEach((at) => {
      if(!at.childObject) {
        modifiedAttrs.push({...at, rangeValue: [], value: [], ot: '-1', aggType: '-1'}); // OT: Operation Type.
      }else {
        let flatChilds = mergeChilds(at, {key: at.fieldName, ui: at.uiName});
        flatChilds.forEach((c) => {
          modifiedAttrs = modifiedAttrs.concat([...c]);
        })
      }

      function mergeChilds(at, parent) {
        let childs = [];
        at.childObject.forEach((c) => {
          c.parentKey = parent.key;
          c.parentUI = parent.ui;
          if(!c.childObject) {
            modifiedAttrs.push({...c, rangeValue: [], value: [], ot: '-1', aggType: '-1'});
          }else {
            // parent.fieldName = ' > '+c.fieldName;
            // parent.uiName += ' > '+c.uiName;
            mergeChilds(c, {ui: parent.ui+' > '+c.uiName, key: parent.key+' > '+c.fieldName});
          }
          // childs.push(!c.childObject ? c : mergeChilds(c, parent+" > "+c.uiName));
        })
        return [...childs];
      }
      
    });
    return modifiedAttrs;
  } 

  /** Execute Query */
  /**
   * 
   * @param queryInfo - Query Format: {queryName: string, filters: selected Filters, aggFilters: selected Aggregate Filters, outputCols: Selected output columns, _id: uuid}
   * @param showToast - You want to show toast messages when error occured.
   * @default - false;
   * @description - This function function will validates the queryInfo and if showToast is true it will show toast messages.
   * @returns - number
   * 0 - Index is not selected
   * 1 - No filter selected
   * 2 - filters are not valid
   * 3 - aggregate filters are not valid
   * 4 - Valid Query and No Output columns are selected
   * 5 - Valid Query and output columns also selected.
   */
  validateQuery(queryInfo: IQuery, showToast: boolean = true) {
    if(queryInfo.index != '-1') {
      if(queryInfo.filters.length > 0 || queryInfo.aggFilters.length > 0) {
        let filterStatus = this.isValidFilters(queryInfo.filters);
        if(filterStatus.valid) {
          let aggFiltersStatus = this.isValidAggFilters(queryInfo.aggFilters);
          if(aggFiltersStatus.valid) {
            // if(showToast)
              // this.commonSrv.showToastMessage("Good to go! build query", "success", {});
            if(queryInfo.outputCols.length > 0) {
              return 5;
            }else {
              return 4;
            }
          }else {
            if(showToast)
              this.commonSrv.showToastMessage(aggFiltersStatus.msg, "error", {});
            return 3;
          }
        }else {
          if(showToast)
            this.commonSrv.showToastMessage(filterStatus.msg, "error", {});
          return 2;
        }
      }else {
        if(showToast)
          this.commonSrv.showToastMessage('Select some filters', "error", {});
        return 1;
      }
    }else {
      if(showToast)
        this.commonSrv.showToastMessage('Please select Index First', 'error', {});
      return 0;
    }
  }

  /**
   * 
   * @param queryInfo - QueryInfo
   * @description - This method will take queryInfo and build the elastic search query
   * @returns - Elastic search query format with the queryInfo values.
   */
  buildQuery(queryInfo: IQuery) {
    let outputCols = [];
    queryInfo.outputCols.forEach((at) => {
      at.fieldName = at.fieldName.replace(".keyword", "");
      outputCols.push(at);
    })
    queryInfo.outputCols = queryInfo.aggFilters.length > 0 ? [] : outputCols;
    let postData = this.getRequestFormat(queryInfo, queryInfo.aggFilters.length > 0);

    // Adding Filter attributes to postdata.
    queryInfo.filters.forEach((fattr) => {
      let path = (fattr.parentKey ? fattr.parentKey.replace(/ > /g, '.')+'.' : '')+fattr.fieldName;
      if(fattr.ot.toLowerCase() == 'range') {
        postData.rangeQuerySet[path] = {Lte: fattr.value, Gte: fattr.rangeValue};
      }else if(fattr.dataType.toLowerCase() == 'float' || fattr.dataType.toLowerCase() == 'int' || fattr.dataType.toLowerCase() == 'long') {
        postData.terms[path] = fattr.value;
      }else{
        postData.termsString[path] = fattr.value;
      }
    })

    //Adding Agg Filters to postdata.
    queryInfo.aggFilters.forEach((attr) => {
      // console.log(attr);
      let path = (attr.parentKey ? attr.parentKey.replace(/ > /g, '.')+'.' : '')+attr.fieldName;
      if(attr.aggType == 'groupBy') {
        postData.aggregateQueryMap["1"].termsQuery = postData.aggregateQueryMap["1"].termsQuery || {terms: {}};
        postData.aggregateQueryMap["1"].termsQuery.terms[attr.uiName] = path; 
      }else if(attr.aggType == 'sum') {
        postData.aggregateQueryMap["1"].sumQuery = postData.aggregateQueryMap["1"].sumQuery || {terms: {}};
        postData.aggregateQueryMap["1"].sumQuery.terms[attr.uiName] = path;
      }else if(attr.aggType == 'avg') {
        postData.aggregateQueryMap["1"].avgQuery = postData.aggregateQueryMap["1"].avgQuery || {terms: {}};
        postData.aggregateQueryMap["1"].avgQuery.terms[attr.uiName] = path;
      }else if(attr.aggType == 'min') {
        postData.aggregateQueryMap["1"].minQuery = postData.aggregateQueryMap["1"].minQuery || {terms: {}};
        postData.aggregateQueryMap["1"].minQuery.terms[attr.uiName] = path;
      }else if(attr.aggType == 'max') {
        postData.aggregateQueryMap["1"].maxQuery = postData.aggregateQueryMap["1"].maxQuery || {terms: {}};
        postData.aggregateQueryMap["1"].maxQuery.terms[attr.uiName] = path;
      }     
    })
    return postData;
  }

  /**
   * 
   * @param queryInfo - QueryInfo
   * @param showToasts - Whehter you want to show toasts or not when error occured.
   * @description - This method will first Validate the queryInfo if it is valid then it will build the query and then calls api with the elastic search format
   * query which returned by buildQuery() Method.
   * @returns Elastic search query result.
   */
  executeQuery(queryInfo: IQuery, showToasts: boolean = false) {
    let promise = new Promise((resolve, reject) => {
      let queryResult = this.validateQuery(queryInfo, showToasts);
      if(queryResult == 5 || queryResult == 4) {
        let postData = this.buildQuery(queryInfo);
        // this.result = 'loading...';
        this.httpSrv.downloadExcel("GET_EXCEL", postData).subscribe((res: Blob) => {
          // this.result = res;
          // var byteArray = new Uint8Array(res);

          var a = window.document.createElement('a');

          a.href = window.URL.createObjectURL(res);
          a.download = "test_file.xlsx";

          // Append anchor to body.
          document.body.appendChild(a)
          a.click();
          // Remove anchor from body
          document.body.removeChild(a)

          resolve({status: true, res});
        }, (err) => {
          // console.log(err);
          // this.result = "Unable to reach servers.";
          reject({status: false, err});
        })
      }
    });
    return promise;
  }

  /**
   * 
   * @param queryInfo - QueryInfo
   * @param isAggFiltersPresent - Whether aggregate filters are selected in the query or not.
   * @description This method will returns the format of the elastic search query.
   * @returns - Elastic search query format
   */
  getRequestFormat(queryInfo: IQuery, isAggFiltersPresent: boolean) {
    let request = {
      "index": queryInfo.index,
      "from": 0,
      "size": 0,
      "source": queryInfo.outputCols.map((at) => at.fieldName).join('~'),
      "match": {},
      "boolMatch": {},
      "intMatch": {},
      "rangeQuerySet": {},
      "term": {},
      "terms": {},
      "stringTerm":{},
      "termsString": {},
      "aggregateQueryMap": {}
    };
    if(!!isAggFiltersPresent) {
      request.aggregateQueryMap = {
        "1": {
          "size": 10000,
          "termsQuery": {
            "terms": {},
            "script": {}
          },
          "sumQuery": {
            "terms": {},
            "script": {}
          },
          "filterQuery": {
            "terms": {},
            "script": {}
          },
          "maxQuery": {
            "terms": {},
            "script": {}
        },
         "minQuery": {
            "terms": {},
            "script": {}
        },
         "avgQuery": {
            "terms": {},
            "script": {}
        }
        }
      }
    }
    return request;
  }

  /**
   * 
   * @param filters - Filters that you want to validate
   * @description This method will validate whehter filters are valid or not. A Filter is valid only if operation type is selected and provided value for that
   * and also it should contain range value if operation type is range.
   * @returns - Boolean true | false
   */
  isValidFilters(filters) {
    let msg = null;
    let notValidAttrs = filters.filter((f) => {
      if(f.ot == '-1' || (!isNullOrUndefined(f.value) && f.value.length == 0) || (f.ot == 'range' && (!isNullOrUndefined(f.rangeValue) && f.rangeValue.length == 0))) {
        msg = isNullOrUndefined(msg) ? "Please fill details of "+f.uiName : msg;
        return true;
      }else {
        return false;
      }
    })
    return {msg, valid: notValidAttrs.length == 0};
  }

  /**
   * 
   * @param aggFilters Aggregate Filters that you want to validate.
   * @description This method will validate whether aggregate filters are valid or not. An Aggregate Filter is valid only if it is having an aggregation type.
   * @returns - Boolean true } false
   */
  isValidAggFilters(aggFilters) {
    let msg = null;
    let notValidAttrs = aggFilters.filter((f) => {
      if(f.aggType == -1) {
        msg = isNullOrUndefined(msg) ? "Please select aggregation type for "+f.uiName : msg;
        return true;
      }else {
        return false;
      }
    })
    return {msg, valid: notValidAttrs.length == 0};
  }
  /** End of Execute Query */




  getTableData(queryInfo: IQuery, showToasts: boolean = false, dataTypeMap:{}, flag:boolean = false) {
    let promise = new Promise((resolve, reject) => {
      let queryResult = this.validateQuery(queryInfo, showToasts);
      if(queryResult == 5 || queryResult == 4) {
        let postData = this.buildQuery(queryInfo);
        this.httpSrv.makePostApiCall("GET_QUERY", postData).subscribe((res: any) => {

          // Skelton
          let tableCons = this.commonSrv.generateTableSkeletonObject();
          let tableData = [];

          // Generating Table Data
          if(!!res && !!res.data && !!res.data.result && !!res.data.result.content) {
            let {headers, data} = this.convertResponseToTableConstant(res.data.result.content, dataTypeMap, flag);
            tableCons.columns = headers;
            tableData = data;
          }

          resolve({status: true, res, cons: tableCons, data: tableData});
        }, (err) => {
          reject({status: false, err});
        })
      }
    });
    return promise;
  }



  /** Formatting Response to Table Constant   */
  convertResponseToTableConstant(data: any, dataTypeMap :{}, flag) {
    let headers = [];

    // console.log("Data for generating table :" , data);
    // console.log("Attr :", dataTypeMap);
    
    const columnMapping = data.columnMap;
    const uiColumnMap = data.uiColumnMap;
    headers = this.getHeadersFromColumnMap(columnMapping, uiColumnMap, dataTypeMap, flag);
    // console.log("[QB Service] Headers:: ",JSON.parse(JSON.stringify(headers)));
    

    return {headers, data: data.formatList};
  }
  /** End of Formatting Response to Table Constant */


  /** Conver Column mapping to Header Format */
  getHeadersFromColumnMap(columnMap: any, uiColumnMap: any, dataTypeMap:{}, flag) {
    let headers = [];
    let deflattenedObj = this.deflattenObject(columnMap);
    headers = getChildHeaders(deflattenedObj, []);
    return headers;
    
    function getChildHeaders(childs, path) {
      let headers = [];
      let index = -1;
      let columnInd = -1;
      if(typeof childs == 'object') {
        for(let key in childs) {
          let temp = { name: key};
          if(typeof childs[key] == 'object') {
            temp['childs'] = getChildHeaders(childs[key], [...path, key]);
          }else {
            temp['jsonKey'] = {path: [...path, key].join('.')};
            let ind = DrillDownConstants.HIE_LEVELS.indexOf(key);
            if( ind != -1 && ind > index){
              index = ind;
              columnInd = columnMap[key];
            }
            let dataType;
            if(isNullOrUndefined(uiColumnMap)){
              dataType = DrillDownConstants.DATATYPE_MAPPING[dataTypeMap[key]];
            }
            else{
              dataType = DrillDownConstants.DATATYPE_MAPPING[dataTypeMap[uiColumnMap[temp['jsonKey'].path]]];
            }
            temp['dataType'] = isNullOrUndefined(dataType) ? 'TEXT' : dataType;
          }
          // headers.push(temp);
          headers[columnMap[key]] = temp;
        }
      } 
      if(!flag && index != -1 && index != DrillDownConstants.HIE_LEVELS.length-1){
        headers[columnInd].dataType = 'POPUP';
        headers[columnInd]['popupInfo'] = {
          component : "drillPopup",
          data: {
            level : headers[columnInd].name
          }
        }
      }
      return headers;
    }
  }
  /** End of Convert Column mapping to Header Format */


  /** Deflattens Obj */
  deflattenObject(obj: Object) {
    let type = typeof obj;
    var result = {};
    if(type == 'object' && !(obj instanceof Array)){
      for(let i in obj) {
        let allKeys = i.split('.');
        let temp = result, length = allKeys.length;
        let lastKey = allKeys[length - 1];
        allKeys.forEach((key, i) => {
          if(i < (length-1)){
            temp[key] = temp[key] || {};
            temp = temp[key];
          }
        });
        temp[lastKey] = obj[i];
      }
      return result;
    }else{
      return obj;
    }
  }
  /** End of Deflatten Obj */
}
