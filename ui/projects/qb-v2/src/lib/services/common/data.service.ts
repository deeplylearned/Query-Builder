import { LocationService } from './location.service';
import { Injectable, EventEmitter } from '@angular/core';
import { demoCons } from '../../constant/demo.constant';
import { ProjConstants } from '../../constant/proj.constant';

@Injectable()
export class DataService {

    constructor(private locationService : LocationService) { }

    generateLocationConstantForALocation(currentLocation: string, hieType: string, lastLevel: string) {
        return this.locationService.generateLocationConstantForALocation(currentLocation, hieType, lastLevel);
    }

    getInitialTableData(renderedData:object[]) {
        let cons = JSON.parse(JSON.stringify(demoCons));
        let tableData = renderedData;
        return {cons, tableData};
    }

    getDemoCons() {
        // console.log(ProjConstants);
        if(!!ProjConstants && !!ProjConstants.DEMO_CONS) 
            return JSON.parse(JSON.stringify(ProjConstants.DEMO_CONS));
        else   
            return null;
    }

    getDemoData() {
        if(!!ProjConstants && !!ProjConstants.DEMO_DATA) 
            return JSON.parse(JSON.stringify(ProjConstants.DEMO_DATA));
        else   
            return null;
    }
}