import { ProductsCardsService } from './../../services/products-cards.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ProductsCardsRoutingModule } from './products-cards-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsCardsComponent } from './products-cards/products-cards.component';
import { NbCardModule, NbIconModule, NbDialogModule, NbSelectModule, NbInputModule, NbButtonModule, NbAlertModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ee-ng-smart-table';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateServiceOur } from '../../services/our-translate.service';
import { MatTableModule } from '@angular/material/table';
import { ProductsCardsTableComponent } from './products-cards-table/products-cards-table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}


@NgModule({
  declarations: [ProductsCardsComponent, ProductsCardsTableComponent],
  imports: [
    CommonModule,
    ProductsCardsRoutingModule,
    NbCardModule,
    NbIconModule,
    NbDialogModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbAlertModule,
    ThemeModule,
    Ng2SmartTableModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatFormFieldModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [
    ProductsCardsService,
    TranslateService
  ]
})
export class ProductsCardsModule {
  constructor(private translate: TranslateServiceOur,
    private trans: TranslateService) {
    
      this.trans.use(this.translate.currentLanguage);
        this.translate.changeLang.subscribe((lang: string) => {
            this.trans.use(lang);
        });
  }
}
