<div class="modal-header">
  <h4 class="modal-title" id="modal-title">Aggregate</h4>
  <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss()">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
<div class="modal-body minimum-height-modal-box">
  <!-- <div class="row">
    <div class="col-12 mb-3">
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text"><i class="fas fa-search"></i></span>
        </div>
        <input class="form-control" placeholder="Search college by name or ID" type="text">
      </div>
    </div>
  </div> -->
  <div class="row" id="aggregateFieldSuggestions">
    <!-- <div class="col-12" *ngFor="let attr of attributes; let i = index;">
      <div class="custom-control custom-checkbox my-3">
        <ng-container *ngIf="!attr.childObject">
          <input class="custom-control-input" [id]="attr.fieldName" type="checkbox" [(ngModel)]="attr.aggStatus">
          <label class="custom-control-label" for="{{attr.fieldName}}">{{ attr.uiName }}</label>
        </ng-container>
        <ng-container *ngIf="!!attr.childObject">
          <template [ngTemplateOutlet]="aggAttrList" [ngTemplateOutletContext]="{attr: attr,id: attr.fieldName+'_'+i}"></template>
        </ng-container>
      </div>
    </div> -->
    <div class="card mt-2 shadow-sm w-100" *ngFor="let attr of attributes;let i=index">
      <div class="card-body py-2 px-3" *ngIf="!attr.childObject">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" value="true" [(ngModel)]="attr.aggStatus"  [id]="'agg_'+i">
          <label class="custom-control-label" for="agg_{{i}}">{{attr.uiName}}</label>
        </div>
      </div>
      <template *ngIf="!!attr.childObject" [ngTemplateOutlet]="aggAttrList" [ngTemplateOutletContext]="{attr: attr,id: attr.fieldName+'_'+i}"></template>
    </div>
  </div>
</div>
<div class="modal-footer">
  <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('')">Cancel</button>
  <button type="button" ngbAutofocus class="btn btn-danger" (click)="addAggAttrs()">Ok</button>
</div>

<!-- TODO: Make Parent attribute checkbox should be in sync with child checkboxes. -->
<ng-template #aggAttrList let-attr="attr" let-id="id">
  <div class="card-body py-2 px-3">
    <div class="atribute-group" id="accordion01">
      <div class="group-header d-flex align-items-center">
        <a class="collapsebtn" id="groupHeadingOne" data-toggle="collapse" data-target="#groupOne" aria-expanded="true" 
        aria-controls="groupOne" (click)="attr.isAggListOpened = !attr.isAggListOpened">
          <i class="fas" [ngClass]="!!attr.isAggListOpened ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        </a>
        <div class="custom-control custom-checkbox flex-fill">
          <input class="custom-control-input" [id]="'agg_'+id" type="checkbox"  value="true" [(ngModel)]="attr.aggStatus" (change)="changeStatusOfChilds(attr, attr.aggStatus)">
          <label class="custom-control-label" for="agg_{{id}}">{{attr.uiName}}</label>
        </div>
      </div>
    </div>

    <div id="groupOne" class="collapse show group-body" [hidden]="!attr.isAggListOpened">
      <ng-container  *ngFor="let sub of attr.childObject;let j = index;">
        <ng-container *ngIf="!sub.childObject">
          <div class="custom-control custom-checkbox flex-fill">
            <input class="custom-control-input" [id]="'agg_'+id+'_'+j" type="checkbox" value="true" [(ngModel)]="sub.aggStatus">
            <label class="custom-control-label" for="agg_{{id}}_{{j}}">{{sub.uiName}}</label>
          </div>
        </ng-container>
        <ng-container *ngIf="!!sub.childObject">
          <template [ngTemplateOutlet]="aggAttrList" [ngTemplateOutletContext]="{attr: sub, id: id+'_'+j}"></template>
        </ng-container>
      </ng-container>
    </div>
  </div>
  </ng-template>