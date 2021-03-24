import { TablePipe } from './../../../utils/table.pipe';
import { DataTableEventsService } from './../../../table/components/data-table/data-table-events.service';
import { Component, OnInit, Input, SimpleChanges, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Component({
  selector: '[lib-rows]',
  templateUrl: './rows.component.html',
  styleUrls: ['./rows.component.css']
})
export class RowsComponent implements OnInit {

  @Input() recordData: any;
  @Input() totalData: any;
  @Input() hieType : string;
  @Input() lastLevel: string;
  @Input() defaultSortOptions: any;
  @Input() dataTypes: any;
  @Input() totalCols: number;
  @Input() noData:boolean;
  @Input() customTemplates: TemplateRef<any>;
  @Input() headers: any;
  @Input() paginatorOptions: any;
  @Input() indexCons: object;

  config: any;
  page: any;
  sortOptionsSub: Subscription;
  tableDataRowsSub: Subscription;
  togglePageSub: Subscription;
  isTotalRowPresent: boolean;
  totalRowStatus: boolean;
  offset: number;

  sortOptions: any;
  filteredData: any = [];
  p: number;
  constructor(
    private tableEventsHandler: DataTableEventsService,
  ) {}

  ngOnInit(): void {
    this.filteredData = this.recordData;
    this.config = {
      itemsPerPage: this.paginatorOptions.limit,
      currentPage: this.p
    };
    this.sortOptions = this.defaultSortOptions;
    this.isTotalRowPresent = this.totalData.length === 0 ? false : true;
    this.offset = 0;
    this.getTotalRowStatus();
    this.updateRecordData();
    this.subscribeEvents();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateRecordData();
  }
  
  ngOnDestroy(): void {
    this.unsubscribeEvents();
  }

  updateRecordData(){
    let tableFilter = new TablePipe();
    if(!isNullOrUndefined(this.sortOptions)){
      this.filteredData = tableFilter.transform(this.recordData, 'vassarTableSorting', [this.sortOptions]);
    }
  }

  subscribeEvents() {
    this.sortOptionsSub = this.tableEventsHandler.sortOptions.subscribe((options) => {
      this.sortOptions = options;
      if(!isNullOrUndefined(this.sortOptions)){
        this.updateRecordData();
      }
    })
    this.togglePageSub = this.tableEventsHandler.togglePage.subscribe((options) => {
      this.config = options;
      this.offset = this.config.itemsPerPage * (this.config.currentPage - 1);
      this.getTotalRowStatus();
    })
  }

  unsubscribeEvents() {
    this.sortOptionsSub.unsubscribe();
    this.togglePageSub.unsubscribe();
  }

  getTotalRowStatus(){
    this.totalRowStatus = (this.config.itemsPerPage >= this.filteredData.length && this.totalData.length != 0) ? true : false;
  }

}
