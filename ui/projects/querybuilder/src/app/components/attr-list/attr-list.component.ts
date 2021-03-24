import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'qb-attr-list',
  templateUrl: './attr-list.component.html',
  styleUrls: ['./attr-list.component.scss']
})
export class AttrListComponent implements OnInit {

  @Input('template') template: TemplateRef<any>;
  @Input('nestedTemplate') nestedTemplate: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
