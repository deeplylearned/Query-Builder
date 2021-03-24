import { QBV2Cnst } from './../constants/proj.cnst';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }


  getMockData(type: string): Observable<any> {
    return this.http.get("assets/mock.json").pipe(map((res: any) => {
      if(type == 'Indexes') {
        return res.indexes;
      }else if(type == "attrOfIndex") {
        return res.student_attributes;
      }else if(type == 'valueOfAttr') {
        return res.freshRenewal;
      }else {
        console.warn("not a valid type");
        return null;
      }
    }));
  }

  getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json, application/xlsx');
    headers.append("Content-Disposition", "attachment; filename=report.xlsx");
    headers.append('Access-Control-Allow-Origin', "*");
    headers.append('Access-Type', 'br');
    return headers;
  }

  makePostApiCall(api, postData): Observable<any> {
    let endPoint = this.getApi(api)
    if(!isNullOrUndefined(endPoint)) {
      return this.http.post(QBV2Cnst.BASE_URL+endPoint, postData, {headers: this.getHeaders()});
    }else {
      console.error("API should not be null or undefined ",api);
      return of(null);
    }
  }

  downloadExcel(api, postData): Observable<any> {
    let endPoint = this.getApi(api);
    if(!isNullOrUndefined(endPoint)) {
      return this.http.post<Blob>(QBV2Cnst.BASE_URL+endPoint, postData, {responseType: 'blob' as 'json'});
    }else {
      console.error("API should not be null or undefined ",api);
      return of(null);
    }
  }

  makeGetApiCall(api, replaceVal?:Object): Observable<any> {
    let endPoint = this.getApi(api);
    if(!isNullOrUndefined(replaceVal)) {
      endPoint = this.replaceWithVal(endPoint, replaceVal);
    }
    if(!isNullOrUndefined(endPoint)) {
      return this.http.get(QBV2Cnst.BASE_URL+endPoint, {headers: this.getHeaders()});
    }else {
      console.error("API should not be null or undefined ", api);
      return of(null);
    }
  }

  replaceWithVal(api, val): string {
    if(!isNullOrUndefined(val) && !isNullOrUndefined(api) && typeof val == 'object' && !Array.isArray(val)) {
      let keys = Object.keys(val);
      keys.forEach((k) => {
        api = api.replace(k,val[k]);
      })
    }
    return api;
  }

  getApi(api: any): string | null {
    let apiMapping = QBV2Cnst.API_MAPPING;
    if(!isNullOrUndefined(api) && !isNullOrUndefined(apiMapping) && !isNullOrUndefined(apiMapping[api])) {

      return apiMapping[api];
    }else {
      return null;
    }
  }
}
