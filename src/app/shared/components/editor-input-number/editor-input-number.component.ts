import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DefaultEditor } from 'ee-ng-smart-table';

@Component({
  selector: 'app-editor-input-number',
  templateUrl: './editor-input-number.component.html',
  styleUrls: ['./editor-input-number.component.scss']
})
export class EditorInputNumberComponent extends DefaultEditor implements AfterViewInit {

  @ViewChild('name', { static: false }) name: ElementRef;
  @ViewChild('htmlValue', { static: false }) htmlValue: ElementRef;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    if (this.cell.newValue !== '') {
      this.name.nativeElement.value = this.getValue();
    }
  }

  updateValue() {
    const name = this.name.nativeElement.value;
    this.cell.newValue = `${name}`;
  }

  getValue(): string {
    return this.htmlValue.nativeElement.innerText;
  }

}
