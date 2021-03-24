<div class="card card-form shadow-sm mb-4">
  <div class="card-header d-flex align-items-center">
    <h4 class="flex-fill m-0">{{ name }}</h4>
    <div class="form-group mb-0 mr-4 d-flex align-items-center">
      <label for="" class="mr-4 mb-0 text-nowrap">Choose {{ name}}</label>
      <ng-select
          [items]="attributes"
          groupBy="parentUI"
          [multiple]="true"
          bindLabel="uiName"
          [selectableGroup]="true"
          [selectableGroupAsModel]="false"
          [closeOnSelect]="false"
          [(ngModel)]="selectedAttr"
          (change)="attrChanged()"
          [disabled]="disabled"
          placeholder="Select {{name}}"
          >

          <ng-template ng-multi-label-tmp let-items="items" let-clear="clear">
            <div class="ng-value" *ngFor="let item of items | slice:0:2">
                <span class="ng-value-label">{{item.uiName}}</span>
                <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
            </div>
            <div class="ng-value" *ngIf="items.length > 2">
                <span class="ng-value-label">{{items.length - 2}} more...</span>
            </div>
          </ng-template>

          <ng-template ng-optgroup-tmp let-item="item" let-item$="item$" let-index="index">
              <input id="item-{{index}}" type="checkbox" [ngModel]="item$.selected"/> {{item.parentUI}}
          </ng-template>

          <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
              <input id="item-{{index}}" type="checkbox" [ngModel]="item$.selected"/> {{item.uiName}}
          </ng-template>
      </ng-select>
    </div>
    <a class="card-link-expand-collapsed collapsed" *ngIf="collapsedStep" aria-expanded="true" (click)="toggleStep()" data-toggle="collapse">
      <i class="fas" [ngClass]="{'fa-chevron-down': isOpened, 'fa-chevron-right': !isOpened}"></i>
      <!-- {{ isOpened ? 'Close' : 'Open'}} -->
    </a>
  </div>
  <div class="collapse" [ngClass]="{'show': isOpened}" *ngIf="collapsedStep">
    <div class="card-body" *ngIf="formType == 'filter'">
      <ng-container *ngFor="let attr of selectedAttr; let i=index; let last=last">
        <div class="form-row">
          <div class="col-3 align-self-center font-weight-600">
            {{ (attr.parentUI ? attr.parentUI+" > " : '') }} {{ attr.uiName }}
          </div>
          <div class="col-3">
            <select name="" class="form-control form-control-sm" [(ngModel)]="attr.ot" (change)="getOptionsForAttr(attr)">
              <option value="-1">Select Operator</option>
              <option value="equals">Equals</option>
              <ng-container *ngIf="attr.dataType == 'long' || attr.dataType == 'float'">
                <option value="gt">Greater Than</option> 
                <option value="lt">Less Than</option>
                <option value="gte">Greater Than or Equals</option>
                <option value="lte">Less Than or Equals</option>
                <option value="range">Range </option>
              </ng-container>
            </select>
          </div>
          <div class="col" *ngIf="attr.ot != -1">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend" *ngIf="attr.dataType == 'date'">
                <span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
              </div>
              <ng-select style="width: 100%"
                [items]="attr.options"
                [multiple]="true"
                [closeOnSelect]="false"
                [(ngModel)]="attr.value"
                placeholder="Select {{attr.uiName}} Value"
                >

                <ng-template ng-multi-label-tmp let-items="items" let-clear="clear">
                  <div class="ng-value" *ngFor="let item of items | slice:0:2">
                      <span class="ng-value-label">{{item}}</span>
                      <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
                  </div>
                  <div class="ng-value" *ngIf="items.length > 2">
                      <span class="ng-value-label">{{items.length - 2}} more...</span>
                  </div>
                </ng-template>

                <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
                    <input id="item-{{index}}" type="checkbox" [ngModel]="item$.selected"/> {{item}}
                </ng-template>
              </ng-select>
            </div>

          </div>
          <div class="col" *ngIf="attr.ot != -1 && attr.ot == 'range'">
            <div class="input-group input-group-sm">
              <ng-select style="width: 100%"
                [items]="attr.options"
                [multiple]="true"
                [closeOnSelect]="false"
                [(ngModel)]="attr.rangeValue"
                placeholder="Select {{attr.uiName}} Range Value"
                >

                <ng-template ng-multi-label-tmp let-items="items" let-clear="clear">
                  <div class="ng-value" *ngFor="let item of items | slice:0:2">
                      <span class="ng-value-label">{{item}}</span>
                      <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
                  </div>
                  <div class="ng-value" *ngIf="items.length > 2">
                      <span class="ng-value-label">{{items.length - 2}} more...</span>
                  </div>
                </ng-template>

                <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
                    <input id="item-{{index}}" type="checkbox" [ngModel]="item$.selected"/> {{item}}
                </ng-template>
              </ng-select>
            </div>

          </div>
          <div class="col-auto">
            <button class="btn btn-sm btn-outline-danger" (click)="removeAttr(i)">
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <hr *ngIf="!last" class="my-3 bg-border">
      </ng-container>
      <ng-container *ngIf="selectedAttr.length == 0">
          <div class="col-12 font-weight-bold text-center">
            No Filters selected.
          </div>
        </ng-container>
    </div>
    <div class="card-body" *ngIf="formType == 'aggregate'">
      <div class="row">
        <ng-container *ngFor="let attr of selectedAttr;let i=index; let last=last;">
          <div class="col col-md-6">
            <div class="form-row">
              <div class="col-5 align-self-center font-weight-600">{{attr.uiName}}</div>
              <div class="col">
                <select name="" class="form-control form-control-sm" [(ngModel)]="attr.aggType">
                  <option value="-1">Select Aggregate Operation</option>
                  <option value="groupBy">Group By</option>
                  <option *ngIf="attr.dataType != 'text'" value="sum">Sum</option>
                  <option *ngIf="attr.dataType != 'text'" value="avg">Avg</option>
                  <option *ngIf="attr.dataType != 'text'" value="min">Min</option>
                  <option *ngIf="attr.dataType != 'text'" value="max">Max</option>
                </select>
              </div>
              <div class="col-auto">
                <button class="btn btn-sm btn-outline-danger" (click)="removeAttr(i)">
                  <i class="far fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
          <hr *ngIf="!last && i%2 == 1" class="my-3 bg-border"/>
        </ng-container>
        <ng-container *ngIf="selectedAttr.length == 0">
          <div class="col-12 font-weight-bold text-center">
            No Aggregate Filters selected.
          </div>
        </ng-container>
      </div>
        <!-- <hr *ngIf="!" class="my-3 bg-border"> -->
    </div>
  </div>
</div>