import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'qb2-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit, OnChanges {

  @Input('name') name: string;
  @Input('attributes') attributes: any[];
  @Input('collapsedStep') collapsedStep: boolean;
  @Input("disabled") disabled: boolean;
  @Input("formType") formType: string;
  @Input('index') index: string;
  @Input("selectedAttr") selectedAttr: any[];
  @Output('selectedAttrChange') selectedAttrChange = new EventEmitter<any>();

  isOpened: boolean = true;
  stepForm:FormArray = new FormArray([]);

  myForm: FormGroup;
  
  constructor(
    private httpSrv: HttpService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    if(changes && changes.selectedAttr && changes.selectedAttr.currentValue)
      this.selectedAttr = changes.selectedAttr.currentValue;
  }

  toggleStep() {
    this.isOpened = !this.isOpened;
  }

  attrChanged() {
    this.selectedAttrChange.emit(this.selectedAttr);
  }

  removeAttr(index) {
    this.selectedAttr = this.selectedAttr.filter((s, i) => i != index);
    this.attrChanged();
  }

  getOptionsForAttr(attr) {
    attr.value = [];
    attr.rangeValue = [];
    // If Operations Type is Selected call an API to get all possible values for that attribute.
    if(!!attr.ot && attr.ot != '-1') {
      let path = (attr.parentKey ? attr.parentKey.replace(/ > /g, '.')+'.' : '')+attr.fieldName;
      this.httpSrv.makeGetApiCall('GET_OPTIONS_FOR_ATTRIBUTE', {'REPLACE_WITH_INDEX': this.index, 'ATTRIBUTE': path})
      // this.httpSrv.getMockData('valueOfAttr')
      .subscribe((res) => {
        attr.options = res.result.content;
      }, (err) => {
        console.log(err);
        attr.options = [];
      })
    }else {
      // If Operation is not selected It will remove the options from the 
      attr.options = [];
    }
  }

}
