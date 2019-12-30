import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FilterInputComponent } from '../../../../shared/components/filter-input/filter-input.component';
import { EditorInputNumberComponent } from '../../../../shared/components/editor-input-number/editor-input-number.component';
import { TranslateServiceOur } from '../../../../services/our-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductsCardsService } from '../../../../services/products-cards.service';

@Component({
  selector: 'app-engob-mix',
  templateUrl: './engob-mix.component.html',
  styleUrls: ['./engob-mix.component.scss']
})
export class EngobMixComponent implements OnInit, AfterViewInit {
  settings = {
    columns: {
      material: {
        title: 'Material',
        type:'text',
        valuePrepareFunction: (value) => value.name
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
    private trans: TranslateService,
    public productsCardsService: ProductsCardsService) { }

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
        material: {
          title: await this.trans.get('PAGES.ProductsCardsDetails.material').toPromise(),
          type:'text',
          valuePrepareFunction: (value) => value.name,
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
