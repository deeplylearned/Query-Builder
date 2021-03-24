import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

         
  private indexes: Array<String> = [];
  private attributes: Array<any> = [];
  private filterAttrs: Array<any> = [];
  private aggFilterAttrs: Array<any> = [];
  private tableCols: Array<any> = [];
  private activeIndex: string = null;

  constructor(
    private httpSrv: HttpService
  ) { }

  getMockData(type: string): Observable<any>{
    return this.httpSrv.getMockData().pipe(map((res: any) => {
      if(type == 'Indexes') {
        return res.indexes;
      }else if(type == "attrOfIndex") {
        return res.student_attributes;
      }else if(type == 'valueOfAttr') {
        return res.freshRenewal;
      }else {
        console.warn("not a valid type");
        return null;
      }
    }));
  }

  setIndexes(val: Array<String>) {
    this.indexes = val;
  }

  getIndexes() {
    return this.indexes;
  }

  setAttrs(attrs: Array<any>) {
    this.attributes = attrs;
  }

  getAttrs() {
    return this.attributes;
  }

  setFilterAttrs(attrs: Array<any>) {
    this.filterAttrs = attrs;
  }

  getFilterAttrs() {
    return this.filterAttrs;
  }

  setAggFilterAttrs(attrs: Array<any>) {
    this.aggFilterAttrs = attrs;
  }

  getAggFilterAttrs() {
    return this.aggFilterAttrs;
  }

  setTableCols(cols: Array<any>) {
    this.tableCols = cols;
  }

  getTableCols() {
    return this.tableCols;
  }

  setActiveIndex(index) {
    this.activeIndex = index;
  }

  getActiveIndex() {
    return this.activeIndex;
  }
}
