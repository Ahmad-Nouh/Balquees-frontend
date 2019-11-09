import { Component, AfterViewInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { DefaultEditor } from 'ee-ng-smart-table';

@Component({
  selector: 'app-editor-input-number',
  templateUrl: './editor-input-number.component.html',
  styleUrls: ['./editor-input-number.component.scss']
})
export class EditorInputNumberComponent extends DefaultEditor implements AfterViewInit, OnChanges {

  @ViewChild('name', { static: false }) name: ElementRef;
  @ViewChild('htmlValue', { static: false }) htmlValue: ElementRef;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    console.log('this.cell ', this.cell);
    if (this.cell.newValue !== '') {
      this.name.nativeElement.value = this.getValue();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes ', changes);
  }

  updateValue() {
    const name = this.name.nativeElement.value;
    this.cell.newValue = +name;
  }

  getValue(): string {
    return this.htmlValue ? this.htmlValue.nativeElement.innerText : this.cell.newValue;
  }

}
