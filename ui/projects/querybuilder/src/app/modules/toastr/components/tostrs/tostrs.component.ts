import { ToastrService } from './../../services/toastr.service';
import {Component, TemplateRef} from '@angular/core';


@Component({
  selector: 'qb-tosts',
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hide)="toastService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
  host: {'[class.ngb-toasts]': 'true'}
})
export class TostrsComponent {
  constructor(public toastService: ToastrService) {}

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
}
