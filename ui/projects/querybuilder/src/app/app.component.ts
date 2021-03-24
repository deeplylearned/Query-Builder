import { EventsService } from './services/events.service';
import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'qb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'querybuilder';

  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  subscriptions: Subscription[] = [];

  constructor(
    private evSrv: EventsService,
    // private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    // this.toastrService.overlayContainer = this.toastContainer;
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.evSrv.filterAttr.subscribe((res) => {
      // console.log('filterAttr changed: ', res);
    })
  }

  addFilterAttr() {
    // console.log("add");
  }
}
