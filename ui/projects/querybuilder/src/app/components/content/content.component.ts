import { QBCnst } from './../../constants/proj.cnst';
import { HttpService } from './../../services/http.service';
import { CommonService } from './../../services/common.service';
import { EventsService } from './../../services/events.service';
import { Subscription } from 'rxjs';
import { AggAttrListComponent } from './../agg-attr-list/agg-attr-list.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../services/data.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'qb-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  subscriptions:Subscription[] = [];

  filterAttrs: Array<any> = [];
  aggFilterAttrs: any[] = [];
  index: string;
  attributes: any[] = [];

  postdata: any = {};
  result: any;

  columnSelection: string;
  selectedTableCols = [];

  constructor(
    private _modalService: NgbModal,
    private evSrv: EventsService,
    private dataSrv: DataService,
    private commonSrv: CommonService,
    private httpSrv: HttpService
    // private _toastrSrv: ToastrService
  ) { }

  ngOnInit() {
    this.subscribeEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  addAggAttr() {
    const modalRef = this._modalService.open(AggAttrListComponent);
    let attrs = this.attributes.map((at) => {
      if(!!at.aggStatus) {
        let val = this.aggFilterAttrs.filter((f) => f.fieldName == at.fieldName);
        if(val.length <= 0) {
          at.aggStatus = false;
        }
      }
      return at;
    })
    modalRef.componentInstance.attributes = attrs;
  }

  subscribeEvents() {
    const filterAttrSub = this.evSrv.filterAttr.subscribe((res: any[]) => {
      this.filterAttrs = this.dataSrv.getFilterAttrs();
    })

    const aggFilterSub = this.evSrv.aggFilterAttr.subscribe((res: any[]) => {
      this.aggFilterAttrs = res;
    })

    const indexSub = this.evSrv.index.subscribe((selectedIndex: string) => {
      this.index = selectedIndex;
    })

    const attributes = this.evSrv.attributes.subscribe((attr: any[]) => {
      this.attributes = attr;
    })

    this.subscriptions.push(filterAttrSub);
    this.subscriptions.push(aggFilterSub);
  }

  generateQuery() {
    this.postdata = null;

    let isFiltersValid: boolean = true;
    let isAggFiltersValid: boolean = true;



    for(let i=0;i<this.filterAttrs.length; i++) {
      let f = this.filterAttrs[i];

      if(!f.status || isNullOrUndefined(f.operation) || f.operation == '-1' || 
          ((f.operation == 'Range' && isNullOrUndefined(f.filterRangeVal) ) || isNullOrUndefined(f.filterVal))
        ) {
        let msg = (isNullOrUndefined(f.operation) || f.operation == '-1') ? 'Please select operation type for ' : "Please provide value for ";
        this.commonSrv.showToastMessage(msg+f.fieldName, "error", {})
        isFiltersValid = false;
        break;
      }
    }

    for(let j=0; j<this.aggFilterAttrs.length; j++) {
      let f = this.aggFilterAttrs[j];
      if(!f.aggStatus || isNullOrUndefined(f.aggOperation) || f.aggOperation == '-1') {
        this.commonSrv.showToastMessage("Please select aggregation operation for "+f.fieldName, "error", {})
        isAggFiltersValid = false;
        break;
      }
    }

    if(!!isFiltersValid && !!isAggFiltersValid) {
      this.postdata = JSON.parse(JSON.stringify(QBCnst.REQUEST_FORMAT).replace(/REPLACE_WITH_INDEX/g, this.index));
      this.postdata.rangeQuerySet = {};
      if(this.aggFilterAttrs.length > 0) {
        this.postdata.aggregateQueryMap = QBCnst.AGGREGATE_FORMAT;
      }



      for(let i=0; i<this.filterAttrs.length; i++) {
        let f = this.filterAttrs[i];

        if (f.operation == 'Range' || f.operation == 'range') {
          // var rangeset={lower: f.filterVal, higher: f.filterRangeVal};
          var rangeset={Lte: f.filterVal, Gte: f.filterRangeVal};

          /* 
          if(this.postdata.match[f.parentKeypath] != null){
            this.postdata.match.delete(f.parentKeypath);
          }
          */
          this.postdata.rangeQuerySet[f.parentKeypath] = rangeset;
        }
        else {

          /*  
          if(this.postdata.rangeQuerySet[f.parentKeypath]! = null){
            this.postdata.rangeQuerySet.delete(f.parentKeypath);
          }*/

          if (f.dataType.toLowerCase() == 'long' || f.dataType.toLowerCase() == 'int') {
            this.postdata.terms[f.parentKeypath] = f.filterVal;
          } else {
            // this.postdata.match[f.parentKeypath] = f.filterVal;
            this.postdata.termsString[f.parentKeypath] = f.filterVal;
          }

          f.filterRangeVal=null;
        }

      }

      for(let j=0; j<this.aggFilterAttrs.length; j++) {
        let f = this.aggFilterAttrs[j];
        if(f.aggOperation == 'count') {
          this.postdata.aggregateQueryMap["1"].termsQuery = this.postdata.aggregateQueryMap["1"].termsQuery || {terms: {}};
          this.postdata.aggregateQueryMap["1"].termsQuery.terms[f.uiName] = f.parentKeypath 
        }else {
          this.postdata.aggregateQueryMap["1"].sumQuery = this.postdata.aggregateQueryMap["1"].sumQuery || {terms: {}};
          this.postdata.aggregateQueryMap["1"].sumQuery.terms[f.uiName] = f.parentKeypath  
        }     
      }

      this.columnSelection = "";

      for(let j=0;j < this.selectedTableCols.length;j++){
          let g=this.selectedTableCols[j];
          if(typeof g == "string"){
            let x = (<String>g);
            let y = x.indexOf(".keyword");
            if(y==-1){
              this.columnSelection += g;
              this.columnSelection += "~";
            }
            else {
              let z = x.substr(0, y);
              this.columnSelection += z;
              this.columnSelection += "~";
            }
          }
      }

      this.postdata.source = this.columnSelection;
      this.getDataForQuery(this.postdata);
    }

  }

  getDataForQuery(pd) {
    this.result = 'loading...';
    this.httpSrv.makePostApiCall("GET_QUERY", pd).subscribe((res) => {
      this.result = res;
    }, (err) => {
      console.log(err);
      this.result = "Unable to reach servers.";
    })
  }
  

}
