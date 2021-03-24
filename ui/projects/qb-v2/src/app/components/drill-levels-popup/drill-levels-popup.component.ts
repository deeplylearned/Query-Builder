import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { DrillDownConstants } from '../../constants/drill-down.cnst';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'qb2-drill-levels-popup',
  templateUrl: './drill-levels-popup.component.html',
  styleUrls: ['./drill-levels-popup.component.scss']
})
export class DrillLevelsPopupComponent implements OnInit {

  @Input() data:any;
  levels:any[];
  levelSelected:any;

  constructor(
    public modal: NgbActiveModal,
    private commonSrv: CommonService) { }

  ngOnInit() {
    this.levels = this.generateDrillDownHie(this.data.popupInfo.data.level);
  }

  close() {
    this.modal.dismiss();
  }

  showResults() {
    if(!!this.levelSelected) {
      let info = {
        child: this.levelSelected, 
        parentValue: this.data.values[0], 
        parent: this.data.popupInfo.data.level
      }
      this.modal.close(info);
    }else {
      this.commonSrv.showToastMessage('Select alteast one option', 'error');
    }
  }

  generateDrillDownHie(level){
    var children = [];
    let drill_hie = DrillDownConstants.DRILL_HIE[level];
    if(isNullOrUndefined(drill_hie)){
      return children;
    }
    drill_hie.forEach(h => {
      if(children.indexOf(h) === -1) {
      children.push(h);
    }
      let next = this.generateDrillDownHie(h);
      next.forEach(hi => {
        if(children.indexOf(hi) === -1) {
          children.push(hi);
        }
      })
    });
    return children;
  }
}
