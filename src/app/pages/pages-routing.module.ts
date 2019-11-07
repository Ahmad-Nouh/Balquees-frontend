import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module')
      .then(m => m.DashboardModule),
    },
    {
      path: 'materials',
      loadChildren: () => import('./materials/materials.module')
      .then(m => m.MaterialsModule),
    },
    {
      path: 'productsCards',
      loadChildren: () => import('./products-cards/products-cards.module')
      .then(m => m.ProductsCardsModule),
    },
    {
      path: 'paintMixes',
      loadChildren: () => import('./paint-mixes/paint-mixes.module')
      .then(m => m.PaintMixesModule),
    },
    {
      path: 'bodyMixes',
      loadChildren: () => import('./body-mixes/body-mixes.module')
      .then(m => m.BodyMixesModule),
    },
    {
      path: 'engobMixes',
      loadChildren: () => import('./engob-mixes/engob-mixes.module')
      .then(m => m.EngobMixesModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
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
