<ng-container>
  <ng-container *ngFor="let dataType of cellData.dataType; let i = index">
    <ng-container *ngIf="cellData.values[i] == '-'">
      <span>-</span>
    </ng-container>
    <ng-container *ngIf="cellData.values[i] != '-'">
      <ng-container *ngIf="dataType == 'NUMBER'">
        <span class="text-right">{{ cellData.values[i] | number }}</span>
      </ng-container>
      <ng-container *ngIf="dataType == 'TEXT'">
        <span class="text-left">{{ cellData.values[i] }}</span>
      </ng-container>
      <ng-container *ngIf="dataType == 'PERCENTAGE'">
        <span class="text-right"> {{ cellData.values[i] }}%</span>
      </ng-container>
      <ng-container *ngIf="dataType == 'DATE'">
        <span class="text-left"> {{ cellData.values[i] | date }}</span>
      </ng-container>
      <ng-container *ngIf="dataType == 'LOCATION'">
        <span *ngIf="!isTotalData" class="text-left link" (click)="updateState(i)"> {{ cellData.values[i].value | uppercase }}</span>
        <span *ngIf="isTotalData" class="text-left">{{ cellData.values[i].value | uppercase }}</span>
      </ng-container>
      <ng-container *ngIf="dataType == 'FINALLOCATION'">
        <span class="text-left"> {{ cellData.values[i].value }} </span>
      </ng-container>
      <ng-container *ngIf="dataType == 'POPUP'">
        <span *ngIf="!isTotalData" class="text-right link" (click)="popupCalled(i)"> {{ cellData.values[i] }}</span>
        <span *ngIf="isTotalData" class="text-right">{{ cellData.values[i].value }}</span>
      </ng-container>
    </ng-container>
  </ng-container>
</ng-container>