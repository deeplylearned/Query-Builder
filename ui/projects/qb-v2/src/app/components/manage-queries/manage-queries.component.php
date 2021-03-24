<div class="modal-header">
    <h4 class="modal-title font-weight-bold">Saved Queries</h4>
    <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body minimum-height-modal-box">
    <ul class="list-group border-0">
      <li class="list-group-item d-flex align-items-center" *ngFor="let q of queries; let i=index;">
        <h6 class="flex-fill m-0">{{ q?.doc?.queryName }}</h6>
        <div>
          <button class="btn btn-sm btn-success" (click)="loadQuery(q.doc)"><i class="fas fa-eye"></i></button> 
          <button class="btn btn-sm btn-danger" (click)="deleteQuery(q.doc)"><i class="fas fa-trash"></i></button> 
        </div>
      </li>
      <li *ngIf="queries.length == 0" class="list-group-item d-flex justify-content-center">
        <h6 class="font-weight-bold">You haven't saved any Queries.</h6>
      </li>
    </ul>
  </div>