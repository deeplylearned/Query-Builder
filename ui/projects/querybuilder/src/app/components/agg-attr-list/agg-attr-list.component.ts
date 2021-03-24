import { QBCnst } from './../../constants/proj.cnst';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../services/data.service';
import { EventsService } from '../../services/events.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'qb-agg-attr-list',
  templateUrl: './agg-attr-list.component.html',
  styleUrls: ['./agg-attr-list.component.scss']
})
export class AggAttrListComponent implements OnInit {

  @Input('attributes') attributes: any[] = [];
  subscriptions: Subscription[] = []

  constructor(
    public modal: NgbActiveModal,
    public dataSrv: DataService,
    public evSrv: EventsService
  ) { }

  ngOnInit() {
    // this.attributes = this.dataSrv.getAttrs();
  }

  subscribeEvents() {
    this.evSrv.indexOnChange.subscribe((res) => {
    })
    this.evSrv.attributes.subscribe((res: any[]) => {
    })
  }

  changeStatusOfChilds(attr, val) {
    attr.childObject.forEach((e) => {
      e.aggStatus = val;
      if(!isNullOrUndefined(e.childObject)) {
        this.changeStatusOfChilds(e, attr.aggStatus); 
      }
    })
  }

  addAggAttrs() {
    let filters = this.getAllAggFiltersWithStatusTrue(this.attributes, null, null);
    this.evSrv.setAggFilterAttr(filters);
    this.modal.close();
  }

  getAllAggFiltersWithStatusTrue(filters, parent, parentKey) {
    let filtersWithStatusTrue = []
    filters.forEach((f) => {
      let path = !isNullOrUndefined(parent) ? parent+QBCnst.PATH_SEPARATOR+f.uiName : f.uiName;
      let keyPath = !isNullOrUndefined(parentKey) ? parentKey+QBCnst.KEY_SEPARATOR+f.fieldName : f.fieldName;

      if(!isNullOrUndefined(f.childObject)) {
        filtersWithStatusTrue =  filtersWithStatusTrue.concat(this.getAllAggFiltersWithStatusTrue(f.childObject, path, keyPath));
        // return true;
      }else {
        // f.status = !isNullOrUndefined(parent) ? true : false;
        if(f.aggStatus) {
          f.parentPath = path;
          f.parentKeypath = keyPath;
          filtersWithStatusTrue.push(f);
        }
        // return f.status;
      }
    })
    return filtersWithStatusTrue;
  }

}
