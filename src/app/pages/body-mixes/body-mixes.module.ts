import { TranslateServiceOur } from './../../services/our-translate.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodyMixesRoutingModule } from './body-mixes-routing.module';
import { BodyMixesComponent } from './body-mixes/body-mixes.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { NbCardModule, NbIconModule, NbDialogModule, NbSelectModule, NbInputModule, NbButtonModule, NbAlertModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ee-ng-smart-table';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [BodyMixesComponent],
  imports: [
    CommonModule,
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
    BodyMixesRoutingModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
  providers: [
    TranslateService
  ]
})
export class BodyMixesModule {
  constructor(private translate: TranslateServiceOur,
    private trans: TranslateService) {
    
      this.trans.use(this.translate.currentLanguage);
        this.translate.changeLang.subscribe((lang: string) => {
            this.trans.use(lang);
        });
  }
}
