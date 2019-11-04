import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FilterInputComponent } from '../../../../shared/components/filter-input/filter-input.component';
import { EditorInputNumberComponent } from '../../../../shared/components/editor-input-number/editor-input-number.component';
import { TranslateServiceOur } from '../../../../services/our-translate.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-body-mix',
  templateUrl: './body-mix.component.html',
  styleUrls: ['./body-mix.component.scss']
})
export class BodyMixComponent implements OnInit, AfterViewInit {
  settings = {
    columns: {
      name: {
        title: 'Name',
        type:'text'
      },
      quantity: {
        title: 'Quantity',
        filter: {
          type: 'custom',
          component: FilterInputComponent
        },
        editor: {
          type: 'custom',
          component: EditorInputNumberComponent
        },
        valuePrepareFunction: (value) => {
          return value + '%';
        },
      }
    },
    pager: {
      display : true,
      perPage: 4
    },
    mode: 'inline',
    hideSubHeader: true
    // hideHeader: true
    
  };

  constructor(private translate: TranslateServiceOur,
    private trans: TranslateService) { }

  async ngOnInit() {
    // init table translation
    await this.initSettingTranslation();
  }

  ngAfterViewInit(): void {
    this.translate.changeLang
      .subscribe(async(currentLang: string) => {
        this.trans.use(currentLang);
        await this.initSettingTranslation();
      });
  }

  async initSettingTranslation() {
    this.trans.use(this.translate.currentLanguage);
    this.settings = {
      columns: {
        name: {
          title: await this.trans.get('PAGES.ProductsCardsDetails.name').toPromise(),
          type:'text'
        },
        quantity: {
          title: await this.trans.get('PAGES.ProductsCardsDetails.quantity').toPromise(),
          filter: {
            type: 'custom',
            component: FilterInputComponent
          },
          editor: {
            type: 'custom',
            component: EditorInputNumberComponent
          },
          valuePrepareFunction: (value) => {
            return value + '%';
          },
        }
      },
      pager: {
        display : true,
        perPage: 4
      },
      mode: 'inline',
      hideSubHeader: true
      // hideHeader: true
    };
  }
}
