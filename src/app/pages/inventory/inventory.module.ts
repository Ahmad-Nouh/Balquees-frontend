import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { NbCardModule, NbIconModule, NbDialogModule, NbSelectModule, NbInputModule, NbButtonModule, NbAlertModule, NbTabsetModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ee-ng-smart-table';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateServiceOur } from '../../services/our-translate.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { InventoryTableComponent } from './inventory-table/inventory-table.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [InventoryComponent, InventoryTableComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    NbCardModule,
    NbIconModule,
    NbDialogModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbAlertModule,
    NbTabsetModule,
    ThemeModule,
    Ng2SmartTableModule,
    SelectDropDownModule,
    MatSlideToggleModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ]
})
export class InventoryModule {
  constructor(private translate: TranslateServiceOur,
    private trans: TranslateService) {
    
      this.trans.use(this.translate.currentLanguage);
        this.translate.changeLang.subscribe((lang: string) => {
            this.trans.use(lang);
        });
  }
}
