import { NbCardModule, NbIconModule, NbDialogModule, NbSelectModule, NbInputModule, NbButtonModule, NbAlertModule } from '@nebular/theme';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateServiceOur } from './../../services/our-translate.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { EngobMixesRoutingModule } from './engob-mixes-routing.module';
import { EngobMixesComponent } from './engob-mixes/engob-mixes.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ee-ng-smart-table';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [EngobMixesComponent],
  imports: [
    CommonModule,
    EngobMixesRoutingModule,
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
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ]
})
export class EngobMixesModule {
  constructor(private translate: TranslateServiceOur,
    private trans: TranslateService) {
    
      this.trans.use(this.translate.currentLanguage);
        this.translate.changeLang.subscribe((lang: string) => {
            this.trans.use(lang);
        });
  }
}
