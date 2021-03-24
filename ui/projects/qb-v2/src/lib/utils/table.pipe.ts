import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined, isNumber } from 'util';

@Pipe({
  name: 'table'
})
export class TablePipe implements PipeTransform {

  transform(value: any, pipe?: string, args?: any): any {
    if (!isNullOrUndefined(pipe)) {
      return !!this[pipe] ? this[pipe](value, args) : value;
    } else {
      return value;
    }
  }

  formatNumberToCurrency(value, args?: any) {
    if (value >= 10000000) {
      return (value / 10000000).toFixed(2) + ' Cr';
    } else if (value < 10000000 && value >= 100000) {
      return (value / 100000).toFixed(2) + ' L';
    } else {
      return value;
    }
  }

  formatNumber(value) {
    if (isNullOrUndefined(value)) {
      return '-'
    }
    if (isNumber(value)) {
      return parseFloat(value.toFixed(2)).toLocaleString('en-IN');
    } else {
      return value;
    }
  }

  sortObjectBasedOnKey(value, args?: any) {
    if (typeof value == 'object') {
      // let flattened = this.dataSrv.flattenObject(value);
      let filtered = [...value];
      // console.log(value);
      let sortKey = !isNullOrUndefined(args) && args.length > 0 ? args[0] : null;
      let order = !isNullOrUndefined(args) && args.length > 1 ? args[1] : 'asc';
      let sortOrderList = !isNullOrUndefined(args) && args.length > 2 ? args[2] : [];
      let defaultActions = ['FIXEDBOTTOM', 'FIXEDTOP'];

      return filtered.sort((a, b) => {
        let aVal = !isNullOrUndefined(a) && !!sortKey && !isNullOrUndefined(a[sortKey]) ? a[sortKey] : null;
        let bVal = !isNullOrUndefined(b) && !!sortKey && !isNullOrUndefined(b[sortKey]) ? b[sortKey] : null;

        if (!isNullOrUndefined(aVal) && !isNullOrUndefined(bVal)) {
          if (sortOrderList.length > 0) {
            let defaultSortValues = sortOrderList.map((s) => s.split('##')[0]);
            let mapActionWithSortVal = sortOrderList.map((s) => { let obj = {}; return obj[s.split('##')[0]] = s.split('##')[1] });

            let aValInD = defaultSortValues.indexOf(aVal);
            let bValInD = defaultSortValues.indexOf(bVal);

            let aAction = aValInD != -1 ? defaultActions.indexOf(mapActionWithSortVal[aVal]) : -1;
            let bAction = bValInD != -1 ? defaultActions.indexOf(mapActionWithSortVal[bVal]) : -1;

            if (aAction != -1 || bAction != -1) {
              // if(defaultActions[aAction] == 'FIXEDTOP') {
              //   if(defaultActions[bAction] == 'FIXEDBOTTOM'){
              //     return 1;
              //   }else {
              //     return aValInD == ;
              //   }
              // }else if(defaultActions[aAction] == 'FIXEDBOTTOM' && ) {
              //   if(defaultActions[bAction] == 'FIXEDBOTTOM'){
              //     return 1;
              //   }else {
              //     return -1;
              //   }
              // }
              return aAction - bAction;
            } else {
              return aValInD - bValInD;
            }
          } else {
            return this.applySortLogic(aVal, bVal, order);
          }
        }
      })
      // return value;
    } else {
      return value;
    }
    // return value;
  }

