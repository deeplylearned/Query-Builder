import { Component, OnInit, Input } from '@angular/core';
import { DataTableEventsService } from '../../../table/components/data-table/data-table-events.service';

@Component({
  selector: 'lib-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @Input() recordData: any;
  @Input() paginatorOptions: any;

  limit:number;
  dropdownOptions: object[];
  maxSize: number;
  directionLinks: boolean;
  autoHide: boolean ;
  previousLabel: string; 
  nextLabel: string;


  constructor( private tableEventsHandler: DataTableEventsService ) { }

  ngOnInit() {
    this.limit = this.paginatorOptions.limit;
    this.dropdownOptions = this.paginatorOptions.dropdownOptions;
    this.maxSize = this.paginatorOptions.maxSize || 5;
    this.directionLinks = this.paginatorOptions.directionLinks || 'true';
    this.autoHide = this.paginatorOptions.autoHide || 'true';
    this.previousLabel = this.paginatorOptions.previousLabel || 'Previous';
    this.nextLabel = this.paginatorOptions.nextLabel || 'Next';
    
  }

  pageChanged(page){
    let options = {
      'currentPage': page,
      'itemsPerPage': this.limit
    }
    this.tableEventsHandler.togglePage.next(options);
  }

  limitChanged(limit){
    limit = limit == -1 ? this.recordData.length : limit;
    let options = {
      'currentPage': 1,
      'itemsPerPage': limit
    }
    this.tableEventsHandler.togglePage.next(options);
  }

}
