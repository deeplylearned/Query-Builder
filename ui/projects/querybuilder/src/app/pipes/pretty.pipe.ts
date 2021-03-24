import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Pipe({
  name: 'pretty'
})
export class PrettyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return !isNullOrUndefined(value) ? JSON.parse(JSON.stringify(value, undefined, 4).replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>')) : '';
  }

}
