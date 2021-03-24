<td *ngIf="noData"></td>
<ng-container *ngFor="let total of totalrow">
    <td *ngIf="indexCons.show">-</td>
    <ng-container *ngFor="let totalData of total">
        <td
         lib-table-cell
         [cellData]="totalData"
         [isTotalData]="true"
         [hieType]="hieType"
         [lastLevel]="lastLevel">
        </td>
    </ng-container>
</ng-container>