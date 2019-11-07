import { MaterialsModule } from './materials/materials.module';
import { ProductsCardsModule } from './products-cards/products-cards.module';
import { BodyMixesModule } from './body-mixes/body-mixes.module';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NbMenuModule, NbLayoutModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PaintMixesModule } from './paint-mixes/paint-mixes.module';
import { SharedModule } from '../shared/shared.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateServiceOur } from '../services/our-translate.service';
import { EngobMixesModule } from './engob-mixes/engob-mixes.module';
import { MaterialsService } from '../services/materials.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    PaintMixesModule,
    BodyMixesModule,
    EngobMixesModule,
    ProductsCardsModule,
    MaterialsModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    PagesComponent,
  ],
  providers: [
    MaterialsService
  ]
})
export class PagesModule {
  constructor(private translate: TranslateServiceOur,
    private trans: TranslateService) {
    
      this.trans.use(this.translate.currentLanguage);
        this.translate.changeLang.subscribe((lang: string) => {
            this.trans.use(lang);
        });
  }
}
