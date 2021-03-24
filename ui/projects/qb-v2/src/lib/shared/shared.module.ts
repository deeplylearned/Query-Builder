import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportAsModule } from 'ngx-export-as';

import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FooterComponent } from './components/footer/footer.component';
import { RowComponent } from './components/rows/row/row.component';
import { TableCellComponent } from './components/rows/row/table-cell/table-cell.component';
import { HeaderRowComponent } from './components/header-row/header-row.component';
import { RowsComponent } from './components/rows/rows.component';
import { TotalRowComponent } from './components/rows/total-row/total-row.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    ToolbarComponent,
    BreadcrumbComponent,
    FooterComponent,
    RowComponent,
    TableCellComponent,
    HeaderRowComponent,
    RowsComponent,
    TotalRowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    ExportAsModule
  ],
  exports : [
    ToolbarComponent,
    BreadcrumbComponent,
    FooterComponent,
    RowComponent,
    TableCellComponent,
    HeaderRowComponent,
    RowsComponent,
    TotalRowComponent
  ]
})
export class SharedModule { }
