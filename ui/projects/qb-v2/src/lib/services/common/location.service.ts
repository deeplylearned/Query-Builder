import { isNullOrUndefined } from 'util';
import { ProjConstants } from './../../constant/proj.constant'
import { LocationConstant } from './../../model/location.constant.model';

export class LocationService {

    private hie: object = ProjConstants.LOCATION_HIE;
    private locationConstantDefaultOptions: LocationConstant = ProjConstants.LOCATION_CONSTANT_OPTIONS;

    constructor() { }

    generateLocationConstantForALocation(location: string, hieType: string, lastLevel: string) {
        this.locationConstantDefaultOptions = !isNullOrUndefined(this.locationConstantDefaultOptions) ? this.locationConstantDefaultOptions : this.setDefaultLocationConstantOptions();

        if (!isNullOrUndefined(this.hie)) {
            let currentHie, child, name, dataType, currentLocationIndex, childIndex, loc, lastLevelIndex;

            currentHie = (!isNullOrUndefined(this.hie[hieType])) ? this.hie[hieType] : this.hie['DEFAULT_HIE'];
            lastLevel = !isNullOrUndefined(lastLevel) ? lastLevel : currentHie[currentHie.length - 1];
            currentLocationIndex = currentHie.indexOf(location);
            child = currentLocationIndex < 0 ? this.locationConstantDefaultOptions['child'] : currentHie[currentLocationIndex + 1];
            childIndex = currentHie.indexOf(child);
            lastLevelIndex = currentHie.indexOf(lastLevel);
            loc = (currentLocationIndex > 0 && childIndex > 0 && currentLocationIndex <= currentHie.indexOf(lastLevel)) ? 'LOCATION' : 'FINALLOCATION';
            return this.createLocationObject(location, loc, child);
        } else {
            console.log('LOCATION_HIE not found in projConstants');
            return this.locationConstantDefaultOptions;
        }
    }

    setDefaultLocationConstantOptions() {
        let obj: object = {
            name: 'District',
            url: ['entityName', 'entityId'],
            dataType: 'FINALLOCATION',
            child: 'district',
            jsonkey: 'entityName',
        }
        return { ...this.locationConstantDefaultOptions, ...obj };
    }

    createLocationObject(name: string, dataType: string, child: string): LocationConstant {
        return {
          name: name.slice(0,1).toUpperCase()+name.slice(1).toLowerCase(),
          jsonkey: !isNullOrUndefined(this.locationConstantDefaultOptions['jsonkey']) ? this.locationConstantDefaultOptions['jsonkey'] : 'entityName',
          child: !isNullOrUndefined(child) ? child : this.locationConstantDefaultOptions['child'],
          dataType: !isNullOrUndefined(dataType) ? dataType : this.locationConstantDefaultOptions['dataType'],
          url: !isNullOrUndefined(this.locationConstantDefaultOptions['url']) ? this.locationConstantDefaultOptions['url'] : ['entityName', 'entityId']
        }
      }
  
 

}