import { isNullOrUndefined } from 'util';
import { IQuery } from './../../models/query';
import { Component, OnInit } from '@angular/core';
import { QbService } from '../../services/qb.service';
import { v4 as uuid } from 'uuid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../services/http.service';
import { CommonService } from '../../services/common.service';
import { SaveQueryPopupComponent } from '../save-query-popup/save-query-popup.component';
import { PouchdbService } from '../../services/pouchdb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseTypesPopupComponent } from '../response-types-popup/response-types-popup.component';
import { DataTableEventsService } from 'projects/qb-v2/src/lib/table/components/data-table/data-table-events.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'qb2-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {

  tableNameForDownload: string = "Query_Table";
  tableInfo: any = {};
  showTable: boolean = true;

  currentQuery: string | null = null;
  currentQueryInfo: any = null;
  disable: boolean = true;
  indexes: string[] = [];
  attributes: any[] = [];
  selectedIndex: string = '-1';
  selectedFilterAttrs: any[] = [];
  selectedAggFilters: any[] = [];
  outputCols: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private qbSrv: QbService,
    private httpSrv: HttpService,
    private commonSrv: CommonService,
    private _modalSrv: NgbModal,
    private pouchSrv: PouchdbService,
    private route: ActivatedRoute,
    private router: Router,
    private tableEventsHandler: DataTableEventsService
  ) {
    route.queryParams.subscribe((p) => {
      this.currentQuery = p['id'] || null;
      if (!isNullOrUndefined(this.currentQuery)) {
        this.getQueryInfo();
      } else {
        this.getAllIndexes();
        this.resetFields('all');
      }
    })
  }

  /**------------------------ Life Cycle Hooks -------------------------------- */
  /**
   * @description - On Init Get all Indexes
   */
  ngOnInit() {
    // this.getAllIndexes();
    this.tableInfo.cons = this.commonSrv.generateTableSkeletonObject();
    // this.tableInfo.cons = {};
    this.tableInfo.data = [];
    this.subscribeEvents();
  }

  ngOnDestroy(): void {
    this.resetFields('destroy');
    this.unsubscribeEvents();
  }
  /**-----------------------End of Life Cycle Hooks----------------------------- */

  /** ---------------------- Subscrbiing the popup event to keep track of drill down */

  subscribeEvents() {
    let popupInfoSub = this.tableEventsHandler.popupInformation.subscribe(info => {
      if (!(info['child'] == 'end')) {
        this.attributes.forEach(attr => {
          if (attr.uiName == info['child']) {
            let newAggFilter = { ...attr };
            newAggFilter.aggType = "groupBy"
            this.selectedAggFilters.push(newAggFilter);
          }
          if (attr.uiName == info['parent']) {
            this.selectedFilterAttrs = this.selectedFilterAttrs.filter(a => a.uiName != attr.uiName);
            let newFilterAttr = { ...attr };
            newFilterAttr.aggType = "-1";
            newFilterAttr.ot = "equals";
            newFilterAttr.value = [info['parentValue']];
            this.selectedFilterAttrs.push(newFilterAttr);
          }
        })
        this.getTableData();
      }
      this.subscriptions.push(popupInfoSub);
    })
  }

  unsubscribeEvents() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    })
  }

  /** End of events subscriptions */

  /**
   * @description - This method will return the query info of a query based on it's name.
   */
  getQueryInfo() {
    this.pouchSrv.getQueryInfo(this.currentQuery).then((res) => {
      this.currentQueryInfo = res;
      // this.selectedFilterAttrs = res.filters;
      // this.selectedAggFilters = res.aggFilters;
      // this.selectedIndex = res.index;
      // this.outputCols = res.outputCols;
      this.getAllIndexes();
    }, (err) => {
      console.log(err);
      this.router.navigate(['', 'query']);
      this.getAllIndexes();
    })
  }

  /**---------------------- API Calls to get indexes and attributes of that index ----------------------------*/
  /**
   * @description - This method will get all Indexes from elastic search.
   */
  getAllIndexes() {
    this.showTable = false;
    this.httpSrv.makeGetApiCall('GET_INDEXES').subscribe((res) => {
      // this.httpSrv.getMockData('Indexes').subscribe((res) => {
      this.indexes = res.result.content;
      // this.indexes = res;
      if (!isNullOrUndefined(this.currentQuery)) {
        // console.log(this.currentQueryInfo);
        if (this.indexes.indexOf(this.currentQueryInfo.index) != -1) {
          this.selectedIndex = this.currentQueryInfo.index;
          this.getAttributesOfIndex('load');
        } else {
          // console.log("Index not found");
          this.commonSrv.showToastMessage("Failed to Load Query", "error", {});
          this.resetFields('all');
        }
      } else {
        this.resetFields('index');
      }
    }, (err) => {
      console.log(err);
      this.commonSrv.showToastMessage("Something went wrong..Please try again after some time", "info", {});
      this.resetFields('all');
    })
  }

  /**
   * @description - This method will get called on change of index and get all attributes of the selected index. if selected Index is not equal to -1.
   */
  getAttributesOfIndex(src: string) {
    if (this.selectedIndex != '-1') {
      this.httpSrv.makeGetApiCall('GET_ATTRIBUTES_FOR_INDEX', { 'REPLACE_WITH_INDEX': this.selectedIndex })
        // this.httpSrv.getMockData('attrOfIndex')
        .subscribe((res) => {
          this.attributes = this.qbSrv.formatAttrs(res.result.content);
          if (!isNullOrUndefined(this.currentQuery) && src == 'load') {
            // this.selectedFilterAttrs = this.currentQueryInfo.filters.filter((f) => this.attributes.findIndex((at) => at.fieldName == f.fiedName) != -1);
            // this.selectedAggFilters = this.currentQueryInfo.aggFilters.filter((f) => this.attributes.findIndex((at) => at.fieldName == f.fiedName) != -1);
            // this.outputCols = this.currentQueryInfo.outputCols.filter((f) => this.attributes.findIndex((at) => at.fieldName == f.fieldName) != -1);
            // console.log(this.currentQueryInfo.filters.filter((f) => this.attributes.findIndex(at => at.fieldName == f.fieldName) != -1));
            // console.log(this.attributes);
            // console.log(this.selectedAggFilters, this.currentQueryInfo.aggFilters);
            // console.log(this.selectedFilterAttrs, this.currentQueryInfo.filters);
            // console.log("output: ",this.outputCols, this.currentQueryInfo.outputCols);
            // if(this.selectedAggFilters.length !== this.currentQueryInfo.length ||
            //     this.selectedFilterAttrs.length !== this.currentQueryInfo.aggFilters.length || 
            //     this.outputCols.length !== this.currentQueryInfo.outputCols.length) {
            //   this.commonSrv.showToastMessage("Failed to Load Query", "error", {});
            //   this.resetFields('all'); // If Query is not correct.
            // }

            this.selectedAggFilters = this.currentQueryInfo.aggFilters;
            this.selectedFilterAttrs = this.currentQueryInfo.filters;
            this.outputCols = this.currentQueryInfo.outputCols;

          } else {
            this.resetFields('attributes');
          }
          this.disable = false;
        }, (err) => {
          this.attributes = [];
          this.resetFields("attributes");
        })
    } else {
      this.commonSrv.showToastMessage("Select Index First", "success", {});
      this.resetFields("index");
    }
  }
  /**------------------------------------- End of API Call --------------------------------------------------*/

  /**
   * @description - This method will used to save query in pouchdb. Query will be saved only if it is having name and atleast one filter is selected.
   */
  saveQuery() {
    let queryResult = this.qbSrv.validateQuery(this.buildQueryInfo(), false);
    if (queryResult > 1) {
      const modalRef = this._modalSrv.open(SaveQueryPopupComponent);
      modalRef.componentInstance.valid = queryResult;
      modalRef.componentInstance.type = 'new';
      modalRef.result.then((res) => {
        // this.commonSrv.showToastMessage("Save Query with name "+res.queryName, "success", {});
        let queryInfo: IQuery = this.buildQueryInfo(res.queryName);
        this.pouchSrv.saveQuery(queryInfo).then((result) => {
          this.commonSrv.showToastMessage("Query Saved!", "success", {});
          this.router.navigate(['', 'query'], { queryParams: { id: res.queryName }, queryParamsHandling: 'merge' });
        }, (err) => {
          console.log(err);
        })
      }, (err) => {
        // this.commonSrv.showToastMessage("Don't Save Query", "error", {});
      });
    } else {
      let msg = "Please select" + (queryResult == 0 ? ' index and ' : '') + " atleast one filter to save query";
      this.commonSrv.showToastMessage(msg, "error", {});
    }
  }

  /**
   * @description - This method will update the existing query.
   */
  updateQuery() {
    let result = this.qbSrv.validateQuery(this.buildQueryInfo(this.currentQueryInfo.queryName), false);
    if (result > 1) {
      const modalRef = this._modalSrv.open(SaveQueryPopupComponent);
      modalRef.componentInstance.valid = result;
      modalRef.componentInstance.type = 'update';
      modalRef.componentInstance.queryName = this.currentQueryInfo.queryName;
      modalRef.result.then((res) => {
        let queryInfo: IQuery = this.buildQueryInfo(res.queryName);
        queryInfo._id = this.currentQuery;
        this.pouchSrv.saveQuery(queryInfo).then((result) => {
          this.commonSrv.showToastMessage("Query Updated Successfully", "success", {});
          // this.router.navigate(['', 'query'], {queryParams: {id: res.queryName}, queryParamsHandling: 'merge'});
        }, (err) => {
          console.log(err);
        })
      }, (err) => {
        // this.commonSrv.showToastMessage("Don't Update Query", "error", {});
      });
    } else {
      let msg = "Please select" + (result == 0 ? ' index and ' : '') + " atleast one filter to save query";
      this.commonSrv.showToastMessage(msg, "error", {});
    }
  }

  /**
   * 
   * @author - Madhu
   * @summary - Hello Executing
   * @description - This Method will execute the selected query and get the result of the query.
   */
  executeQuery() {
    this.showTable = false;
    this.tableInfo = {};
    const modelRef = this._modalSrv.open(ResponseTypesPopupComponent, { size: 'sm' });
    modelRef.result.then(s => {
      let query = this.buildQueryInfo();
      // If User Selected Download Type.
      if (!!s && !!s.downloadData) {
        this.qbSrv.executeQuery(query, true).then((res: any) => {
          // console.log("Query Component Result:: ",res);
          if (!!res.status) {
            this.commonSrv.showToastMessage("Downloaded Query", "success", {});
          } else {
            this.commonSrv.showToastMessage("Something went wrong..", "error", {});
          }
        }, (err) => {
          // console.log(err);
          this.commonSrv.showToastMessage("Something went wrong..please try again after some time", "error", {});
        })
      }
      if (!!s && !!s.displayData) {
        this.getTableData();
      }
      // else {
      //   // console.log("Invalid datsa found");
      // }
    }, e => {
      // console.log("Types dismissed");
    })
  }


  /**
   * 
   * @description - This Method will execute the selected query and get the result of the query and display it as table.
   */
  getTableData() {
    let query = this.buildQueryInfo();
    let dataTypeMap = {};
    this.attributes.forEach(a => {
      dataTypeMap[a.uiName] = a.dataType;
    });
    let flag: boolean;
    if (isNullOrUndefined(this.selectedAggFilters) || this.selectedAggFilters.length == 0) {
      flag = true;
    }
    this.qbSrv.getTableData(query, true, dataTypeMap, flag).then(res => {
      // console.log("Table Result:: ",res);
      this.showTable = true;
      this.tableInfo = res;
    }, err => {
      this.commonSrv.showToastMessage("Something went wrong..", "error", {});
    })
  }

  /**
   * 
   * @param name - Query Name(Optional) Default is ""
   * @description - This method will prepare query format from the selected inputs.
   * @returns - Actual Query Format.
   */
  buildQueryInfo(name ?: string) {
    let queryInfo: IQuery = {
      queryName: !isNullOrUndefined(name) ? name : "",
      index: this.selectedIndex,
      filters: this.selectedFilterAttrs,
      aggFilters: this.selectedAggFilters,
      outputCols: this.outputCols,
      _id: uuid()
    }
    return queryInfo;
  }

  /**
   * @param - Level 
   * @description - This method will reset all the properties of this component
   */
  resetFields(type: string) {
    switch(type) {
      case 'destroy':
        this.currentQuery = null;
        this.currentQueryInfo = null;
      case 'all':
        this.indexes = [];
        this.selectedIndex = '-1';
      case 'index':
        if(this.selectedIndex == '-1') {
          this.attributes = [];
          this.disable = true;
        }
      case 'attributes':
        this.selectedFilterAttrs = [];
        this.outputCols = [];
        this.selectedAggFilters = [];
        this.showTable = false;
        break;
    }
  }
}
