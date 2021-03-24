<template [ngTemplateOutlet]="filtersPreviewRef" [ngTemplateOutletContext]="{filters: filters, parentPath: ''}"></template>

<ng-template #filtersPreviewRef let-filters="filters" let-parentPath="parentPath">
  <ng-container *ngFor="let filter of filters">
    <template [ngTemplateOutlet]="filterPreviewRef" [ngTemplateOutletContext]="{filter: filter, parentPath: parentPath == '' ? filter.uiName : parentPath+ ' > ' + filter.uiName}"></template>  
  </ng-container>
</ng-template>

<ng-template #filterPreviewRef let-filter="filter" let-parentPath="parentPath">
  <ng-container *ngIf="!!filter.childObject">
    <template [ngTemplateOutlet]="filtersPreviewRef" [ngTemplateOutletContext]="{filters: filter.childObject, parentPath: parentPath}"></template>
    <!-- <template [ngTemplateOutlet]="filterPreviewRef" [ngTemplateOutletContext]="{filters: filter.childObject, parentPath: parentPath+' > '+filter.uiName}"></template> -->
  </ng-container>
  
  <ng-container *ngIf="!filter.childObject">
    <div class="form-row" id="1_filter_preview">
      <div class="col-3 align-self-center font-weight-600">
        <!-- {{filter.uiName}} -->
        {{filter.parentPath.split('##').join(' > ')}}
      </div>
      <div class="col-3">
        <select name="" class="form-control form-control-sm operation-types" id="1_op" [(ngModel)]="filter.operation" 
          (change)="!!filter.searchTypeDropdown ? getAllOptionsForAttr(filter) : ''">
          <option value="-1">Select Operation</option>
          <option value="match">Match</option>
          <option value="range" *ngIf="!!filter.dataType && filter.dataType.toLowerCase() == 'long'">Range</option>
        </select>
      </div>
      
      <div id="1_filter_val" class="col" *ngIf="!!filter.operation && filter.operation != '-1' && !!filter.searchTypeDropdown">
        <!-- <select name="" class="form-control form-control-sm operation-types" id="1_op" [(ngModel)]="filter.filterVal">
          <option value="-1">Select Value</option>
          <option *ngFor="let opt of filter.filterValues" [value]="opt">{{opt}}</option>
        </!--> 

        <ng-select [items]="filter.filterValues"
          [multiple]="true"
          [closeOnSelect]="false"
          [(ngModel)]="filter.filterVal">

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
      <div id="1_filter_val" class="col" *ngIf="!!filter.operation && filter.operation != '-1' && !filter.searchTypeDropdown">
        <input [name]="filter.fieldName" [(ngModel)]="filter.filterVal" class="form-control form-control-sm" placeholder="Enter {{filter.uiName}} value" />
      </div>

      <div id="1_filter_val" class="col" *ngIf="filter.operation == 'range' && !!filter.searchTypeDropdown">
        <!-- <select name="" class="form-control form-control-sm operation-types" id="1_op" [(ngModel)]="filter.filterRangeVal">
          <option value="-1">Select Value</option>
          <option *ngFor="let opt of filter.filterValues" [value]="opt">{{opt}}</option>
        </select> -->
        <ng-select [items]="filter.filterValues"
          [multiple]="true"
          [closeOnSelect]="false"
          [(ngModel)]="filter.filterRangeVal">

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
      <div id="1_filter_val" class="col" *ngIf="filter.operation == 'range' && !filter.searchTypeDropdown">
        <input [name]="filter.fieldName" [(ngModel)]="filter.filterRangeVal" class="form-control form-control-sm" placeholder="Enter {{filter.uiName}} End value" />
      </div>


      <div class="col-auto">
        <button class="btn btn-sm btn-outline-danger delete-attribute-icon" id="1_delte" (click)="deleteAttr(filter)">
          <i class="far fa-trash-alt"></i>
        </button>
      </div>
    </div>
    <hr class="my-3 bg-border">
  </ng-container>
</ng-template>