<lib-breadcrumb params="queryparams"></lib-breadcrumb>
<lib-toolbar
  [tableInfo]="tableData?.tableInfo"
  [recordData] = "masterRecordData"
  [totalData]= "masterTotalData"
  [headers]="tableData?.headers" 
  [downloadOptions] = "tableData?.downloadOptions"
  [headerCons]="headerCons"
  [tableId]="tableId"
  [metaData]="metaData">
</lib-toolbar>

<!-- Table Start -->

<div class="col-12 col-lg-12  col-md-12 col-sm-12">
  <div [tableHeaderFixer] = "{apply: headerFixerOptions}" #tablefixer class="table-responsive" style="max-height: 350px;">
    <table class="table table-bordered no-m table-fixed" 
      [id]="tableId" [ngClass]="tableData?.css?.tableClass">
      <thead
        class="fixed"
        [ngClass] = "tableData?.css?.theadClass " 
        lib-header-row 
        [headers]="tableData?.headers" 
        [defaultSortOptions]="sortOptions"
        [indexCons]="indexCons">
      </thead>

      <tbody 
        class="bodyItems"
        [ngClass]="tableData?.css?.tbodyClass"
        *ngIf="tableType == 'dataTable'"
        lib-rows 
        [recordData] = "tableData?.recordData" 
        [totalData]= "tableData?.totalData"
        [hieType]="hieType"
        [lastLevel]="lastLevel"
        [defaultSortOptions]="sortOptions"
        [totalCols]="tableData?.totalCols" 
        [dataTypes]="tableData?.dataTypes"
        [paginatorOptions] = "paginatorOptions"
        [noData]="this.noData"
        [customTemplates]="customTemplates"
        [headers]="tableData?.headers"
        [indexCons]="indexCons">
      </tbody>
    </table>
  </div>
  <ng-container *ngIf="paginatorOptions.visible">
    <lib-footer
        [recordData] = "tableData?.recordData"
        [paginatorOptions] = "paginatorOptions" >
    </lib-footer>
  </ng-container>
</div>

<!-- Table End-->