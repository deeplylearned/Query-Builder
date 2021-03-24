import { TableDefaultConstants } from './../../table/constants/table.constant';
import { isNullOrUndefined, isNumber } from 'util';
import { Injectable } from '@angular/core';
import { DataTableEventsService } from '../../table/components/data-table/data-table-events.service';

@Injectable({
  providedIn: 'root'
})
export class DataTableService {

  // locationType: LocationConstant = {
  //   name: 'REPLACEWITHCURRENTLOCATION',
  //   url: ['entityName', 'entityId'],
  //   child: 'mandal',
  //   jsonkey: 'entityName',
  //   dataType: 'FINALLOCATION'
  // }
  columnConstantDefaultValues = TableDefaultConstants.columnConstantDefaultValues;
  obj:object = {};

  constructor(private tableEventsHandler: DataTableEventsService) { }

  formatTable(cons, data, locationConstant, currentLocation) {

    if(!isNullOrUndefined(cons) && !isNullOrUndefined(data) && (!isNullOrUndefined(locationConstant) || !isNullOrUndefined(currentLocation))){
      let consCopy = {...cons}, dataCopy = {...data}, formattedTableCons: any = {};
      let flattenedData = this.flattenObject(data);
      let basicTableConfig = this.getBasicSettings(cons);
      
      let columns = consCopy.columns;
      let formattedCols = this.getFormattedColumns(columns, locationConstant);
      let { formattedHeaders, totalCols, maxDepth, dataTypes, jsonKeys} = {...this.getHeaders(formattedCols, locationConstant)};
      
      let { recordData, totalData } = {...this.getRecordData(flattenedData, dataTypes, jsonKeys, cons, locationConstant, currentLocation, basicTableConfig.totalRow)}

      formattedTableCons = {
        ...basicTableConfig,
        headers: formattedHeaders,
        totalCols: totalCols+1,
        maxDepth,
        dataTypes,
        recordData,
        totalData
      }
      return formattedTableCons;
    }
    else{
      let reason = isNullOrUndefined(cons) ? 'Constant' : isNullOrUndefined(data) ? 'Data' : 'Location Type or Current Location';
      console.log(reason+' should not be null or undefined');
      return {};
    }
  }
  
  getBasicSettings(cons) {
    let basicConfig = {...TableDefaultConstants.tableBasicConfig};
    let formattedBasicConfig = {...basicConfig, ...cons};
    delete formattedBasicConfig['columns'];
    return formattedBasicConfig;
  }

  getFormattedColumns(columns, locationConstant){
    let headersData = {}, jsonKey = {}, dataTypes = {}, constant = [];
    if(!isNullOrUndefined(columns) && columns.length > 0){
      columns.forEach((column) => {
        let columnInfo =  this.getFormattedColumnConstant(column, locationConstant);
        constant.push(columnInfo);
      })
      return constant;
    }else{
      console.log('Columns should not be null or undefined');
      return constant;
    }
  }

  getFormattedColumnConstant(column, locationConstant){
      let obj;
      if(column instanceof Object && !isNullOrUndefined(column)){
        let parent = !isNullOrUndefined(column.childs) ? true : false;
        obj = this.getInfoOfColumn(column, parent, locationConstant);
        if(parent){
            obj.childs = [];
            obj.class = column.class;
            column.childs.forEach((child) => {
                let childInfo = this.getFormattedColumnConstant(child, locationConstant);
                obj.childs.push(childInfo);
            })
        }else{
            obj = {...column, ...obj};
        }
      } else{
          obj = {...column};
          console.log("Not An Object");
      }
      return obj;
  }

