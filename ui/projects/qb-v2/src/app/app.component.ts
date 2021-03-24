import { ToastContainerDirective } from 'ngx-toastr';
import { Component, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'qb2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  constructor() {}

  ngOnInit(): void {
  }
}
