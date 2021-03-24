<div class="modal-header">
  <h5 class="modal-title" id="executeQueryModalLabel">Execute Query</h5>
  <button type="button" class="close" (click)="close()">
    <span aria-hidden="true">×</span>
  </button>
</div>
<div class="modal-body">
  <div class="custom-control custom-checkbox mb-3">
    <input class="custom-control-input" id="downloadData" name='downloadData' [(ngModel)]="downloadData" type="checkbox">
    <label class="custom-control-label" for="downloadData">Download Data</label>
  </div>
  <div class="custom-control custom-checkbox mb-3">
    <input class="custom-control-input" id="displayData" name="displayData" [(ngModel)]="displayData" type="checkbox">
    <label class="custom-control-label" for="displayData">Display Data</label>
  </div>

  <p class="text-danger text-sm font-weight-200">Note: Select atleast one option</p>
</div>
<div class="modal-footer">
  <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss()">Cancel</button>
  <button type="button" ngbAutofocus class="btn btn-danger" (click)="showResults()">Submit</button>
</div>