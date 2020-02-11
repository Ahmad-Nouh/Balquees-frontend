import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'materials',
      // loadChildren: 'app/pages/materials/materials.module#MaterialsModule'
      loadChildren: () => import('./materials/materials.module')
      .then(m => m.MaterialsModule),
    },
    {
      path: 'productsCards',
      // loadChildren: 'app/pages/products-cards/products-cards.module#ProductsCardsModule'
      loadChildren: () => import('./products-cards/products-cards.module')
      .then(m => m.ProductsCardsModule),
    },
    {
      path: 'paintMixes',
      // loadChildren: 'app/pages/paint-mixes/paint-mixes.module#PaintMixesModule'
      loadChildren: () => import('./paint-mixes/paint-mixes.module')
      .then(m => m.PaintMixesModule),
    },
    {
      path: 'bodyMixes',
      // loadChildren: 'app/pages/body-mixes/body-mixes.module#BodyMixesModule'
      loadChildren: () => import('./body-mixes/body-mixes.module')
      .then(m => m.BodyMixesModule),
    },
    {
      path: 'engobMixes',
      // loadChildren: 'app/pages/engob-mixes/engob-mixes.module#EngobMixesModule'
      loadChildren: () => import('./engob-mixes/engob-mixes.module')
      .then(m => m.EngobMixesModule),
    },
    {
      path: 'inventory',
      // loadChildren: 'app/pages/inventory/inventory.module#InventoryModule'
      loadChildren: () => import('./inventory/inventory.module')
      .then(m => m.InventoryModule),
    },
    {
      path: '',
      redirectTo: 'productsCards',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
