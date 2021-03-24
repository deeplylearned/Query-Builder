import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { isNullOrUndefined } from 'util';

@Injectable()
export class ExcelService {

  constructor() { }

  public downloadFile(downloadOptions: object, headers: any[], data: any[], headerCons: object[], metaData: object) {
    let downloadType: string = downloadOptions['downloadType'];
    let downloadFileName: string = downloadOptions['downloadFileName'];
    let meta: boolean = downloadOptions['metaData'];
    if (downloadType == 'xls' || downloadType == 'xlsx') {
      this.exportAsExcelFile(data, headers, downloadFileName, meta, metaData);
    }
    else if (downloadType == 'csv') {
      this.exportTableToCSV(data, headers, downloadFileName);
    }
    else {
      this.downloadAsJson(headerCons, data, downloadFileName)
    }

  }

  private exportAsExcelFile(data: any[], headers: any[], excelFileName: string, meta: boolean, metaData: object) {
    let excelBuffer = this.setExcelData(headers, data, excelFileName, meta, metaData);
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(excelData: any, fileName: string): void {
    let blob = new Blob([excelData], { type: "text/html" });
    FileSaver.saveAs(blob, fileName + '_' + new Date().getTime() + '.xls');
  }

  private setExcelData(headers, recordData, xlsfilename, meta, metaData) {
    xlsfilename += '.xls;'
    let tableHTML = this.createNewTable(headers, recordData, meta, metaData);
    let excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += xlsfilename;
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += tableHTML;
    excelFile += "</body>";
    excelFile += "</html>";

    return excelFile;
  }

  private createNewTable(headers, recordData, meta, metaData) {
    let numberOfRows = recordData.length;
    let totalColumns = recordData[0].length;
    let tableForDownload = "";
    if (meta) {
      tableForDownload += this.addMetaData(metaData);
    }
    tableForDownload += "<table><thead>";

    headers.forEach((header) => {
      tableForDownload += "<tr>";
      header.forEach(record => {
        tableForDownload += '\t\t\t\t<th colspan="' + record.cols + '" rowspan="' + record.rows + '">' + record.name + '</th>';
      });
      tableForDownload += '</tr>';
    })
    tableForDownload += '</thead>\n<tbody>\n';

    if (recordData.length > 0) {
      for (let row = 0; row < numberOfRows; row++) {
        tableForDownload += '\t\t\t<tr>\n';
        for (let column = 0; column < totalColumns; column++) {
          let recordValue = recordData[row][column];
          if (recordValue) {
            let cellValue = recordValue.dataType[0] === 'LOCATION' ? recordData[row][column].values[0].value : recordData[row][column].values;
            tableForDownload += '\t\t\t\t<td>' + ((cellValue != null && cellValue != undefined) ? cellValue : '-') + '</td>' + '\n';
          }
          else {
            tableForDownload += '<td>-</td>';
          }
        }
        tableForDownload += '\t\t\t</tr>\n';
      }
    } else {
      tableForDownload += '\t\t\t<tr>\n<td>No data to display!</td></tr>';
    }
    return tableForDownload += '</tbody><table>';
  }

  private exportTableToCSV(recordData, headers, filename) {
    let csvs = [];
    let rowArray = [];
    let startIndex = 0;
    let headerArray = [];

    for (let i = 0; i < headers[0].length; i++) {
      let headerValue = headers[0][i];
      if (headerValue.cols == 1) {
        headerArray.push(headerValue.name);
      }
      else {
        getHeaderName(headers, 1, startIndex, startIndex + headerValue.cols, headerValue.name);
        startIndex += headerValue.cols;
      }
    }

    function getHeaderName(header: object, headerIndex: number, index: number, columns: number, baseName: string) {
      for (let i = index; i < columns; i++) {
        if (header[headerIndex][i].cols == 1) {
          headerArray.push(baseName + '.' + header[headerIndex][i].name);
        }
        else {
          getHeaderName(headers, headerIndex + 1, index, index + header[headerIndex][i].cols, baseName + '.' + header[headerIndex][i].name);
          startIndex += header[headerIndex][i].cols;
        }
      }
    }

    let header = headerArray.join(',');
    rowArray.push(header);

    for (let i = 0; i < recordData.length; i++) {
      let rows = [], cols = recordData[i].length;
      for (let j = 0; j < cols; j++) {
        let recordValue = recordData[i][j];
        if (recordValue) {
          let cellValue = recordValue.dataType[0] === 'LOCATION' ? recordData[i][j].values[0].value :
            recordValue.dataType.length == 1 ? recordData[i][j].values : recordData[i][j].values.join(':');
          let pushValue = (cellValue != null && cellValue != undefined) ? cellValue : '-';
          rows.push(pushValue);
        }
        else {
          rows.push('-');
        }
      }
      let row = rows.join(",");
      rowArray.push(row);
    }
    csvs.push(rowArray.join("\n"));
    this.downloadCSV(csvs, filename);
  }

  private downloadCSV(csv, filename) {
    let csvFile = new Blob([csv], { type: "text/csv" });
    FileSaver.saveAs(csvFile, filename + '_' + new Date().getTime() + '.csv');

  }

  private downloadAsJson(headers, data, filename) {
    let finalObject = []
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let o = this.setDataObject(headers, data[i], 0);
        finalObject.push(o);
      }
    }
    let jsonString = JSON.stringify(finalObject);
    let jsonFile = new Blob([jsonString], { type: "text" });
    FileSaver.saveAs(jsonFile, filename + '_' + new Date().getTime() + '.json');
  }

  private setDataObject(headers, record, index) {
    let jsonObject: Object = {};
    let ind = index;
    headers.forEach((header) => {
      if (!isNullOrUndefined(header.childs) && header.childs.length > 0) {
        jsonObject[header.name] = this.setDataObject(header.childs, record, ind);
      }
      else {
        if (record[ind].dataType[0] === 'LOCATION') {
          jsonObject[record[ind].values[0].child] = record[ind].values[0].value;
        }
        else {
          jsonObject[header.name] = record[ind].values;
        }
        ind++;
      }
    });
    return jsonObject;
  }

  private addMetaData(metaData) {
    let metaEntries = Object.entries(metaData);
    var mData = '<table>';

    metaEntries.forEach(entry => {
      mData += "<tr><th>" + entry[0] + "</th><th>" + entry[1] + "</th></tr>";
    })
    mData += "<tr><th></th><th></th></tr>";
    mData += "</table>";
    return mData;
  }

}