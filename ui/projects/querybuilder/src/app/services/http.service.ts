import { QBCnst } from './../constants/proj.cnst';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }


  getMockData(): Observable<any> {
    return this.http.get("assets/mock.json");
  }


  getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', "*");
    return headers;
  }

  makePostApiCall(api, postData): Observable<any> {
    let endPoint = this.getApi(api)
    if(!isNullOrUndefined(endPoint)) {
      return this.http.post(QBCnst.BASE_URL+endPoint, postData, {headers: this.getHeaders()});
    }else {
      console.error("API is null or undefined ",api);
      return of(null);
    }
  }

  makeGetApiCall(api, replaceVal?:Object): Observable<any> {
    let endPoint = this.getApi(api);
    if(!isNullOrUndefined(replaceVal)) {
      endPoint = this.replaceWithVal(endPoint, replaceVal);
    }
    if(!isNullOrUndefined(endPoint)) {
      return this.http.get(QBCnst.BASE_URL+endPoint, {headers: this.getHeaders()});
    }else {
      console.error("API is null or undefined ", api);
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
    let apiMapping = QBCnst.API_MAPPING;
    if(!isNullOrUndefined(api) && !isNullOrUndefined(apiMapping) && !isNullOrUndefined(apiMapping[api])) {
      return apiMapping[api];
    }else {
      return null;
    }
  }
}
