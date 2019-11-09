import { MaterialsService } from './../../../services/materials.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { DefaultEditor } from 'ee-ng-smart-table';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent extends DefaultEditor implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('material', { static: false }) material: ElementRef;
  @ViewChild('htmlValue', { static: false }) htmlValue: ElementRef;

  selectedItem;
  materials = [];

  constructor(public materialService: MaterialsService,
    private commonService: CommonService) {
    super();
  }

  ngOnInit(): void {
    this.materials = [undefined].concat(this.materialService.materials.map(item => JSON.stringify(item)));
  }

  ngAfterViewInit(): void {
    this.material.nativeElement.value = this.getValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes ', changes);
  }

  updateValue(event) {
    console.log('event ', event);
    // const value = this.material.nativeElement.value;
    this.selectedItem = event.target.value;
    console.log('selectedItem ', this.selectedItem);
    this.cell.newValue = this.commonService.parseString(this.selectedItem);
  }

  getValue(): string {
    return this.selectedItem ? JSON.stringify(this.selectedItem) : JSON.stringify(this.cell.newValue);
  }

  getTitle(item: string): string {

    const data = this.commonService.parseString(item);

    return data ? data.name : '';
  }

}
