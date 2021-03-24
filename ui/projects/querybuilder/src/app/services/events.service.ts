import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  indexOnChange = new Subject();
  attributes = new Subject();
  onAddAttr = new Subject();
  filterAttr = new Subject();
  aggFilterAttr = new Subject();
  index = new Subject();

  constructor(
    private dataSrv: DataService
  ) { }

  setIndex(ind) {
    this.dataSrv.setActiveIndex(ind);
    this.index.next(ind);
  }

  setFilterAttr(options) {
    this.dataSrv.setFilterAttrs(options);
    this.filterAttr.next(options);
  } 

  setAggFilterAttr(options) {
    this.dataSrv.setAggFilterAttrs(options);
    this.aggFilterAttr.next(options);
  }

  setAttributes(options) {
    this.dataSrv.setAttrs(options);
    this.attributes.next(options);
  }
}
