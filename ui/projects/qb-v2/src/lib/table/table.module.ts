import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';

import { TableRoutingModule } from './table-routing.module';
import { DataTableComponent } from './components/data-table/data-table.component';
import { TreeTableComponent } from './components/tree-table/tree-table.component';
import { CrudTableComponent } from './components/crud-table/crud-table.component';
import { TableHeaderFixerDirective } from '../directives/table-header-fixer.directive';
import { DataService } from '../services/common/data.service';
import { DataTableService } from '../services/common/data-table.service';
import { DataTableEventsService } from './components/data-table/data-table-events.service';
import { LocationService } from '../services/common/location.service';
import { ExcelService } from '../services/common/excel.service';


@NgModule({
  declarations: [
    DataTableComponent, 
    TreeTableComponent, 
    CrudTableComponent,
    TableHeaderFixerDirective
  ],
  imports: [
    CommonModule,
    TableRoutingModule,
    SharedModule
  ],
  exports: [
    DataTableComponent,
    TreeTableComponent,
    CrudTableComponent,
    TableHeaderFixerDirective
  ],
  providers: [DataService, DataTableService, DataTableEventsService, LocationService, ExcelService]
})
export class TableModule { }
