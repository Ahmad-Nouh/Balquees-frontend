import { PaintMix } from './../../../models/paintMix';
import { CommonService } from './../../../services/common.service';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Component, OnInit, SimpleChanges, OnChanges, ViewChild, EventEmitter } from '@angular/core';
import { DefaultFilter } from 'ee-ng-smart-table';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-filter-daterange-input',
  templateUrl: './filter-daterange-input.component.html',
  styleUrls: ['./filter-daterange-input.component.scss']
})
export class FilterDaterangeInputComponent extends DefaultFilter implements OnInit, OnChanges {
  inputDateControl = new FormControl();

  constructor(private commonService: CommonService) {
    super();
  }

  ngOnInit() {
  }

  onChangeInput(event) {
    if (event.target.value === '') {
      this.query = '';
      this.setFilter();

      of(undefined)
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.delay),
      )
      .subscribe(() => {
        this.query = '';
        this.setFilter();
      });
    }
  }

  onRangeChange(value): void {
    of(undefined)
    .pipe(
      distinctUntilChanged(),
      debounceTime(this.delay),
    )
    .subscribe(() => {
      console.log('value ', value);
      console.log('cells ', this.commonService.paintMixes);
      console.log('queryyy ', this.query);
      this.query = JSON.stringify(value);
      // this.commonService.paintMixes
      //   .map((paintMix: PaintMix) => paintMix.createdAt)
      //   .forEach(cell => {
      //     this.column.filterFunction(cell, this.query);
      //   });
      if (value.end) {
        this.setFilter();
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      console.log('changes.query ', changes.query.currentValue);
      this.query = changes.query.currentValue;
      // this.inputDateControl.setValue(this.query);
    }
  }

}
