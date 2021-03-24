import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { QBCnst } from '../constants/proj.cnst';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private toastr: ToastrService
  ) { }

  showToastMessage(message:string,type:string,options?:any):void{
    let toastOptions:any = QBCnst.TOASTR_CNST;
    if(!isNullOrUndefined(options)){
      toastOptions = {...QBCnst.TOASTR_CNST,...options.options}
    }
    this.toastr.clear();
    this.toastr[type](message,toastOptions.title,toastOptions)
  }

  changeObjectKeysToLowerCase(obj) {
    let keys = Object.keys(obj);
    let res = {};
    keys.forEach((k) => {
      res[k.toLowerCase()] = obj[k];
    })
    return res;
  }

  convertAttrKeysToLowerCase(attrs) {
    return attrs.map((a) => {
      if(!isNullOrUndefined(a.childObject)) {
        a = this.changeObjectKeysToLowerCase(a);
        a.childobject = this.convertAttrKeysToLowerCase(a.childobject);
        return a;
      }else {
        return this.changeObjectKeysToLowerCase(a)
      }
    })
  }
}
