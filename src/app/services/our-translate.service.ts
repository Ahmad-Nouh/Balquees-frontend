import { EventEmitter, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateServiceOur {
  public currentLanguage = 'en';
  changeLang: EventEmitter<string> = new EventEmitter<string>();
  constructor(private trans: TranslateService) {
    this.changeLang.subscribe(
        (lang: string) => {
            this.trans.use(lang);
            this.currentLanguage = lang;
        }
    );
  }
}
