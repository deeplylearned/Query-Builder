import  merge from 'ts-deepmerge';

import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { TableDefaultConstants } from '../../../table/constants/table.constant';
import { DataService } from '../../../services/common/data.service';
import { DataTableService } from '../../../services/common/data-table.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TableHeaderFixerDirective } from '../../../directives/table-header-fixer.directive';
import { DataTableEventsService } from './data-table-events.service';
import { TableConstantSkeletonObject } from './../../constants/table.constant'


@Component({
  selector: 'lib-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() cons: object;
  @Input() data: object[];
  @Input() tableNameForDownload: string;
  @Input() loader: boolean;
  @Input() tableType: string;
  @Input() hieType: string;
  @Input() lastLevel: string;
  @Input() currentState: string;
  @Input() tableId: string;
  @Input() customTemplates: TemplateRef<any>;
  @Input() metaData: object;

  @ViewChild(TableHeaderFixerDirective) tablefixer: TableHeaderFixerDirective;

  child: string;
  parent: string
  location: string;
  sortOptions = TableDefaultConstants.sortOptions;
  tableData: any = {};
  locationConstant: object = {};
  masterRecordData: any;
  masterTotalData: any;
  noData: boolean = false;
  paginatorOptions: any;
  headerFixerOptions: any;
  headerCons: object[];
  indexCons: object;
  private recordDataSub: Subscription;
  private totalDataSub: Subscription;
  private dataSub: Subscription;

  constructor(private commonDataService: DataService,
    private tableService: DataTableService,
    private route: ActivatedRoute,
    private tableEventsHandler: DataTableEventsService) { }

  ngOnInit() {
    if (this.data.length == 0 || isNullOrUndefined(this.data)) {
      this.noData = true;
    }
    if (Object.entries(this.cons).length === 0) {
      console.log("Taking default configurations");
      console.log("Pass the required constants");
      this.cons = { ...TableConstantSkeletonObject.cons };
    }
    let optionsLength = this.cons['paginatorOptions'].dropdownOptions.length;
    if(optionsLength != 0){
      TableConstantSkeletonObject.cons['paginatorOptions'].dropdownOptions = [];
    }
    this.cons = merge(TableConstantSkeletonObject.cons, this.cons);
    this.paginatorOptions = this.cons['paginatorOptions'];
    this.headerFixerOptions = this.cons['tableHeaderFixerInfo'];
    this.headerCons = this.cons['columns'];
    this.indexCons = this.cons['indexCons'];
    if (!isNullOrUndefined(this.cons) && !isNullOrUndefined(this.cons['sortOptions'])) {
      this.sortOptions = this.cons['sortOptions'];
    }
    this.updateStateData();
    this.subscribeEvents();

  }

  subscribeEvents() {
    this.recordDataSub = this.tableEventsHandler.recordData.subscribe(data => {
      if (data.length == 0 || isNullOrUndefined(data)) {
        this.noData = true;
      } else {
        this.noData = false;
      }
      this.tableData.recordData = data;
    });
    this.totalDataSub = this.tableEventsHandler.totalData.subscribe(data => {
      this.tableData.totalData = data;
    });
    this.dataSub = this.tableEventsHandler.data.subscribe(data => {
      this.data = data;
      this.tableData.recordData = data;
      this.updateStateData();
    });
    this.tableEventsHandler.togglePage.subscribe(() => {
      setTimeout(() => {
        this.tablefixer.process();
      }, 10);
    });
    this.tableEventsHandler.sortOptions.subscribe(() => {
      setTimeout(() => {
        this.tablefixer.process();
      }, 10);
    })
  }

  takeBackup = () => {
    this.masterRecordData = this.tableData.recordData ? JSON.parse(JSON.stringify(this.tableData.recordData)) : [];
    this.masterTotalData = this.tableData.totalData ? JSON.parse(JSON.stringify(this.tableData.totalData)) : [];
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateStateData();
  }

  updateStateData() {
    let defaultQueryParmas = TableConstantSkeletonObject.defaultQueryParams;
    this.child = this.route.snapshot.queryParams[defaultQueryParmas.child] || 'district';
    this.parent = this.route.snapshot.queryParams[defaultQueryParmas.parent] || 'state';
    this.location = this.route.snapshot.queryParams[defaultQueryParmas.location] || 'AndhraPradesh##28';
    this.formatTable();
  }

  formatTable() {
    let locationConstant = {};

    locationConstant = !isNullOrUndefined(this.currentState) ?
      this.commonDataService.generateLocationConstantForALocation(
        this.child,
        this.hieType,
        this.lastLevel
      ) : {};

    switch (this.tableType) {

      case 'dataTable':
        this.tableData = this.tableService.formatTable(this.cons, this.data, locationConstant, this.location);
        break;
      case 'treeTable':
        break;
      case 'crudTable':
        break;
      default:
        console.warn('Table type not found ! = ', this.tableType);
        break;
    }
    this.takeBackup();
  }

  ngOnDestroy() {
    this.recordDataSub.unsubscribe();
    this.totalDataSub.unsubscribe();
  }

}
