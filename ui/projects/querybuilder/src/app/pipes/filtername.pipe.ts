import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtername'
})
export class FilternamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
