import { Component, OnInit, AfterViewInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { TranslateServiceOur } from '../services/our-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
        <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit , AfterViewInit{

  menu = MENU_ITEMS;

  constructor(private translate: TranslateServiceOur,
    private trans: TranslateService) {}

  ngOnInit(): void {
    this.trans.use(this.translate.currentLanguage);
    this.translateMenu();
    console.log('menu ', this.menu);
  }

  ngAfterViewInit(): void {
    this.translate.changeLang
    .subscribe((currentLang: string) => {
      this.trans.use(currentLang);
      this.translateMenu();
      console.log('menu1 ', this.menu);
    });
  }

  translateWord(key: string): Promise<any> {
    return this.trans.get(key).toPromise();
  }

  translateMenu():void {
    this.menu = [];
    MENU_ITEMS.slice()
      .forEach(async(item: NbMenuItem) => {
        this.menu.push({
          ...item,
          title: await this.translateWord(item.title)
        });
      });
  }
}
