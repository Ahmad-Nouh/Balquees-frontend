import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit {
  @Output('onKeyup') onKeyup = new EventEmitter<any>();
  @Input('column') column;
  @Input('placeholder') placeholder = 'filter';
  @Input('type') type = 'text';

  constructor() { }

  ngOnInit() {
  }

  onKeyUp(event): void {
    this.onKeyup.emit({column: this.column, value: event.target.value});
  }
}
