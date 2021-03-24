import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'qb-agg-filter-preview',
  templateUrl: './agg-filter-preview.component.html',
  styleUrls: ['./agg-filter-preview.component.scss']
})
export class AggFilterPreviewComponent implements OnInit, OnDestroy {

  aggFilters: Array<any> = [];

  subsciptions: Subscription[] = [];

  constructor(
    private _evSrv: EventsService,
    private dataSrv: DataService
  ) { }

  ngOnInit() {
    this.subscribeEvents();
  }

  ngOnDestroy(): void {
    this.unsubscribeEvents();
  }

  subscribeEvents() {
    const aggFilterSub = this._evSrv.aggFilterAttr.subscribe((res: any) => {
      this.aggFilters = res;
    })

    this.subsciptions.push(aggFilterSub)
  }

  unsubscribeEvents() {
    this.subsciptions.forEach((s) => s.unsubscribe());
  }

  deleteAggAttr(attr) {
    attr.aggStatus = true;
    attr.aggOperation = '-1';
    // this._evSrv.setAttributes(this.aggFilters);
    this.aggFilters = this.aggFilters.filter((e) => e.fieldName !== attr.fieldName);
    this._evSrv.setAggFilterAttr(this.aggFilters);
  }

}
