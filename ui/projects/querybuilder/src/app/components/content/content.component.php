<div class="right-container">
  <div class="container-fluid p-4">
    <div class="card card-form shadow-sm mb-4">
      <div class="card-header d-flex align-items-center">
        <h4 class="flex-fill m-0">Filter <strong>Attribute</strong></h4>
      </div>
      <div class="card-body">
        <qb-filter-preview [filters]="filterAttrs"></qb-filter-preview>
      </div>
    </div>

    <div class="card card-form shadow-sm mb-4">
      <div class="card-header d-flex align-items-center">
        <h4 class="flex-fill m-0">Aggregate <strong>Attribute</strong></h4>

        <div class="form-group mb-0 mr-4 d-flex align-items-center">
          <label for="" class="mr-4 mb-0">Choose Table Columns</label>
          <!-- <select multiple="" id="multiselect" class="form-control">
            <option>Academic Year</option>
            <option>CAH Flag</option>
            <option>MC Status</option>
          </select> -->

          <ng-select [items]="attributes"
                bindLabel="uiName"
                bindValue="fieldName"
                groupBy="childobject"
                [multiple]="true"
                [closeOnSelect]="false"
                [(ngModel)]="selectedTableCols">

            <ng-template ng-multi-label-tmp let-items="items" let-clear="clear">
              <div class="ng-value" *ngFor="let item of items | slice:0:2">
                  <span class="ng-value-label">{{item.uiname}}</span>
                  <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
              </div>
              <div class="ng-value" *ngIf="items.length > 2">
                  <span class="ng-value-label">{{items.length - 2}} more...</span>
              </div>
            </ng-template>


            <ng-template ng-optgroup-tmp let-item="item" let-item$="item$" let-index="index">
              <input id="item-{{index}}" type="checkbox" [ngModel]="item$.selected"/> {{item?.uiName}}
            </ng-template>

            <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
              <input id="item-{{index}}" type="checkbox" [ngModel]="item$.selected"/> {{item?.uiName}}
            </ng-template>
          </ng-select>
        </div>

        <button class="btn btn-outline-default btn-sm" (click)="addAggAttr()" >
          <i class="fas fa-plus"></i> Add Aggregate Attribute
        </button>
      </div>
      <div class="card-body">
        <qb-agg-filter-preview></qb-agg-filter-preview>
        <!-- <div class="row" id="agg_filters_preview"></div> -->
      </div>
    </div>

    <div class="text-right mt-4">    
      <button class="btn btn-primary text-uppercase" (click)="generateQuery()">Generate Query</button>
    </div>

    <div class="row mt-3 d-flex">
      <div class="col align-items-stretch">
        <div class="card">
          <div class="card-body">
            <h4 class="font-weight-600">Query:</h4>
            <pre [innerHTML]="postdata | json"></pre>
          </div>
        </div>
      </div>
      <div class="col align-items-stretch" style="max-height: 500px;">
        <div class="card">
          <div class="card-body">
            <h4 class="font-weight-600 ">Result:</h4>
            <div style="max-height: 700px; overflow-y: auto">
              <pre [innerHTML]="result | pretty"></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>