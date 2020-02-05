import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateServiceOur } from '../../../services/our-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../services/common.service';
import { WarehouseService } from '../../../services/warehouse.service';
import { BodyMixesService } from '../../../services/body-mixes.service';
import { PaintMixesService } from '../../../services/paint-mixes.service';
import { EngobMixesService } from '../../../services/engob-mixes.service';
import { PaintMix } from '../../../models/paintMix';
import { EngobMix } from '../../../models/engobMix';
import { BodyMix } from '../../../models/bodyMix';
import { MixType } from '../../../models/enums/mixType';
import { Glize } from '../../../models/enums/glize';
import { setInterval } from 'timers';
import { InventoryService } from '../../../services/inventory.service';

var moment = require('moment');
var momentRange = require('moment-range');
momentRange.extendMoment(moment);


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, AfterViewInit {

  paintConfig = {};
  engobConfig = {};
  bodyConfig = {};

  paintMixes: Array<PaintMix> = [];
  engobMixes: Array<EngobMix> = [];
  bodyMixes: Array<BodyMix> = [];

  matWallsPaintMixes: Array<PaintMix> = [];
  matFloorsPaintMixes: Array<PaintMix> = [];
  transparentWallsPaintMixes: Array<PaintMix> = [];
  transparentFloorsPaintMixes: Array<PaintMix> = [];

  matWallsEngobMixes: Array<EngobMix> = [];
  matFloorsEngobMixes: Array<EngobMix> = [];
  transparentWallsEngobMixes: Array<EngobMix> = [];
  transparentFloorsEngobMixes: Array<EngobMix> = [];

  wallsBodyMixes: Array<BodyMix> = [];
  floorsBodyMixes: Array<BodyMix> = [];

  paintOptions = {
    matWalls: {
      title: 'PAGES.Inventory.matWalls',
      selectedPaintMix: null,
      selectedEngobMix: null,
      meterPaintWeight: 0,
      meterEngobWeight: 0,
      meterNumber: 0,
      checked: false
    },
    matFloors: {
      title: 'PAGES.Inventory.matFloors',
      selectedPaintMix: null,
      selectedEngobMix: null,
      meterPaintWeight: 0,
      meterEngobWeight: 0,
      meterNumber: 0,
      checked: false
    },
    transparentWalls: {
      title: 'PAGES.Inventory.transparentWalls',
      selectedPaintMix: null,
      selectedEngobMix: null,
      meterPaintWeight: 0,
      meterEngobWeight: 0,
      meterNumber: 0,
      checked: false
    },
    transparentFloors: {
      title: 'PAGES.Inventory.transparentFloors',
      selectedPaintMix: null,
      selectedEngobMix: null,
      meterPaintWeight: 0,
      meterEngobWeight: 0,
      meterNumber: 0,
      checked: false
    }
  };

  bodyOptions = {
    walls: {
      title: 'PAGES.Inventory.walls',
      selectedBodyMix: null,
      meterWeight: 0,
      meterNumber: 0,
      checked: false
    },
    floors: {
      title: 'PAGES.Inventory.floors',
      selectedBodyMix: null,
      meterWeight: 0,
      meterNumber: 0,
      checked: false
    }
  }

  // matWallsForm: FormGroup;
  // matFloorsForm: FormGroup;
  // transparentWallsForm: FormGroup;
  // transparentFloorsForm: FormGroup;

  // wallsForm: FormGroup;
  // floorsForm: FormGroup;

  isFlipped = false;

  sourceData: Array<any>= [];

  constructor(public translate: TranslateServiceOur,
    private trans: TranslateService,
    public warehouseService: WarehouseService,
    private bodyMixesService: BodyMixesService,
    private paintMixesService: PaintMixesService,
    private engobMixesService: EngobMixesService,
    private inventoryService: InventoryService,
    private commonService: CommonService) { }

  async ngOnInit() {
    // get all mixes arrays
    this.paintMixes = await this.paintMixesService.getPaintMixes();
    this.engobMixes = await this.engobMixesService.getEngobMixes();
    this.bodyMixes = await this.bodyMixesService.getBodyMixes();
    // filter Mixes
    this.filterMixes();
    // set translation language
    this.trans.use(this.translate.currentLanguage);
    // initialize translation
    await this.initSettingTranslation();
    // init select ui
    await this.initSelect();
  }

  ngAfterViewInit(): void {
    this.translate.changeLang
      .subscribe(async(currentLang: string) => {
        this.trans.use(currentLang);
        moment.locale(this.translate.currentLanguage);
        // init select ui
        await this.initSelect();
      });
  }

  async initSelect() {
    this.paintConfig = {
      displayKey:"code", //if objects array passed which key to be displayed defaults to description
      search:true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: await this.trans.get('PAGES.Inventory.selectPaintMix').toPromise(), // text to be displayed when no item is selected defaults to Select,
      customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.paintMixes.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: await this.trans.get('PAGES.Inventory.more').toPromise(), // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: await this.trans.get('PAGES.Inventory.noResultsFound').toPromise(), // text to be displayed when no items are found while searching
      searchPlaceholder:await this.trans.get('PAGES.Inventory.search').toPromise(), // label thats displayed in search input,
      searchOnKey: 'code' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };

    this.engobConfig = {
      displayKey:"code",
      search:true,
      height: 'auto',
      placeholder: await this.trans.get('PAGES.Inventory.selectEngobMix').toPromise(),
      customComparator: ()=>{},
      limitTo: this.engobMixes.length,
      moreText: await this.trans.get('PAGES.Inventory.more').toPromise(),
      noResultsFound: await this.trans.get('PAGES.Inventory.noResultsFound').toPromise(),
      searchPlaceholder:await this.trans.get('PAGES.Inventory.search').toPromise(),
      searchOnKey: 'code'
    };

    this.bodyConfig = {
      displayKey:"code",
      search:true,
      height: 'auto',
      placeholder: await this.trans.get('PAGES.Inventory.selectBodyMix').toPromise(),
      customComparator: () => {},
      limitTo: this.bodyMixes.length,
      moreText: await this.trans.get('PAGES.Inventory.more').toPromise(),
      noResultsFound: await this.trans.get('PAGES.Inventory.noResultsFound').toPromise(),
      searchPlaceholder: await this.trans.get('PAGES.Inventory.search').toPromise(),
      searchOnKey: 'code'
    };
  }

  async initSettingTranslation() {
    moment.locale(this.translate.currentLanguage); 
  }

  onChangeToggle(key: string, isPaint: boolean): void {
    if (isPaint) {
      this.paintOptions[key].checked = !this.paintOptions[key].checked;
    } else {
      this.bodyOptions[key].checked = !this.bodyOptions[key].checked;
    }
  }

  onChange(value): void {
    console.log('value ', value);
  }

  filterMixes(): void {
    // filter paint Mixes
    this.matWallsPaintMixes = this.paintMixes.filter((item: PaintMix) => item.type === MixType.WALLS && item.glize === Glize.MAT);
    this.matFloorsPaintMixes = this.paintMixes.filter((item: PaintMix) => item.type === MixType.FLOORS && item.glize === Glize.MAT);
    this.transparentWallsPaintMixes = this.paintMixes.filter((item: PaintMix) => item.type === MixType.WALLS && item.glize === Glize.TRANSPARENT);
    this.transparentFloorsPaintMixes = this.paintMixes.filter((item: PaintMix) => item.type === MixType.FLOORS && item.glize === Glize.TRANSPARENT);

    // filter engob Mixes
    this.matWallsEngobMixes = this.engobMixes.filter((item: EngobMix) => item.type === MixType.WALLS && item.glize === Glize.MAT);
    this.matFloorsEngobMixes = this.engobMixes.filter((item: EngobMix) => item.type === MixType.FLOORS && item.glize === Glize.MAT);
    this.transparentWallsEngobMixes = this.engobMixes.filter((item: EngobMix) => item.type === MixType.WALLS && item.glize === Glize.TRANSPARENT);
    this.transparentFloorsEngobMixes = this.engobMixes.filter((item: EngobMix) => item.type === MixType.FLOORS && item.glize === Glize.TRANSPARENT);

    // filter body Mixes
    this.wallsBodyMixes = this.bodyMixes.filter((item: BodyMix) => item.type === MixType.WALLS);
    this.floorsBodyMixes = this.bodyMixes.filter((item: BodyMix) => item.type === MixType.FLOORS);
  }


  calculatePaintInventory(): void {
    console.log('paintOptions ', this.paintOptions);
    this.sourceData = this.inventoryService.startInventory(this.paintOptions, false);
    this.isFlipped = true;
  }

  calculateClayInventory(): void {
    console.log('bodyOptions ', this.bodyOptions);
    this.sourceData = this.inventoryService.startInventory(this.bodyOptions, true);
    this.isFlipped = true;
  }

  onClickBack(): void {
    this.isFlipped = false;
  }

}
