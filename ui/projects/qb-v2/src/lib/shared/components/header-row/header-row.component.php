<tr *ngFor="let headerRow of headers; let i = index">
  <th 
    class="table-header" 
    [attr.rowspan] = headers?.length 
    *ngIf="i == 0 && indexCons.show" [ngClass]="indexCons?.class || tc-bg-01">S.No
  </th>
  <th 
    class="table-header"
    *ngFor="let header of headerRow"
    [attr.rowspan]="header?.rows"
    [attr.colspan]="header?.cols"
    [ngClass]="header?.class || 'tc-bg-01'">
      {{header.name}}
    <i [ngClass]="getSortIconClass(header)" (click)="header?.sortable ? sortHeader(header) : ''"></i>
  </th>
</tr>