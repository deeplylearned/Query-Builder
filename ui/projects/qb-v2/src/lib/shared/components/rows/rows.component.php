<ng-container 
  *ngFor="let row of filteredData | paginate: config; let i = index ;">
  <tr 
    lib-row 
    [datarow]="row"
    [index]="i + offset + 1"
    [indexCons]="indexCons"
    [hieType]="hieType"
    [lastLevel]="lastLevel"
    [customTemplates]="customTemplates"
    [headers]="headers">
  </tr>
</ng-container>
<ng-container>
  <tr *ngIf="totalRowStatus"
    lib-total-row
    [totalrow]="totalData"
    [hieType]="hieType"
    [lastLevel]="lastLevel"
    [noData]="noData"
    [indexCons]="indexCons">
  </tr>
</ng-container>
<ng-container *ngIf="noData">
  <tr>
    <td [attr.colspan]="totalCols" class="text-center">No Data to Display</td>
  </tr>
</ng-container>