  vassarTableSorting(value, args?: any) {
    if (!!value) {
      let filtered = [...value];
      let sortOptions = args[0];
      
      if (!isNullOrUndefined(filtered) && !isNullOrUndefined(sortOptions)) {
        filtered.sort((a, b) => {
          let sortIndex = sortOptions.sortIndex;
          let sortType = sortOptions.sortType;
          let defaultSortOrderList = a[sortIndex] ? a[sortIndex].sortOrderList : [];
          let aVal = a[sortIndex] ? a[sortIndex].values : [], bVal = b[sortIndex] ? b[sortIndex].values : [];

          if (!isNullOrUndefined(aVal) && !isNullOrUndefined(bVal)) {
            let flag = 0;
            let dVal = defaultSortOrderList ? defaultSortOrderList.map((record) => record.split('##')[0]) : [];
            aVal = aVal.map((e) => typeof e == 'object' ? e.value.toString().toUpperCase() : e.toString().toUpperCase());
            bVal = bVal.map((e) => typeof e == 'object' ? e.value.toString().toUpperCase() : e.toString().toUpperCase());
           
            let aValInD = dVal.some(ele => aVal.indexOf(ele) != -1);
            let bValInD = dVal.some(ele => bVal.indexOf(ele) != -1);
            
            flag = (aValInD || bValInD) ? 1 : 0;
            if (aValInD ^ bValInD) {
              let dAction, searchIn = aValInD ? [...aVal] : [...bVal];
              dAction = defaultSortOrderList.filter((ele) => searchIn.indexOf(ele.split('##')[0]) !== -1);
              dAction = !isNullOrUndefined(dAction) && dAction.length > 1 ? dAction[0].split('##')[1] : '';
              switch (dAction.toUpperCase()) {
                case 'FIXEDTOP':
                  return aValInD ? -1 : 1;
                case 'FIXEDBOTTOM':
                  return aValInD ? 1 : -1;
                case 'NEGLECT':
                  break;
                default:
                  return aValInD ? -1 : 1;
              }
            } else if (!!aValInD && !!bValInD) {
              let aIndex = aVal.filter((e) => defaultSortOrderList.indexOf(e) !== -1);
              let bIndex = bVal.filter((e) => defaultSortOrderList.indexOf(e) !== -1);
              if (!isNullOrUndefined(aIndex[0]) && !isNullOrUndefined(bIndex[0])) {
                return defaultSortOrderList.indexOf(aIndex[0]) - defaultSortOrderList.indexOf(bIndex[0]);
              }
            }
            if (!flag) {
              let sortResult = this.applySortLogic(aVal, bVal, sortOptions);
              if (sortResult !== 0) {
                return sortResult;
              }
            } else {
              // console.log('check for next: ');
            }

          } else {
            return !isNullOrUndefined(aVal) ? 1 : !isNullOrUndefined(bVal) ? -1 : 0;
          }
        })
      } else {
        console.log('Arguments or value might null or undefined');
      }
      return filtered;
    } else {
      return [];
    }
  }

  applySortLogic(a, b, sortOptions) {
    let order = sortOptions.sortType;
    let len = Math.max(a.length, b.length); // probably two are same in most of the cases;
    for (let i = 0; i < len; i++) {
      let val = a[i] instanceof Object ? a[i].value : a[i];
      let bVal = b[i] instanceof Object ? b[i].value : b[i];
      
      if (typeof val == 'boolean') {
        return !!val ? 1 : !!bVal ? -1 : 0;
      }
      if (typeof val == 'number') {
        return order == 'asc' ? val - bVal : bVal - val;
      }
      if (isNaN(val) === false || isNaN(bVal) === false) {

        if (order == 'asc') {
          return (parseFloat(val) < parseFloat(bVal)) ? -1 : (parseFloat(val) > parseFloat(bVal)) ? 1 : 0
          
        } else {
          return (parseFloat(val) > parseFloat(bVal)) ? -1 : (parseFloat(val) < parseFloat(bVal)) ? 1 : 0;
        }
      }
      if (!isNullOrUndefined(val) && !isNullOrUndefined(bVal)) {
        var ax = [], bx = [];
        var aVal = val
        var bVal2 = bVal;
        aVal.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
        bVal2.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
        while (ax.length && bx.length) {
          var an = ax.shift();
          var bn = bx.shift();
          var nn = order == 'asc' ? (an[0] - bn[0]) || an[1].localeCompare(bn[1]) : (bn[0] - an[0]) || bn[1].localeCompare(an[1]);
          if (nn) return nn;
        }
        return (order == 'asc') ? ax.length - bx.length : bx.length - ax.length;
      }
    }
    return 0;
  }

  indianNumberFormat(data, args?: any) {
    return function (data) {
      if (null != data) {
        return Number(data).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
      } else {
        return Number(0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
      }
    };
  }

  capitalize(value) {
    value = (value.replace(/[^\w\s]/gi, '')).replace(/[0-9]/gi, '');
    if (value != undefined && value != null) {
      return value.replace(/\w\S*/g, function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
    }
  }
  sortheader(records: Array<any>, args?: any): any {
    //  console.log("entered",records,args.property,args.direction);
    return records.sort(function (a, b) {

      if (a[args.property] < b[args.property]) {
        return -1 * args.direction;
      }
      else if (a[args.property] > b[args.property]) {
        return 1 * args.direction;
      }
      else {
        return 0;
      }
    });
  };

}
