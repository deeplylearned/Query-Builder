import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TostrsComponent } from './components/tostrs/tostrs.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TostrsComponent],
  imports: [
    CommonModule,
    NgbModule.forRoot()
  ]
})
export class ToastrModule { }
