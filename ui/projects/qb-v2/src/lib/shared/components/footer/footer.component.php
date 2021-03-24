<div class="row p-2" style="margin-top: 2.5vh;">
    <div class="col-md-2">
        <select class="form-control" [(ngModel)]="limit" (change)="limitChanged(limit)">
            <option *ngFor="let dropValue of dropdownOptions" [ngValue]="dropValue.value">{{dropValue.display}}
            </option>
        </select>
    </div>
    <div class="col-md-10">
        <pagination-controls (pageChange)="pageChanged($event)" (pageBoundsCorrection)="pageChanged($event)"
            [maxSize]="maxSize" [directionLinks]="directionLinks" [autoHide]="autoHide" responsive="true"
            [previousLabel]="previousLabel" [nextLabel]="nextLabel" screenReaderPaginationLabel="Pagination"
            screenReaderPageLabel="page" screenReaderCurrentLabel="You're on page" style="float: right;">
        </pagination-controls>
    </div>
</div>