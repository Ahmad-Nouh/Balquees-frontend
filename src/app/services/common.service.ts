import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceOur } from './our-translate.service';
import { PaintMix } from '../models/paintMix';
import { BodyMix } from '../models/bodyMix';
import { EngobMix } from '../models/engobMix';

var moment = require('moment');
var momentRange = require('moment-range');
momentRange.extendMoment(moment);

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  paintMixes: Array<PaintMix> = [];
  bodyMixes: Array<BodyMix> = [];
  engobMixes: Array<EngobMix> = [];

  constructor(private toastrService: NbToastrService,
    private trans: TranslateService,
    private translate: TranslateServiceOur) { }

  async showToast(position: any, status: any, message: string, duration: number) {
    const translatedMessage = await this.translateMessage(message);
    const title = await this.translateMessage(`PAGES.Common.${status}`);
    this.toastrService.show(translatedMessage, title, {
      status: status,
      position: position,
      duration: duration,
      preventDuplicates: true
    });
  }

  async translateMessage(message) {
    this.trans.use(this.translate.currentLanguage);
    return this.trans.get(message).toPromise();
  }

  isNum(text: string): boolean {
    const isnum = /^\d+$/.test(text);
    return isnum;
  }

  parseString(json: string): any {
    let res;
    try {
      const data = JSON.parse(json);
      res = data;
    } catch (error) {
      res = undefined;
    }

    return res;
  }

  convertFromUTCtoLocalDate(value, hours = true): string {
    const utc = moment.utc(value).toDate();
    let local;
    if (hours) {
      local = moment(utc).local().format('YYYY-MM-DD hh:mm a')
    } else {
      local = moment(utc).local().format('YYYY-MM-DD')
    }
    return local;
  }

  sortArrayByDate(dataSource: Array<any>): Array<any> {
    // sort the data by date using moment.js
    return dataSource.sort(function (left, right) {
      return moment.utc(left.createdAt).diff(moment.utc(right.createdAt))
    });
  }

  areEqual(n1, n2): boolean {
    const precision = 0.001;

    if (Math.abs(n1 - n2) <= precision) {
      // equal
      return true;
    }
    else {
      // not equal
      return false;
    }
  }
}
