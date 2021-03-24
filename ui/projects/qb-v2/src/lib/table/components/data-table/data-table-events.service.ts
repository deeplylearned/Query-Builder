import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTableEventsService {

  constructor() { }

  cellClicked = new EventEmitter<object[]>();

  recordData = new Subject<object[]>();

  totalData = new Subject<object[]>();
  
  data = new Subject<object[]>();

  sortOptions = new Subject();

  togglePage = new Subject();

  popupInformation = new Subject();
}
