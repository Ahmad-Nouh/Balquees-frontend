import { Component, OnInit } from '@angular/core';
import { TranslateServiceOur } from '../../../services/our-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../services/common.service';
import { WarehouseService } from '../../../services/warehouse.service';

var moment = require('moment');
var momentRange = require('moment-range');
momentRange.extendMoment(moment);


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  dropdownOptions = [{name: 'ahmad'}, {name: 'noun'}, {name: 'emad'}];

  config = {
    displayKey:"name", //if objects array passed which key to be displayed defaults to description
    search:true, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'Select mix', // text to be displayed when no item is selected defaults to Select,
    customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: this.dropdownOptions.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder:'Search', // label thats displayed in search input,
    searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  };

  selectedMatWallsMix: any;
  selectedMatFloorsMix: any;
  selectedTranspartentWallsMix: any;
  selectedTranspartentFloorsMix: any;

  paintOptions = {
    matWalls: {
      title: 'Mat Walls',
      checked: false
    },
    matFloors: {
      title: 'Mat Floors',
      checked: false
    },
    transparentWalls: {
      title: 'Transparent Walls',
      checked: false
    },
    transparentFloors: {
      title: 'Transparent Floors',
      checked: false
    }
  };

  constructor(public translate: TranslateServiceOur,
    private trans: TranslateService,
    public warehouseService: WarehouseService,
    private commonService: CommonService) { }

  async ngOnInit() {
    // translate tables
    this.trans.use(this.translate.currentLanguage);
    await this.initSettingTranslation();
  }

  async initSettingTranslation() {
    moment.locale(this.translate.currentLanguage);
  }

  onChangeToggle(key: string): void {
    this.paintOptions[key].checked = !this.paintOptions[key].checked;
  }

  onChange(value): void {
    console.log('value ', value);
  }
}
