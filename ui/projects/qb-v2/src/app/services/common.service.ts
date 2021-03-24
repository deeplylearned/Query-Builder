import { isNullOrUndefined } from 'util';
import { QBV2Cnst } from './../constants/proj.cnst';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private toastr: ToastrService
  ) { }

  showToastMessage(message:string,type:string,options?:any):void{
    let toastOptions:any = QBV2Cnst.TOASTR_CNST;
    if(!isNullOrUndefined(options)){
      toastOptions = {...QBV2Cnst.TOASTR_CNST,...options.options}
    }
    this.toastr.clear();
    this.toastr[type](message,toastOptions.title,toastOptions)
  }

  generateTableSkeletonObject() {
    const obj = {
      tableInfo: {
        type: 'dataTable',
        title: 'Query Result',
      },
      css: {
        tableClass: 'table table-bordered align-items-center',
        theadClass: 'thead-dark text-center'
      },
      sortOptions: {
        sortIndex: 0,
        sortType: 'desc'
      },
      searchFilter: true,
      downloadOptions: {
        downloadType: 'xls',
        downloadFileName: 'Student_Table',
        downloadAll: true, //pass false if only current page data is to be downloaded
        metaData: true //pass true if meta data needs to be added in excel (Option only for excel and all data needs to be downloaded)
      },
      paginatorOptions: {
        limit: 20,
        maxSize: 5,
        dropdownOptions: [{
            value: 5,
            display: '5'
          },
          {
            value: 10,
            display: '10'
          },
          {
            value: 15,
            display: '15'
          },
          {
            value: 20,
            display: '20'
          },
          {
            value: 25,
            display: '25'
          },
          {
            value: -1,
            display: 'All'
          }
        ]
      },
      tableHeaderFixerInfo: {
        headerFix: true,
        colFix: true,
        noOfCol: 2
      },
      totalRow: {
        name: 'total',
        jsonKey: '-1'
      },
      indexCons: {
        show: true,
        class: 'tc-bg-01'
      },
      columns: []
    }
    return obj;
  }
}
