import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qb2-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  description: string;
  title: string;
  buttons: any[] = [];

  constructor(
    public modal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  handleAction(action: any) {
    if(!!action.closeOnClick) {
      this.close('close',{action: action.name});
    }else {
      this.close('dismiss', action.name);
    }
  }

  close(type, data) {
    if(type == 'close') {
      this.modal.close(data);
    }else {
      this.modal.dismiss(data);
    }
  }
}
