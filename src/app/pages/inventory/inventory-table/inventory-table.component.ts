import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceOur } from './../../../services/our-translate.service';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
var moment = require('moment');
var momentRange = require('moment-range');
momentRange.extendMoment(moment);


@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent implements OnInit, AfterViewInit {
  settings = {
    actions: false,
    columns: {
      name: {
        title: 'Name'
      },
      quantity: {
        title: 'Quantity',
        valuePrepareFunction: (value) => {
          return value + ' Kilo';
        },
      },
      consumptionPerDay: {
        title: 'Consumption Per Day',
        valuePrepareFunction: (value) => {
          return value + 'Kilo';
        },
      },
      consumptionPerMonth: {
        title: 'Consumption Per Month',
        valuePrepareFunction: (value) => {
          return value + ' Kilo';
        },
      },
      remainingTime: {
        title: 'Remaining Time',
        valuePrepareFunction: (value) => {
          const totalDays = Math.floor(value);
          const months = Math.floor(totalDays / 30);
          const days = Math.floor(totalDays % 30);
          return `${months} Months and ${days} Days`;
        },
      }
    },
    // actions: {
    //   columnTitle: ''
    // },
    pager: {
      display : true,
      perPage: 8
    },
    mode: 'inline',
    
  };

  @Input('source') source: Array<any> = [];

  constructor(private translate: TranslateServiceOur,
    private trans: TranslateService) { }

  async ngOnInit() {
    this.trans.use(this.translate.currentLanguage);
    await this.initSettingTranslation();
  }

  ngAfterViewInit(): void {
    this.translate.changeLang
      .subscribe(async(currentLang: string) => {
        this.trans.use(currentLang);
        moment.locale(this.translate.currentLanguage);
        await this.initSettingTranslation();
      });
  }

  async initSettingTranslation() {
    moment.locale(this.translate.currentLanguage);

    this.settings = {
      actions: false,
      columns: {
        name: {
          title: await this.trans.get('PAGES.Inventory.name').toPromise()
        },
        quantity: {
          title: await this.trans.get('PAGES.Inventory.quantity').toPromise(),
          valuePrepareFunction: (value) => {
            return value + ' Kilo';
          },
        },
        consumptionPerDay: {
          title: await this.trans.get('PAGES.Inventory.consumptionPerDay').toPromise(),
          valuePrepareFunction: (value) => {
            return value + 'Kilo';
          },
        },
        consumptionPerMonth: {
          title: await this.trans.get('PAGES.Inventory.consumptionPerMonth').toPromise(),
          valuePrepareFunction: (value) => {
            return value + ' Kilo';
          },
        },
        remainingTime: {
          title: await this.trans.get('PAGES.Inventory.remainingTime').toPromise(),
          valuePrepareFunction: (value) => {
            const totalDays = Math.floor(value);
            const months = Math.floor(totalDays / 30);
            const days = Math.floor(totalDays % 30);
            
            return `${months} Months and ${days} Days`;
          },
        }
      },
      // actions: {
      //   columnTitle: ''
      // },
      pager: {
        display : true,
        perPage: 8
      },
      mode: 'inline',
      
    };
  }

}
