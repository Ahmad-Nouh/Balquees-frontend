import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-card-details',
  templateUrl: './product-card-details.component.html',
  styleUrls: ['./product-card-details.component.scss']
})
export class ProductCardDetailsComponent implements OnInit {
  @Input('formTitle') formTitle;
  @Output('onBack') onBack = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onClickBack(): void {
    this.onBack.emit(false);
  }
}
