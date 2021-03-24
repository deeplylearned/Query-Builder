import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { TableDefaultConstants } from '../../../table/constants/table.constant';
import { DataTableEventsService } from './../../../table/components/data-table/data-table-events.service';
import { Subscription } from 'rxjs';

@Component({
  selector: '[lib-header-row]',
  templateUrl: './header-row.component.html',
  styleUrls: ['./header-row.component.css']
})
export class HeaderRowComponent implements OnInit {

  @Input() headers:[];
  @Input() defaultSortOptions:object;
  @Input() indexCons: object;

  sortOptionsSub: Subscription;
  sortOptions: any = TableDefaultConstants.sortOptions;

  constructor(private tableEventsHandler: DataTableEventsService) { }

  ngOnInit() {
    this.sortOptions = { ...this.sortOptions, ...this.defaultSortOptions };
  }

  sortHeader(header) {
    if(!isNullOrUndefined(header)){
      let currentSortIndex, currentSortType;
      let currentSortOptions = !isNullOrUndefined(this.sortOptions) ? this.sortOptions : null;
      if(!isNullOrUndefined(currentSortOptions)){
          currentSortIndex = currentSortOptions.sortIndex;
          currentSortType = currentSortOptions.sortType;
      }
      let order = (!isNullOrUndefined(currentSortOptions) && (header.sortIndex == currentSortIndex)) ? (currentSortType == 'asc' ? 'desc' : 'asc')  : 'asc';
      this.sortOptions = { sortIndex : header.sortIndex, sortType: order};
      this.tableEventsHandler.sortOptions.next(this.sortOptions);
    }
  }

  getSortIconClass(header) {
    if(!!header.sortable){
      let sortOptions: any = this.sortOptions;
      if(!isNullOrUndefined(sortOptions)){
          let sortIndex = sortOptions.sortIndex;
          let sortType = sortOptions.sortType;
          if(header.sortIndex == sortIndex && !isNullOrUndefined(sortType)){
            return sortType.toUpperCase() !== 'ASC' ? 'fa fa-arrow-down' : 'fa fa-arrow-up';
        }
      }
      return 'fa fa-sort';
    }else{
      return '';
    }
  }

}
