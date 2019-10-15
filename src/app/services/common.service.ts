import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceOur } from './our-translate.service';
import { PaintMix } from '../models/paintMix';
import { BodyMix } from '../models/bodyMix';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  paintMixes: Array<PaintMix> = [];
  bodyMixes: Array<BodyMix> = [];

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
}
