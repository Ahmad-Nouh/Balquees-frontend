
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-products-cards',
  templateUrl: './products-cards.component.html',
  styleUrls: ['./products-cards.component.scss']
})
export class ProductsCardsComponent implements OnInit {
  isFlipped = false;
  isAdd = true;
  data = [];

  formTitle = 'PAGES.ProductsCards.productsCards';
  AskMessage = 'PAGES.Common.askDeleteMessage';

  constructor(private dialogService: NbDialogService) { }

  ngOnInit() {
  }

  onClickBack(result: boolean, isAdd): void {
    this.isFlipped = result;
  }

  onCreateProductCard(event): void {
    this.isFlipped = true;
    this.isAdd = true;
  }

  onDeleteProductCard(dialog: TemplateRef<any>, product: any): void {
    console.log('delete ', product);
    this.dialogService.open(dialog, {
      context:  {
        info: product.name,
        message: this.AskMessage
      }
    });
  }

  onEditProductCard(productCard): void {
    console.log('edit ', productCard);
    this.isFlipped = true;
    this.isAdd = false;
  }
}
