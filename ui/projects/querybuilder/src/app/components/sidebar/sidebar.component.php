<div class="left-container">
  <div class="form-group header">
    <div class="title mt-0 mb-2 font-weight-600">Select Type</div>
    <select class="form-control font-weight-600 shadow bg-default border-0 text-white" [(ngModel)]="selectedIndex"
      (change)="onIndexChange()">
      <option value="-1">Select Index</option>
      <option *ngFor="let opt of indexes" [value]="opt">{{opt}}</option>
    </select>
  </div>
  <div class="body-content" id="attribute-list">
    <div class="card mt-2 shadow-sm" *ngFor="let attr of attributes;let i=index">
      <!-- <template [ngTemplateOutlet]="filter" [ngTemplateOutletContext]="{attr:attr, i: i}"></template> -->
      <div class="card-body py-0 px-3" *ngIf="!attr.childObject">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" value="true" [(ngModel)]="attr.status"  [id]="i">
          <label class="custom-control-label" for="{{i}}">{{attr.uiName}}</label>
        </div>
      </div>
    
      <div class="card mt-2 shadow-sm" *ngIf="!!attr.childObject">
        <template [ngTemplateOutlet]="nestedFilter" [ngTemplateOutletContext]="{attr: attr,id: attr.fieldName+'_'+i}"></template>
      </div>
    </div>
  </div>
  <div class="footer-button">
    <button class="btn btn-primary btn-block" (click)="addAttribute()">Add Attributes</button>
  </div>
</div>

<!-- TODO: Make Parent attribute checkbox should be in sync with child checkboxes. -->
<ng-template #nestedFilter let-attr="attr" let-id="id">
  <div class="card-body py-0 px-3">
    <div class="atribute-group" id="accordion01">
      <div class="group-header d-flex align-items-center">
        <a class="collapsebtn" id="groupHeadingOne" data-toggle="collapse" data-target="#groupOne" aria-expanded="true" 
        aria-controls="groupOne" (click)="attr.isOpened = !attr.isOpened">
          <i class="fas" [ngClass]="!!attr.isOpened ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        </a>
        <div class="custom-control custom-checkbox flex-fill">
          <input class="custom-control-input" [id]="id" type="checkbox"  value="true" [(ngModel)]="attr.status" (change)="changeStatusOfChilds(attr, attr.status)">
          <label class="custom-control-label" for="{{id}}">{{attr.uiName}}</label>
        </div>
      </div>
    </div>

    <div id="groupOne" class="collapse show group-body" [hidden]="!attr.isOpened">
      <ng-container  *ngFor="let sub of attr.childObject;let j = index;">
        <ng-container *ngIf="!sub.childObject">
          <div class="custom-control custom-checkbox flex-fill">
            <input class="custom-control-input" [id]="id+'_'+j" type="checkbox" value="true" [(ngModel)]="sub.status">
            <label class="custom-control-label" for="{{id}}_{{j}}">{{sub.uiName}}</label>
          </div>
        </ng-container>
        <ng-container *ngIf="!!sub.childObject">
          <template [ngTemplateOutlet]="nestedFilter" [ngTemplateOutletContext]="{attr: sub, id: id+'_'+j}"></template>
        </ng-container>
      </ng-container>
    </div>
  </div> 
</ng-template>