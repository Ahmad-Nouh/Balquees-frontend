import { style } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <!-- <span class="created-by">Created with ♥ by <b><a href="https://akveo.com" target="_blank">Akveo</a></b> 2019</span> -->
    <div class="socials text-right w-100">
      <a href="https://www.facebook.com/balkisceramic/" target="_blank">
        <nb-icon style="font-size: 1.8rem" icon="facebook-outline"></nb-icon>
      </a>
      <a href="www.balkisceramic.com" target="_blank">
        <nb-icon style="font-size: 1.8rem" icon="globe-outline"></nb-icon>
      </a>
    </div>
  `,
})
export class FooterComponent {
}
