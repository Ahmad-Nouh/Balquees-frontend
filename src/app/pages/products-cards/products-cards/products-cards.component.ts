import { ProductCard } from './../../../models/productCard';

import { Component, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { ProductsCardsService } from '../../../services/products-cards.service';
import { MaterialsService } from '../../../services/materials.service';

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

  constructor(private dialogService: NbDialogService,
              public productsCardsService: ProductsCardsService,
              private materialsService: MaterialsService) { }

  ngOnInit() {
    this.productsCardsService.getProductCards()
      .subscribe((data) => {
        this.productsCardsService.productCards = data;
      });
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
        message: this.AskMessage,
        id: product._id
      }
    });
  }

  onConfirmDelete(id, ref): void {
    console.log('id ', id);
    this.productsCardsService.removeProductCard(id)
      .subscribe((res) => {
        const index = this.productsCardsService.productCards.findIndex((prod: ProductCard) => prod._id == id);
        if (index >= 0) {
          this.productsCardsService.productCards.splice(index, 1);
          this.productsCardsService.onProductCardsChange.next(this.productsCardsService.productCards);
        }
        ref.close();
      })
  }

  onEditProductCard(productCard: ProductCard): void {
    this.productsCardsService.selectedProduct = {...productCard};
    this.extendSelectedProduct();
    console.log('selected ', this.productsCardsService.selectedProduct)
    this.isFlipped = true;
    this.isAdd = false;
  }

  extendSelectedProduct(): void {
    const paintMixComponents = this.productsCardsService.selectedProduct.paintMix.components;
    for(const comp of paintMixComponents) {
      comp.material = this.materialsService.materials.find(mat => mat._id == comp.material);
    }

    const engobMixComponents = this.productsCardsService.selectedProduct.engobMix.components;
    for(const comp of engobMixComponents) {
      comp.material = this.materialsService.materials.find(mat => mat._id == comp.material);
    }

    const bodyMixComponents = this.productsCardsService.selectedProduct.bodyMix.components;
    for(const comp of bodyMixComponents) {
      comp.material = this.materialsService.materials.find(mat => mat._id == comp.material);
    }

  }
}
