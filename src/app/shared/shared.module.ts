import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { NbButtonModule, NbIconModule, NbDialogModule, NbCardModule, NbDialogService, NbListModule, NbInputModule, NbDatepickerModule } from '@nebular/theme';
import { TranslateServiceOur } from '../services/our-translate.service';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterInputComponent } from './components/filter-input/filter-input.component';
import { EditorInputNumberComponent } from './components/editor-input-number/editor-input-number.component';
import { FilterDaterangeInputComponent } from './components/filter-daterange-input/filter-daterange-input.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    CustomButtonComponent,
    FilterInputComponent,
    EditorInputNumberComponent,
    FilterDaterangeInputComponent
  ],
  imports: [
    CommonModule,
    NbButtonModule,
    NbIconModule,
    NbDialogModule,
    NbCardModule,
    NbListModule,
    NbInputModule,
    NbDatepickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    WebviewDirective,
    CustomButtonComponent,
    FilterInputComponent,
    EditorInputNumberComponent,
    FilterDaterangeInputComponent
  ],
  providers: [NbDialogService],
  entryComponents: [
    CustomButtonComponent,
    FilterInputComponent,
    EditorInputNumberComponent,
    FilterDaterangeInputComponent
  ]
})
export class SharedModule {
  constructor(private translate: TranslateServiceOur,
    private trans: TranslateService) {
    
      this.trans.use(this.translate.currentLanguage);
        this.translate.changeLang.subscribe((lang: string) => {
            this.trans.use(lang);
        });
  }
}
