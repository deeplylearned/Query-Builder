import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[lib-total-row]',
  templateUrl: './total-row.component.html',
  styleUrls: ['./total-row.component.css']
})
export class TotalRowComponent implements OnInit {

  @Input() totalrow: any;
  @Input() hieType: string;
  @Input() lastLevel: string;
  @Input() noData: boolean;
  @Input() indexCons: object;

  constructor() { }

  ngOnInit() {  }

}
