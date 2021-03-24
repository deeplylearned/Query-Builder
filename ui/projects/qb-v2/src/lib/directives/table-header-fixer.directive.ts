import { Directive, HostListener, OnInit, ElementRef, Input } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Directive({
  selector: '[tableHeaderFixer]'
})

export class TableHeaderFixerDirective implements OnInit {
  constructor() { }

  @Input('tableHeaderFixer') options: any;
  headerElement: HTMLElement;
  bodyElement:any;
  elements: HTMLElement[];

  ngOnInit() {  }

  ngAfterViewInit() {
    this.process();
  }

  process() {
    if(isNullOrUndefined(this.options)) {
      return
    }
    
    this.headerElement = document.querySelector('.fixed');
    this.bodyElement = document.querySelector('.bodyItems');

    let noOfHeaders = this.headerElement.children;
    let headers = Array.from(noOfHeaders);
    let { headerFix, colFix, noOfCol } = this.options.apply;
    let limit = this.bodyElement.children.length;

    //Add user-defined classes if header fix and column fix are set to true.
    if(headerFix) {
      headers.forEach(header => {
        let eachHeaderChild = Array.from(header.children);
        eachHeaderChild.forEach((headerChild,index) => {
           headerChild.classList.add('fixed-col');
        })
      });
    }

    if(colFix) {
      for (let i = 0; i < limit; i++) {
        for (let j = 0; j < noOfCol; j++) {
          let eachCell = this.bodyElement.children[i].children[j];
          if(isNullOrUndefined(eachCell)){
            break;
          }
          eachCell['classList'].add('fixed-col');
        }
      }
    }
  }

  headerFixer($event) {
    let limit = this.bodyElement.children.length;
    let noOfHeaders = this.headerElement.children;
    let headers = Array.from(noOfHeaders);
    let { headerFix, colFix, noOfCol } = this.options.apply;

    //Header Fixer
    if (headerFix) {
      headers.forEach(header => {
        let eachHeaderChild = Array.from(header.children);
        eachHeaderChild.forEach((headerChild,index) => {
            headerChild['style'].position = 'relative';
            headerChild['style'].top = $event.target.scrollTop + "px";
            headerChild['style'].zIndex = "1";
        })
      })
    }

    //Column Fixer
    if (colFix) {
      for (let i = 0; i < limit; i++) {
        for (let j = 0; j < noOfCol; j++) {
          let eachCell = this.bodyElement.children[i].children[j]['style'];
          eachCell.position = 'relative';
          eachCell.left = $event.target.scrollLeft + "px";
        }
      }
    
      //Fix the headers for the specified columns
      //For now ignoring sub-columns
      let headerChild = Array.from(headers[0].children);
      for (let j = 0; j < noOfCol; j++) {
        let header = <HTMLElement>headerChild[j];
        header['style'].position = 'relative';
        header['style'].left = $event.target.scrollLeft + "px";
        header['style'].zIndex = "2";
      }
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll($event) {
    this.headerFixer($event)
  }
}

