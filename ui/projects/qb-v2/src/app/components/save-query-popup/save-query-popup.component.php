<div class="modal-header">
  <h4 class="modal-title" id="modal-title">{{type == 'new' ? 'Save' : 'Update'}} Query</h4>
  <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss()">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
<div class="modal-body minimum-height-modal-box">
  <div class="form-group">
    <label for="query-name">Query Name</label>
    <input type="text" name="query-name" placeholder="Provide name for the Query" [(ngModel)]="queryName" class="form-control">
  </div>
  <h6 *ngIf="valid != 5 && valid != 4">
    <span class="text-danger font-weight-bold">Note:</span>
    Query is not valid. 
  </h6>
  <h6 *ngIf="valid == 5 || valid == 4">
    <span class="text-success font-weight-bold">Valid Query</span>
  </h6>
  <ul>
    <li>Index: <strong>{{ valid > 0 ? 'Valid' : 'Not Valid' }}</strong></li>
    <li>Selected any Filters: <strong>{{ valid > 1 ? 'Selected' : 'Not Selected' }}</strong></li>
    <li>Filters: <strong>{{ valid > 2 ? 'Valid' : 'Not Valid' }}</strong></li>
    <li>Aggregate Filters: <strong>{{ valid > 3 ? 'Valid' : 'Not Valid' }}</strong></li>
    <li>Output Columns: <strong>{{ valid > 4 ? 'Selected' : 'Not Selected' }}</strong></li>
  </ul>
  <p *ngIf="valid != 5 && valid != 4">Click on {{type == 'new' ? 'save' : 'update'}} still you want to {{type == 'new' ? 'save' : 'update'}} the query.</p>
</div>
<div class="modal-footer">
  <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss()">Cancel</button>
  <button type="button" ngbAutofocus class="btn btn-danger" (click)="saveQuery()">{{type == 'new' ? 'Save' : 'Update'}}</button>
</div>