import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { DataService } from './../../../../services/common/data.service';
import { DataTableService } from './../../../../services/common/data-table.service';

@Component({
  selector: 'lib-row, [lib-row]',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css']
})
export class RowComponent implements OnInit {

  @Input() datarow: any;
  @Input() totalrow: any;
  @Input() index: string;
  @Input() hieType: string;
  @Input() lastLevel: string;
  @Input() customTemplates: TemplateRef<any>;
  @Input() headers: any;
  @Input() indexCons: object;

  obj:object = {};

  constructor(private dataService: DataService,
             private dataTableService: DataTableService) {}

  ngOnInit() { }

  cellInfo(rowInfo, e,i, headers) {
    this.dataTableService.getCellInfo(rowInfo, e, i, headers);
  }

}
