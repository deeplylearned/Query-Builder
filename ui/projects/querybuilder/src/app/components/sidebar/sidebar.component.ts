
import { DataService } from './../../services/data.service';
import { HttpService } from './../../services/http.service';
import { EventsService } from './../../services/events.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { QBCnst } from '../../constants/proj.cnst';

@Component({
  selector: 'qb-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input("indexApi") indexApi;
  @Input("getAttributesForIndexApi") getAttributesForIndexApi;

  @Output('onAddingAttr') onAddingAttr = new EventEmitter<any>();

  selectedIndex:string = '-1';
  attributes = [];
  indexes: string[] = [];
  
  constructor(
    private evSrv: EventsService,
    private httpSrv: HttpService,
    private dataSrv: DataService
  ) { }

  ngOnInit() {
    this.getAllIndexes();
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.evSrv.filterAttr.subscribe((filter: any) => {
    })
  }

  getAllIndexes() {
    this.httpSrv.makeGetApiCall(this.indexApi).subscribe((res) => {
    // this.dataSrv.getMockData('Indexes').subscribe((res) => {
      this.indexes = res.result.content;
      // this.indexes = res;
    }, (err) => {
      console.log(err);
      this.indexes = [];
      this.resetFields();
    })
  }

  onIndexChange() {
    this.evSrv.indexOnChange.next({index: this.selectedIndex});
    if(this.selectedIndex != '-1') {

      this.evSrv.setIndex(this.selectedIndex); // update Index

      this.httpSrv.makeGetApiCall(this.getAttributesForIndexApi, {'REPLACE_WITH_INDEX':this.selectedIndex})
      // this.dataSrv.getMockData('attrOfIndex')
      .subscribe((res) => {
        this.attributes = res.result.content;
        this.attributes.forEach((a) => {
          a = this.addExtraAttrs(a);
        })
        this.evSrv.setAttributes(this.attributes);
        this.evSrv.setFilterAttr([]);
      }, (err) => {
        console.log(err);
        this.attributes = [];
        this.resetFields();
      })
    }else {
      this.attributes = [];
      this.resetFields();
    }
  }

  addExtraAttrs(a) {
    a.status = false;
    a.operation = '-1';
    a.aggStatus = false;
    a.aggOperation = '-1';
    a.filterVal = null;
    a.aggFilterVal = null;
    a.filterValues = [];
    a.filterRangeVal = null;
    a.isAggListOpened = false;
    a.isTableColsListOpened = false;
    if(!isNullOrUndefined(a.childObject)) {
      a.isOpened = false;
      a.childObject.forEach(ele => {
        ele = this.addExtraAttrs(ele);
      }); 
      return a;
    }else {
      return a;
    }
  }

  addAttribute() {
    let filters = this.getAllFiltersWithStatusTrue(this.attributes, null, null);
    this.evSrv.setFilterAttr(filters);
  }

  getAllFiltersWithStatusTrue(filters, parent, parentKey) {
    let filtersWithStatusTrue = []
    filters.forEach((f) => {

      let path = !isNullOrUndefined(parent) ? parent+QBCnst.PATH_SEPARATOR+f.uiName : f.uiName;
      let keyPath = !isNullOrUndefined(parentKey) ? parentKey+QBCnst.KEY_SEPARATOR+f.fieldName : f.fieldName;

      if(!isNullOrUndefined(f.childObject)) {
        filtersWithStatusTrue =  filtersWithStatusTrue.concat(this.getAllFiltersWithStatusTrue(f.childObject, path, keyPath));
        // return true;
      }else {
        // f.status = !isNullOrUndefined(parent) ? true : false;
        if(f.status) {
          f.parentPath = path;
          f.parentKeypath = keyPath;
          filtersWithStatusTrue.push(f);
        }
        // return f.status;
      }
    })
    return filtersWithStatusTrue;
  }

  changeStatusOfChilds(attr, val) {
    attr.childObject.forEach((e) => {
      e.status = val;
      if(!isNullOrUndefined(e.childObject)) {
        this.changeStatusOfChilds(e, attr.status); 
      }
    })
  }

  checkAllStatusOfChilds(attr) {
    let val = true;
    attr.childObject.forEach((e) => {
      if(!isNullOrUndefined(e.childObject)) {
        val = this.checkAllStatusOfChilds(e.childObject);
        if(!val) {
          e.status = val;
        }
      }
      else if(!e.status) {
        val = false;
      }
    })
    return val;
  }

  changeParentStates(sub, id) {
    let parents = id.split('_').slice(0, -1);
    this.attributes.filter((f) => {
      if(f.fieldName == parents[0]) {
        f.status = sub.status == false ? false : f.status;
      }
    })
  }

  resetFields() {
    this.evSrv.setAttributes([]);
    this.evSrv.setFilterAttr([]);
    this.evSrv.setAggFilterAttr([]);
  }

}
