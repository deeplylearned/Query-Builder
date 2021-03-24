import { Component, OnInit, Input } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ExcelService } from '../../../services/common/excel.service';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { DataTableEventsService } from '../../../table/components/data-table/data-table-events.service';


@Component({
  selector: 'lib-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Input() tableInfo: object;
  @Input() recordData: any;
  @Input() totalData: any;
  @Input() downloadOptions: any;
  @Input() tableId : string;
  @Input() headers : any;
  @Input() headerCons : object[];
  @Input() metaData : object;

  searchText: string;
  searchTextHolder: string;
  allRecords: any;
  filteredRecords: object[] = [];
  totalDataCopy:object[] = [];
  exportAsConfig: ExportAsConfig = {
    type: 'xlsx',
    elementId: ''
  }

  constructor(private tableEventsHandler: DataTableEventsService,
              private exportAsService: ExportAsService,
              private excelService: ExcelService) { }

  ngOnInit() {
    this.filteredRecords =JSON.parse(JSON.stringify(this.recordData));
    this.totalDataCopy = JSON.parse(JSON.stringify(this.totalData));
    this.allRecords = this.recordData;
    this.exportAsConfig.type = this.downloadOptions.downloadType;
    this.exportAsConfig.elementId = this.tableId;
  }

  filterRecords = () => {
    this.searchTextHolder = this.searchText.toLowerCase().trim();
    if (!isNullOrUndefined(this.searchTextHolder) && this.searchTextHolder != '') {      
      this.filteredRecords = [];
      for (let i = 0; i < this.recordData.length; i++) {
        let flag = false;
        let outerRecord = this.recordData[i];
        for (let j = 0; j < outerRecord.length; j++) {
          let values: any = '';
          let innerRecord = outerRecord[j];
          [values] = [innerRecord.values]
          let { value } = values[0];
          if ((typeof values != 'object' || values instanceof Array) && isNullOrUndefined(value)) {
            if (values.toString().toLowerCase().indexOf(this.searchTextHolder) != -1) {
              flag = true;
              break;
            }
          }
          else {
            [values] = innerRecord.values;
            if (values['value'].toLowerCase().indexOf(this.searchTextHolder) != -1) {
              flag = true;
              break;
            }
          }
        }
        if (flag)
          this.filteredRecords.push(outerRecord);
      }
      this.totalDataCopy = [];
    } else {
      this.filteredRecords = this.recordData;
      this.totalDataCopy = this.totalData;
    }

    this.tableEventsHandler.recordData.next(this.filteredRecords);
    this.tableEventsHandler.totalData.next(this.totalDataCopy);
  }

  export() {
    if(this.downloadOptions.downloadAll)
    { 
      this.excelService.downloadFile(this.downloadOptions,this.headers, this.allRecords, this.headerCons, this.metaData);
    }
    else{
      this.exportAsService.save(this.exportAsConfig, this.downloadOptions.downloadFileName).subscribe(() => {
    });
    }
  }

}
