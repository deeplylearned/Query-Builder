import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'qb2-response-types-popup',
  templateUrl: './response-types-popup.component.html',
  styleUrls: ['./response-types-popup.component.scss']
})
export class ResponseTypesPopupComponent implements OnInit {

  displayData: boolean = false;
  downloadData: boolean = false;

  constructor(
    public modal: NgbActiveModal,
    private commonSrv: CommonService
  ) { }

  ngOnInit() {
  }

  close() {
    this.modal.dismiss();
  }

  showResults() {
    if(!!this.displayData || !!this.downloadData) {
      this.modal.close({displayData: this.displayData, downloadData: this.downloadData});
    }else {
      this.commonSrv.showToastMessage('Select alteast one option', 'error');
    }
    
    // console.log("Show Results:: ",this.displayData, this.downloadData);
  }

}
