import { Component, OnInit, ViewChild, ElementRef, SimpleChanges, AfterViewInit, OnChanges } from '@angular/core';
import { MaterialsService } from '../../../services/materials.service';
import { CommonService } from '../../../services/common.service';
import { DefaultEditor } from 'ee-ng-smart-table';

@Component({
  selector: 'app-select1',
  templateUrl: './select1.component.html',
  styleUrls: ['./select1.component.scss']
})
export class Select1Component extends DefaultEditor implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('material', { static: false }) material: ElementRef;
  @ViewChild('htmlValue', { static: false }) htmlValue: ElementRef;

  selectedItem;
  materials = [];

  constructor(public materialService: MaterialsService,
    private commonService: CommonService) {
    super();
  }

  ngOnInit(): void {
    this.materials = [undefined]
    .concat(this.materialService.getClayMaterials()
      .map(item => JSON.stringify(item)));
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
