import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { PouchdbService } from '../../services/pouchdb.service';
import { IQuery } from '../../models/query';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'qb2-manage-queries',
  templateUrl: './manage-queries.component.html',
  styleUrls: ['./manage-queries.component.scss']
})
export class ManageQueriesComponent implements OnInit {

  queries: any[] = [];
  constructor(
    public modal: NgbActiveModal,
    private _modal: NgbModal,
    private pouchSrv: PouchdbService,
    private router: Router,
    private commonSrv: CommonService
  ) { }

  ngOnInit() {
    this.getAllQueries();
  }

  /** Manage Queries */
  /**
   * @description - This method will fetch all queries stored in pouchdb.
   */
  getAllQueries() {
    this.pouchSrv.getAllQueries().then((res) => {
      this.queries = res.rows;
    }, (err) => {
      console.log("[ManageQueriesComponent]::getAllQueries: ",err);
      this.queries = [];
    })
  }
  /** End of Manage Queries */

  /**
   * 
   * @param query - Query Info which you want to load.
   * @description - This Method will load the query.
   */
  loadQuery(query) {
    this.router.navigate(['', 'query'], {queryParams: {id: query._id}, queryParamsHandling: 'merge'});
    this.closeModal();
  }

  /**
   * @param query - Query you want to delete
   * @description - This method is used to delete the query.
   */
  deleteQuery(query) {
    const cnfrmDialogRef = this._modal.open(ConfirmationDialogComponent, {
      backdrop: 'static',
      keyboard: false
    });
    cnfrmDialogRef.componentInstance.title = "Delete Confirmation";
    cnfrmDialogRef.componentInstance.description = `<h5 class="font-weight-bold">Are you sure you want to delete <span class="text-danger">${query.queryName}</span>?</h5>
      <p>All the information related to this query will be permanently deleted.</p>
      <p class="font-weight-bold text-danger">Note: This action can not be undone.</p>
    `;
    cnfrmDialogRef.componentInstance.buttons = [
      {
        name: 'Cancel',
        closeOnClick: true,
        classes: ['btn-outline-secondary']
      },
      {
        name: 'Delete',
        closeOnClick: true,
        classes: ['btn-danger']
      }
    ];
    cnfrmDialogRef.result.then((res) => {
      if(res.action == 'Delete') {
        // this.commonSrv.showToastMessage("Query is About to delete", "success", {});
        this.pouchSrv.deleteQuery(query).then((res) => {
          this.commonSrv.showToastMessage("Query deleted successfully", "success", {});
          this.getAllQueries();
        }, (err) => {
          console.log(err);
          this.commonSrv.showToastMessage(err.msg, "error", {});
        })
      }
    }, (err) => {
      console.log("dismissed");
    })
  }

  /**
   * @description - This method will close the modal.
   */
  closeModal() {
    this.modal.dismiss();
  }

}
