import { Component, OnInit } from '@angular/core';
import { ProductsCardsService } from '../../../../services/products-cards.service';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.scss']
})
export class MainInfoComponent implements OnInit {
  backendUrl = environment.backend;
  constructor(public productsCardsService: ProductsCardsService) { }

  ngOnInit() {
  }

}
