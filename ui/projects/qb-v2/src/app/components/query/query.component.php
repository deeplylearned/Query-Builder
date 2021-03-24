<div class="row">
  <div class="col-12 cl-sm-4 col-xl-3">
    <div class="form-group header">
      <div class="title mt-0 mb-2 font-weight-600">Select Table</div>
      <select name="index" class="form-control font-weight-600 shadow bg-default border-0 text-white" 
        [(ngModel)]="selectedIndex" (change)="getAttributesOfIndex('change')">
        <option value="-1">Select Index</option>
        <option *ngFor="let opt of indexes" [value]="opt">{{opt}}</option>
      </select>
    </div>
  </div>
</div>

<qb2-step name="Filter Attribute" [index]="selectedIndex" [attributes]="attributes" [disabled]="disable" formType="filter" [collapsedStep]="true" 
  [(selectedAttr)]="selectedFilterAttrs"></qb2-step>
<qb2-step name="Aggregate Attribute" [index]="selectedIndex" [attributes]="attributes" [disabled]="disable" formType="aggregate" [collapsedStep]="true" 
  [(selectedAttr)]="selectedAggFilters"></qb2-step>
<qb2-step name="Output Cols" *ngIf="selectedAggFilters.length == 0" [index]="selectedIndex" [attributes]="attributes" [disabled]="disable" [collapsedStep]="false" 
  [(selectedAttr)]="outputCols"></qb2-step>

<div class="text-right mt-4">
  <button class="btn btn-primary text-uppercase" (click)="executeQuery()"><i class="fas fa-file-export"></i> Execute Query</button>
  <button class="btn btn-primary text-uppercase" *ngIf="!currentQuery" (click)="saveQuery()"><i class="fas fa-save"></i> Save Query</button>
  <button class="btn btn-primary text-uppercase" *ngIf="!!currentQuery" (click)="updateQuery()"><i class="fas fa-save"></i>Update Query</button>
</div>


<div class="card" *ngIf="showTable">
  <div class="card-body">
      <lib-data-table tableType="dataTable" [cons]="tableInfo?.cons" [data]="tableInfo?.data" tableId="queryTable"
          [tableNameForDownload]="tableNameForDownload" [currentState]="'district'" [loader]='false'
          [hieType]="'GEO'" [lastLevel]="'district'" [metaData]="{}">
      </lib-data-table>
  </div>
</div>