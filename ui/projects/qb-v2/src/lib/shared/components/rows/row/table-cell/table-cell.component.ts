import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupConstant } from './../../../../../table/constants/popup.constant';
import { TableConstantSkeletonObject } from './../../../../../table/constants/table.constant';
import { DataTableEventsService } from 'projects/qb-v2/src/lib/table/components/data-table/data-table-events.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'lib-table-cell, [lib-table-cell]',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.css']
})
export class TableCellComponent implements OnInit {

  @Input() cellData: any;
  @Input() isTotalData: boolean;
  @Input() hieType: string;
  @Input() lastLevel: string;
  // @Input() template: TemplateRef<any>;

  currentTemplate: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private tableEventsHandler: DataTableEventsService) { }

  child: string;
  parent: string;
  location: string;
  updatedChild: string;
  stateData: object = {};
  locationObj: object = {};
  defaultQueryParams: {};

  ngOnInit() {
    this.defaultQueryParams = TableConstantSkeletonObject.defaultQueryParams;
    this.route.queryParams.subscribe((params) => {
      this.child = this.route.snapshot.queryParams[this.defaultQueryParams['child']] || 'district';
      this.parent = this.route.snapshot.queryParams[this.defaultQueryParams['parent']]|| 'state';
      this.location = this.route.snapshot.queryParams[this.defaultQueryParams['location']] || 'AndhraPradesh##28';
    })
  }

  updateState(index) {
    this.stateData = this.cellData.values[index];

    this.parent = this.parent + '&' + this.child;
    this.location = this.location + '&' + this.stateData['location'];
    this.child = this.stateData['child'];
    
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        parent: this.parent,
        child: this.child,
        location: this.location
      },
      queryParamsHandling: 'merge'
    });

    if (this.stateData[this.defaultQueryParams['child']] === this.lastLevel) {
      return;
    }

  }

  popupCalled(index) {
    const modalRef = this.modalService.open(PopupConstant[this.cellData.popupInfo.component]);
    modalRef.componentInstance.data = this.cellData;
    modalRef.result.then(info => {
      this.tableEventsHandler.popupInformation.next(info);
    });
  }

}
