import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit } from '@angular/core';
import { TranslateServiceOur } from '../../../services/our-translate.service';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, AfterViewInit {
  @Output('onKeyup') onKeyup = new EventEmitter<any>();
  @Output('onChangeselect') onChangeselect = new EventEmitter<any>();
  @Output('onChangeDate') onChangeDate = new EventEmitter<any>();
  @Input('column') column;
  @Input('placeholder') placeholder = 'filter';
  @Input('type') type = 'text';

  constructor(public translate: TranslateServiceOur,
    private trans: TranslateService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.translate.changeLang
      .subscribe(async(currentLang: string) => {
        this.trans.use(currentLang);
      }); 
  }

  onKeyUp(event): void {
    this.onKeyup.emit({column: this.column, value: event.target.value});
  }

  onChangeSelect(event): void {
    this.onChangeselect.emit({column: this.column, value: event});
  }


  onChangeInputDate(event): void {
    this.onChangeDate.emit({column: this.column, value: null});
  }

  onRangeChange(range): void {
    console.log('picker ', range);
    if (range.end) {
      this.onChangeDate.emit({column: this.column, value: range})
    }
  }
}