  getInfoOfColumn(info, parent, locationConstant){
    let obj:any = {};
    if(!parent){
        if(!isNullOrUndefined(info.jsonKey) && (!isNullOrUndefined(info.jsonKey.path) || !isNullOrUndefined(info.jsonKey.type))){
            obj.jsonKey = {};
            if(!isNullOrUndefined(info.jsonKey.type)){
                obj.jsonKey.type = info.jsonKey.type;
                obj.jsonKey.path = locationConstant.jsonkey;
                obj.sortOrderList = !isNullOrUndefined(info.sortOrderList) ? info.sortOrderList : null;
            }
            else{
                obj.jsonKey.path = info.jsonKey.path;
            }
            obj.dataType = !isNullOrUndefined(info.dataType) ? info.dataType : 
                            !isNullOrUndefined(info.jsonKey.type) && info.jsonKey.type == 'dynamic' ? 'LOCATION' : 'TEXT';
            obj.name = !isNullOrUndefined(info.name) ? info.name : obj.jsonKey.path;
            obj.defaultValue = !isNullOrUndefined(info.name) ? info.defaultValue : '-';
            obj.class = !isNullOrUndefined(info.class) ? info.class : 'tc-bg-01';
        }
        else{
            console.log("Jsonkey cannot be null or undefined and either path or type has to defined for a column");
            return obj;
        }
    } else{
      obj.name = !isNullOrUndefined(info.name) && !!info.name ? info.name : 'No Header';
    }
    return obj;
  }

  getHeaders(columns, locationType) {
    let maxDepth = 1, totalCols = 0, start_sortIndex = 0, formattedHeaders = [], dataTypes = [], jsonKeys = [];
    getMaxDepth(columns, maxDepth);
    calculateRowAndColSpan(columns, locationType);

    return {formattedHeaders, totalCols, maxDepth, dataTypes, jsonKeys};

    function getMaxDepth(headers, level){
      headers.forEach((header) => {
        header.level = level;
        if(!isNullOrUndefined(header.childs) && header.childs.length > 0){
          getMaxDepth(header.childs, level+1);
          header.sortable = false;
          header.filter = false;
        }else{
          maxDepth = level > maxDepth ? level : maxDepth;
          if(isNullOrUndefined(header.sortable) || !!header.sortable){
            header.sortIndex = start_sortIndex;
            header.sortable = true;
            header.sortOrder = false;
          }else{
            header.sortable = false;
          }
          dataTypes.push(getDataTypeForColumn(header, locationType));
          jsonKeys.push({...header});
          start_sortIndex += 1;
          totalCols += 1;
        }
      })
    }

    function calculateRowAndColSpan(headers, locationType){
      if(isNullOrUndefined(headers)){
        console.log('trying to calculate rowspan and colspan for null or undfined');
        return;
      }
      headers.forEach((header) => {
        calculateRowAndSpanForHeader(header, maxDepth);
      })

      function calculateRowAndSpanForHeader(header, level){
        header.cols = 0;
        if(!isNullOrUndefined(header.childs) && header.childs.length > 0) {
          level -= 1;
          header.childs.forEach((child) => {
            calculateRowAndSpanForHeader(child, level);
            header.cols += child.cols;
          })
          header.rows = 1;
          insertHeaderInRow(header)
        }else{
          header.rows = level;
          header.cols += 1;
          insertHeaderInRow(header);
        }
      }
    }

    function insertHeaderInRow(header){
      let finalHeaderFormat = {};
      
      if(!isNullOrUndefined(header)){
        finalHeaderFormat['name'] = !isNullOrUndefined(header.name) ? (header.dataType == 'LOCATION' ? locationType.name : header.name) : 'No Header';
        finalHeaderFormat['class'] = !isNullOrUndefined(header.class) ? header.class : 'tc-bg-01';
        finalHeaderFormat['cols'] = !isNullOrUndefined(header.cols) ? header.cols : 1;
        finalHeaderFormat['rows'] = !isNullOrUndefined(header.rows) ? header.rows : 1;
        finalHeaderFormat['sortIndex'] = header.sortIndex;
        finalHeaderFormat['sortOrder'] = header.sortOrder || 'asc';
        finalHeaderFormat['sortable'] = !isNullOrUndefined(header.sortable) ? header.sortable : true;
        finalHeaderFormat['filter'] = !isNullOrUndefined(header.filter) ? header.filter : false;
        finalHeaderFormat['level'] = header.level;
        formattedHeaders[header.level-1] = formattedHeaders[header.level-1] || [];
        formattedHeaders[header.level-1].push(finalHeaderFormat);
      }else{
        console.log('trying to insert null or undefined header in header rows');
      }
    }

    function getDataTypeForColumn(column, locationType) {
      if(column.dataType == 'LOCATION'){
        return !isNullOrUndefined(locationType) ? [locationType.dataType] : 'LOCATION';
      } else if(column.dataType == ''){
        return column.dataType = 'TEXT';
      }else{
        return (!isNullOrUndefined(column) && !isNullOrUndefined(column.dataType)) ? column.dataType.split('##') : 'TEXT';
      }
    }
  }

