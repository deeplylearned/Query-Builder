import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableConstantSkeletonObject } from '../../../table/constants/table.constant';

@Component({
  selector: 'lib-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  @Input() params: string;

  breadcrumb = [];
  child: string;
  parent: string;
  location: string;
  defaultQueryParams: {};

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.defaultQueryParams = TableConstantSkeletonObject.defaultQueryParams;
    this.route.queryParams.subscribe(params => {
      this.child = params[this.defaultQueryParams['child']] || 'district';
      this.parent = params[this.defaultQueryParams['parent']] || 'state';
      this.location = params[this.defaultQueryParams['location']] || 'AndhraPradesh##28';
      this.generateBreadCrumb();
    })
  }

  generateBreadCrumb() {
    this.breadcrumb = [];
    if (this.params.toLowerCase() === 'queryparams' || this.params.toLowerCase() === 'params') {
      let param = this.params.toLowerCase() == 'queryparams' ? 'queryParams' : 'params';
      this.child = this.route.snapshot[param][this.defaultQueryParams['child']] || 'district';
      this.parent = this.route.snapshot[param][this.defaultQueryParams['parent']] || 'state';
      this.location = this.route.snapshot[param][this.defaultQueryParams['location']] || 'AndhraPradesh##28';

      let allStates = this.parent.split('&');
      allStates.push(this.child);
      let allLocations = this.location.split('&');

      for (let i = 1; i < allStates.length; i++) {
        let parent = allStates.slice(0, i).join('&');
        let location = allLocations.slice(0, i).join('&');
        let name = allLocations[i - 1].split('##')[0];
        
        let obj = {
          'child': allStates[i],
          'parent': parent,
          'location': location,
          'name': name
        }
        this.breadcrumb.push(obj);
      }
    } else {
      console.log('Invalid paramstype');
    }
  }

  goToLevel(level) {
    let state = {...level};
    delete state.name;
    this.router.navigate(['.'], {relativeTo: this.route, queryParams: {child: state.child, parent: state.parent, location: state.location}, queryParamsHandling: 'merge'});
  }
}
