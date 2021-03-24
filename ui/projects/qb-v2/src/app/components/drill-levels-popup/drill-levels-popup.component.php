<div class="modal-header">
  <h5 class="modal-title" id="executeQueryModalLabel">Drill Down Levels</h5>
  <button type="button" class="close" (click)="close()">
    <span aria-hidden="true">×</span>
  </button>
</div>
<div class="modal-body">
  <p class="text-sm font-weight-200">Pick the next drill down level</p>

  <div *ngFor="let level of levels">
    <label for="level_{{level}}">
      <input id="level_{{level}}" [value]='level' type="radio" name="levels" [(ngModel)]="levelSelected">
      {{level | uppercase}}
    </label>
  </div>
  <div>
    <label for="level_last">
      <input id="level_last" value="end" type="radio" name="levels" [(ngModel)]="levelSelected">End Here
    </label>
  </div>

  <!-- <div class="custom-control custom-checkbox mb-3">
    <input class="custom-control-input" id="downloadData" name='downloadData' [(ngModel)]="downloadData" type="radio">
    <label class="custom-control-label" for="downloadData"></label>
  </div>
  <div class="custom-control custom-checkbox mb-3">
    <input class="custom-control-input" id="displayData" name="displayData" [(ngModel)]="displayData" type="radio">
    <label class="custom-control-label" for="displayData">AD</label>
  </div> -->

  <p class="text-danger text-sm font-weight-200">Note: Select atleast one option</p>
</div>
<div class="modal-footer">
  <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss()">Cancel</button>
  <button type="button" ngbAutofocus class="btn btn-danger" (click)="showResults()">Submit</button>
</div>