  getRecordData(data, dataTypes, jsonKeys, cons, locationType, currentLocation, totalInfo) {
    let recordData = [], totalData = [];
    totalInfo = totalInfo || TableDefaultConstants.tableBasicConfig.totalRow;

    // console.log("getRecord data", locationType);

    let totalRow = totalInfo.name || 'BACKEND';
    let totalKey = totalInfo.jsonKey || '-1';
    data.forEach(record => {
      if(record.entityId == totalKey){
        totalData.push(this.getRowData(record, dataTypes, jsonKeys, cons, locationType, currentLocation));
      }else{
        let eachRowData = this.getRowData(record, dataTypes, jsonKeys, cons, locationType, currentLocation);
        recordData.push(eachRowData);
      }
    })
    if(totalRow === 'UI'){
      console.log('Compute total row');
    }
    return {recordData, totalData};
  }

  getRowData(record, dataTypes, jsonKeys, cons, locationType, currentLocation) {
    let rowData = [];
    // console.log("get RowData", locationType);
    if(!isNullOrUndefined(cons.tableInfo) && !isNullOrUndefined(cons.tableInfo.type) && cons.tableInfo.type.toUpperCase() === 'ROWGROUP'){
      console.log('need to have other logic');
    }else{
      jsonKeys.forEach((key) => {
        let obj = {};
        obj = this.getValueFromJsonKey(record, key.jsonKey, key.dataType, locationType, currentLocation);
        obj['class'] = key.class || 'tc-bg-01';
        obj['template'] = key.template || null;
        obj['storeData'] = key.storeData;  
        if(!isNullOrUndefined(key.popupInfo)){
          obj['popupInfo'] = key.popupInfo || {component: null, data: {}};     
        }
        obj['sortOrderList'] = key.sortOrderList || null;
        rowData.push(obj);
      })
    }
    return rowData;
  }

  getValueFromJsonKey(record, dataKey, dataTypes, locationType, currentLocation) {
    let values = [];
    // console.log("getValue from JsonKey", locationType)
    
    if(!isNullOrUndefined(dataKey) && (!isNullOrUndefined(dataKey.path) || !isNullOrUndefined(dataKey.type))){
      // console.log(dataKey.type);
      let keys = !isNullOrUndefined(dataKey.type) ? [dataKey.type] : dataKey.path.split('##');
      let operation = dataKey.operation || null;
      let obj = {};
      keys.forEach(key => {
        let finalDataObject = {};
        if(!isNullOrUndefined(dataKey.type) && dataKey.type){
          switch(dataKey.type.toUpperCase()){
            case 'LOCATION':
              console.log("location:: ",locationType);
              finalDataObject = this.getValuesForTypeLocation(record, locationType, currentLocation);
              break;
            case 'DYNAMIC':
              // console.log("location:: ",locationType);
              finalDataObject = this.getValuesForTypeLocation(record, locationType, currentLocation);
              break;
            case 'ARRAY':
              finalDataObject = this.getAllValuesInArray(record[key], operation);
              break;
            case 'OBJECT':
              finalDataObject = [];
              break;
            default:
              finalDataObject = !isNullOrUndefined(record[key]) ? record[key] : '-';
              break;
          }
        }else{
          finalDataObject = !isNullOrUndefined(record[key]) ? record[key] : '-';
        }
        values.push(finalDataObject);
      });
      if(isNullOrUndefined(dataKey.type)) {
        obj['dataType'] = !isNullOrUndefined(dataTypes) ? dataTypes.split('##') : ['TEXT'];
      }else {
        obj['dataType'] = [locationType.dataType];
      }
      
      if(!isNullOrUndefined(operation) && operation.toUpperCase() !== 'CONCAT'){
        values = this.getResultOfOperation(values, operation);
        if(values.length > 1){
          obj['dataType'] = ['ARRAY'];
          obj['operation'] = 'CONCAT';
        }
      }else if(!isNullOrUndefined(operation) && operation.toUpperCase() === 'CONCAT'){
        obj['operation'] = 'CONCAT';
      }
      obj['values'] = values;
      return obj;
    }else if(!isNullOrUndefined(dataKey) && !isNullOrUndefined(dataKey.defaultValue)){
      let obj: any = {};
      obj.dataType = !isNullOrUndefined(dataTypes) ? dataTypes.split('##') : ['TEXT'];
      obj.values = [dataKey.defaultValue];
      return obj;
    }else{
      return '-';
    }
  }

