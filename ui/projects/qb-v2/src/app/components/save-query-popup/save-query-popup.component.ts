import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'qb2-save-query-popup',
  templateUrl: './save-query-popup.component.html',
  styleUrls: ['./save-query-popup.component.scss']
})
export class SaveQueryPopupComponent implements OnInit {

  valid: number;
  queryName: string;
  type: string;

  constructor(
    public modal: NgbActiveModal,
    private commonSrv: CommonService
  ) { }

  ngOnInit() {
  }

  close() {
    this.modal.close();
  }

  saveQuery() {
    if(!!this.queryName) {
      this.modal.close({queryName: this.queryName});
    }else {
      this.commonSrv.showToastMessage("Please Provide name for query", "error", {});
    }
  }

}
