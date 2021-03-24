<div class="row px-3" style="margin-bottom: 1.5vh;">
  <div class="col-12 col-md-6 order-md-2">
    <h4 *ngIf="tableInfo.title" class="card-title text-dark text-center">{{ tableInfo.title }}</h4>
  </div>
  <div class="col-4 col-md-3 order-md-1">
    <div class="input-group">
      <input type="text" class="form-control" placeholder="Search ..." [(ngModel)]="searchText"
        (keyup)="filterRecords()">
      <!-- <div class="input-group-append">
        <span class="input-group-text"><i class="fa fa-search"></i></span>
      </div> -->
    </div>
  </div>
  <div class="col-8 col-md-3 order-md-3">
    <button class="btn btn-primary my-1" style="cursor: pointer; float: right;" (click)="export()">Download <i
        class="fa fa-download"></i></button>
  </div>
</div>