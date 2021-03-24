<div class="mb-2">
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item" *ngFor="let b of breadcrumb; let i=index; let j = last" [ngClass]=" j ? 'active' : ''">
        <a *ngIf="!j" class="text-primary link" style="cursor: pointer;" (click)="goToLevel(b)">{{ b.name }}</a>
        <span *ngIf="j">{{ b.name }}</span>
      </li>
    </ol>
  </nav>
</div>