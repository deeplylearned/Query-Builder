import { HttpService } from './../../services/http.service';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'qb-filter-preview',
  templateUrl: './filter-preview.component.html',
  styleUrls: ['./filter-preview.component.scss']
})
export class FilterPreviewComponent implements OnInit {

  @Input('filters') filters:Array<any>; 

  filterVal: any[] = [];

  constructor(
    private httpSrv: HttpService,
    private evSrv: EventsService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.getAllOptionsForAttr();
  }

  getAllOptionsForAttr(attr) {
    if(!!attr.operation && attr.operation != '-1') {
      this.httpSrv.makeGetApiCall('GET_OPTIONS_FOR_ATTRIBUTE', {'REPLACE_WITH_INDEX':'student_master', 'ATTRIBUTE': attr.parentKeypath})
      .subscribe((res) => {
        attr.filterValues = res.result.content;
      }, (err) => {
        console.log(err);
        attr.filterValues = [];
      })
    }
  }

  deleteAttr(attr) {
    attr.status = false;
    attr.operation = '-1';
    attr.filterVal = null;
    attr.filterValues = [];
    attr.filterRangeVal = null;
    this.filters = this.filters.filter((f) => f.fieldName !== attr.fieldName);
    this.evSrv.setFilterAttr(this.filters);
  }

  

}
