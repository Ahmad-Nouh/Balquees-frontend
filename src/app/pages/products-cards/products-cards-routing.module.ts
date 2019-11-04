import { ProductCardDetailsComponent } from './product-card-details/product-card-details.component';
import { ProductsCardsComponent } from './products-cards/products-cards.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


const routes: Routes = [
    {
        path: '',
        component: ProductsCardsComponent,
        children: [
          {
            path: ':id',
            component: ProductCardDetailsComponent
          }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsCardsRoutingModule {
}
