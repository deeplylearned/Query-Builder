<!-- <div class="row">
  <div class="col col-md-6" *ngFor="let agg of aggFilters">
    <div class="form-row">
      <div class="col-5 align-self-center font-weight-600">{{ agg.uiName }}</div>
      <div class="col">
        <select class="form-control form-control-sm agg-operation-type" [(ngModel)]="agg.aggOperation">
          <option value="-1">Select Operation</option>
          <option value="count">count</option>
          <option value="sum">sum</option>
        </select>
      </div>
      <div class="col-auto">
        <button class="btn btn-sm btn-outline-danger agg-delete-icons" (click)="deleteAggAttr(attr)">
          <i class="far fa-trash-alt"></i>
        </button>
      </div>
    </div>
    <hr class="my-3 bg-border">
  </div>
</div> -->

<div class="row">
  <template [ngTemplateOutlet]="aggFiltersPreviewRef" [ngTemplateOutletContext]="{filters: aggFilters, parentPath: ''}"></template>
</div>

<ng-template #aggFiltersPreviewRef let-filters="filters" let-parentPath="parentPath">
  <div class="col col-md-6" *ngFor="let filter of filters">
    <template [ngTemplateOutlet]="aggFilterPreviewRef" [ngTemplateOutletContext]="{filter: filter, parentPath: parentPath == '' ? filter.uiName : parentPath+ ' > ' + filter.uiName}"></template>  
  </div>
</ng-template>

<ng-template #aggFilterPreviewRef let-filter="filter" let-parentPath="parentPath">
  <ng-container *ngIf="!!filter.childObject">
    <template [ngTemplateOutlet]="aggFiltersPreviewRef" [ngTemplateOutletContext]="{filters: filter.childObject, parentPath: parentPath}"></template>
    <!-- <template [ngTemplateOutlet]="filterPreviewRef" [ngTemplateOutletContext]="{filters: filter.childObject, parentPath: parentPath+' > '+filter.uiName}"></template> -->
  </ng-container>
  <ng-container *ngIf="!filter.childObject">
    <div class="form-row" id="1_filter_preview">
      <div class="col-5 align-self-center font-weight-600">
        {{filter.parentPath.split('##').join(' > ')}}
      </div>
      <div class="col">
        <select name="" class="form-control form-control-sm operation-types" id="1_op" [(ngModel)]="filter.aggOperation">
          <option value="-1">Select Operation</option>
       <!--   <option value="count">count</option>-->
          <!--//todo my code changed ui name from count to group By:-->
          <option value="count">GroupBy</option>
          <option value="sum">sum</option>
        </select>
      </div>

      <div class="col-auto">
        <button class="btn btn-sm btn-outline-danger agg-delete-icons" (click)="deleteAggAttr(filter)">
          <i class="far fa-trash-alt"></i>
        </button>
      </div>
    </div>
    <hr class="my-3 bg-border">
  </ng-container>
</ng-template>
