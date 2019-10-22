import { Component, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-products-cards',
  templateUrl: './products-cards.component.html',
  styleUrls: ['./products-cards.component.scss']
})
export class ProductsCardsComponent implements OnInit {
  isFlipped = false;
  data = [];

  formTitle = 'PAGES.ProductsCards.productsCards';
  AskMessage = 'PAGES.Common.askDeleteMessage';

  constructor(private dialogService: NbDialogService) { }

  ngOnInit() {
  }

  onClickBack(): void {
    this.isFlipped = false;
  }

  onSubmit(): void {
    console.log('submited');
  }

  onCreateProductCard(): void {
    console.log('create');
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
  }
}
