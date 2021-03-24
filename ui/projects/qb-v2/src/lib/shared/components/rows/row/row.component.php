<td *ngIf="index && indexCons.show" [ngClass]="indexCons?.class || tc-bg-01">{{index}}</td>
<ng-container *ngFor="let rowData of datarow; let i=index">
  <ng-container *ngIf="customTemplates && customTemplates[i]">
    <ng-container *ngTemplateOutlet="customTemplates[i];context:{rowData: datarow, index:i}">
    </ng-container>
  </ng-container>
  <ng-container *ngIf="!customTemplates || !customTemplates[i]">
    <td (click)="cellInfo(datarow,$event,i,headers)" lib-table-cell [cellData]="rowData" [isTotalData]="false"
      [hieType]="hieType" [lastLevel]="lastLevel" [ngClass]="rowData?.class || 'tc-bg-01'">
    </td>
  </ng-container>
</ng-container>