  getValuesForTypeLocation(record, locationType, currentLocation) {
    // console.log("locationType:: ",locationType);
    let obj = {};
    if(!isNullOrUndefined(locationType)){
      obj['value'] = !isNullOrUndefined(locationType.jsonkey) && !isNullOrUndefined(record[locationType.jsonkey]) ? record[locationType.jsonkey] : '-';
      obj['child'] = locationType.child || 'district';
      obj['location'] = this.getLocation(locationType.url, record);
      obj['parent'] = currentLocation;
    }else{
      console.log('locationType is Undefined or null unable to fetch the dynamic key');
    }
    return obj;
  }

  getAllValuesInArray(data, operation){
    if(!isNullOrUndefined(data)){
      // let val = data.map((record) => isNullOrUndefined(subKey) ? record :record[subKey]);
      return this.getResultOfOperation(data, operation);
    }else{
      return '-';
    }
  }

  getResultOfOperation(values, operation){
    var validOperations = ['SUM', 'MIN', 'MAX', 'SUBTRACT', 'MULTIPLY', 'AVG', 'ABSSUBTRACTION'];
    var result;
    if(operation == 'ABSSUBTRACTION'){
      // console.log('performing operation: ',values)
    }
    if(validOperations.indexOf(operation) !== -1 && values.every(value => (isNumber(Number(value)) && isFinite(Number(value))) ? true : false)){
      switch(operation){
        case 'SUM':
          result = values.reduce((s,v) => Number(s)+Number(v));
          break;
        case 'MIN':
          result = values.reduce((s,v) => Number(s) <= Number(v) ? s : v);
          break;
        case 'MAX':
          result = values.reduce((s,v) => Number(s) >= Number(v) ? s : v);
          break;
        case 'AVG':
          result = values.reduce((s,v) => Number(s)+Number(v));
          result = result/values.length;
          break;
        case 'SUBTRACT':
          result = values.reduce((s, v) => Number(s) - Number(v));
          break;
        case 'MULTIPLY':
          result = values.reduce((s,v) => Number(s)*Number(v));
          break;
        case 'ABSSUBTRACTION':
          result = values.reduce((s,v) => Math.abs(Number(s) - Number(v)));
          break;
        default:
          result = values.join(' ');
          break;
      }
      return [result];
    }else{
      return values;
    }
  }

  getLocation(url, record){
    let location = url.map((e) => !isNullOrUndefined(e) && !isNullOrUndefined(record[e]) ? record[e] : '');
    return location.join('##');
  }

  getLocationConstant(locationType, currentLocation) {
    currentLocation = !isNullOrUndefined(currentLocation) ? currentLocation.chartAt(0).toUpperCase()+currentLocation.substr(1).toLowerCase() : 'N/A';
    let res = {...locationType, locationType};
    return JSON.parse(JSON.stringify(res).replace(/REPLACEWITHCURRENTLOCATION/g,currentLocation));
  }

  flattenObject(data){
    return data.map((value, key) => flattenOneObject(value));

    function flattenOneObject(ob){
      var toReturn = {};
      for(var i in ob) {
        if(!ob.hasOwnProperty(i)) continue;
        if((typeof ob[i]) == 'object' && !(ob[i] instanceof Array)) {
          var flatObject = flattenOneObject(ob[i]);
          for(var x in flatObject) {
            if(!flatObject.hasOwnProperty(x)) continue;
            toReturn[i + '.' + x] = flatObject[x];
          }
        } else {
          toReturn[i] = ob[i];
        }
      }
      return toReturn;
    }
  }

  getCellInfo(rowInfo, e,i,headers) {
    let rowDetails = [...rowInfo];
    this.obj['event'] = e.type;
    this.obj['index'] = i;
    this.obj['headers'] = headers[0][i];
    rowDetails.push(this.obj);
    this.tableEventsHandler.cellClicked.emit(rowDetails);
  }
}
