<div class="modal-header">
  <h4 class="modal-title">{{ title }}</h4>
  <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss()">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
<div class="modal-body">
  <div [innerHTML]="description">

  </div>
</div>
<div class="modal-footer">
  <button type="button" *ngFor="let btn of buttons;" class="btn" [ngClass]="btn.classes" (click)="handleAction(btn)">{{btn.name}}</button>
</div>
