import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { QbService } from '../../services/qb.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'projects/qb-v2/src/lib/services/common/data.service';
import { ActivatedRoute } from '@angular/router';
import { ProjConstants } from 'projects/qb-v2/src/lib/constant/proj.constant';
import { DrillDownConstants } from '../../constants/drill-down.cnst';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'qb2-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestComponent implements OnInit {

  cons: object;
  tableData: object[] = [];
  tableNameForDownload: string = "demoTable";

  child: string;
  parent: string
  location: string;


  constructor(
    private qbSrv: QbService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private dataTableSrv: DataService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((p) => {
      this.child = p['child'] || 'district';
      this.parent = p['parent'] || 'state';
      this.location = p['location'] || 'AndhraPradesh##28';
      this.updateTable();
    })
    this.cons = this.dataTableSrv.getDemoCons();
    this.tableData = this.dataTableSrv.getDemoData();
    let x  = this.generateDrillDownHie("student");
    console.log(x);
    
    // this.cons = {}
    // this.tableData = [];
    // this.dataTableSrv.headers.subscribe(data => {
    //   this.headers = data;
    // });
  }

  // ngOnInit() {
  //   console.log("Data:: ",this.dataTableSrv.getDemoCons());
  //   this.cons = this.dataTableSrv.getDemoCons();
  //   this.tableData = this.dataTableSrv.getDemoData();
  //   // this.tableData = [];
  //   // this.loadResponse();
  // }

  updateTable() {
    // this.metaData = {
    //   State: 'AndhraPradesh',
    //   District: 'Srikakulam',
    //   Mandal: 'Amadavalasa'
    // }

    this.cons = this.dataTableSrv.getDemoCons();
    this.tableData = this.dataTableSrv.getDemoData();
  }

  loadResponse() {
    this.http.get('http://localhost:9003/assets/data/response.json')
      .subscribe((res) => {
        console.log("Res:: ", res);
        let tableConst = this.qbSrv.convertResponseToTableConstant(res, {}, false);
        console.log("[Test Component]:: ", tableConst);
      }, err => {
        console.log("Err:: ", err);
      })
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
