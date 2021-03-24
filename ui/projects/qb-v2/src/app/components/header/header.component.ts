import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageQueriesComponent } from '../manage-queries/manage-queries.component';

@Component({
  selector: 'qb2-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  expanded: boolean = false;

  constructor(
    private _modal: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }
  
  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  manageQueries() {
    const manageQueryModalRef = this._modal.open(ManageQueriesComponent, {size: 'lg'});
    this.toggleExpanded();
    manageQueryModalRef.result.then((res) => {
      // console.log(res);
      this.router.navigate(['', 'query'], {queryParamsHandling: 'preserve'});
    }, (err) => {
      console.log(err);
    })
  }

  createNewQuery() {
    console.log("coming here");
    this.router.navigate(['', 'query']);
  }

}
