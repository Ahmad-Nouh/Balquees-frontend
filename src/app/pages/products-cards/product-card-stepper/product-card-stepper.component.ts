import { CommonService } from './../../../services/common.service';
import { ProductsCardsService } from './../../../services/products-cards.service';
import { ProductType } from './../../../models/enums/productType';
import { ProductCard } from './../../../models/productCard';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaintMix } from '../../../models/paintMix';
import { EngobMix } from '../../../models/engobMix';
import { BodyMix } from '../../../models/bodyMix';
import { NbStepperComponent } from '@nebular/theme';
import { TranslateServiceOur } from '../../../services/our-translate.service';
import { MixType } from '../../../models/enums/mixType';
import { Glize } from '../../../models/enums/glize';
import { BodyMixesService } from '../../../services/body-mixes.service';
import { PaintMixesService } from '../../../services/paint-mixes.service';
import { EngobMixesService } from '../../../services/engob-mixes.service';
var moment = require('moment');
var momentRange = require('moment-range');
momentRange.extendMoment(moment);

@Component({
  selector: 'app-product-card-stepper',
  templateUrl: './product-card-stepper.component.html',
  styleUrls: ['./product-card-stepper.component.scss']
})
export class ProductCardStepperComponent implements OnInit, AfterViewInit {
  @Input('formTitle') formTitle;
  @Output('onBack') onBack = new EventEmitter<boolean>();
  @ViewChild('imagePreview', { static: true }) imagePreview;

  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  fourthForm: FormGroup;
  fifthForm: FormGroup;
  sixthForm: FormGroup;


  selectedPaintMix: PaintMix;
  selectedEngobMix: EngobMix;
  selectedBodyMix: BodyMix;
  selectedPaintType: any;
  selectedEngobType: any;
  selectedBodyType: any;
  selectedType: any;

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

  productCard: ProductCard;

  productCardTypes = [];

  paintOptions = [];
  engobOptions = [];
  bodyOptions = [];

  imageURL: string;
  imageFile: any;

  constructor(private fb: FormBuilder,
    public translate: TranslateServiceOur,
    private trans: TranslateService,
    private commonService: CommonService,
    private bodyMixesService: BodyMixesService,
    private paintMixesService: PaintMixesService,
    private engobMixesService: EngobMixesService,
    private productsCardsService: ProductsCardsService) { }

  async ngOnInit() {
    // initialize forms with required validation
    this.initForms();
    // initialize translation 
    await this.initSettingTranslation();
    // init select ui
    await this.initSelect();
    // init product cards types
    this.productCardTypes = [
      ProductType.matWalls,
      ProductType.matFloors,
      ProductType.transparentWalls,
      ProductType.transparentFloors
    ];

    // get all mixes arrays
    this.paintMixes = await this.paintMixesService.getPaintMixes();
    this.engobMixes = await this.engobMixesService.getEngobMixes();
    this.bodyMixes = await this.bodyMixesService.getBodyMixes();
    // filter mixes
    this.filterMixes();
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

  async initSettingTranslation() {
    moment.locale(this.translate.currentLanguage); 
  }

  onNext(stepper: NbStepperComponent): void {
    switch(stepper.selectedIndex) {
      case 0:
        this.onFirstSubmit();
        stepper.next();
        break;

      case 1:
        this.onSecondSubmit();
        stepper.next();
        break;

      case 2:
        this.onThirdSubmit();
        stepper.next();
        break;

      case 3:
        this.onFourthSubmit();
        stepper.next();
        break;

      case 4:
        this.onFifthSubmit();
        stepper.next();
        break;
      
      case 5:
        this.onSixthSubmit();
        stepper.next();
        break;

    }
  }

  onPrevious(stepper: NbStepperComponent): void {
    stepper.previous();
  }

  // forms & validations

  initForms(): void {
    this.firstForm = this.fb.group({
      productName: ['', Validators.required],
      code: ['', Validators.required],
      type: ['', Validators.required],
      productionDate: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required],
      productImage: ['']
    });

    this.secondForm = this.fb.group({
      paintMix: ['', Validators.required],
      pWeight: ['', Validators.required],
      pDensity: ['', Validators.required],
      pViscosity: ['', Validators.required]
    });

    this.thirdForm = this.fb.group({
      engobMix: ['', Validators.required],
      eWeight: ['', Validators.required],
      eDensity: ['', Validators.required],
      eViscosity: ['', Validators.required]
    });

    this.fourthForm = this.fb.group({
      bodyMix: ['', Validators.required],
      thickness: ['', Validators.required],
      pistonPressure: ['', Validators.required],
      breakingForce: ['', Validators.required],
      radiation: ['', Validators.required]
    });

    this.fifthForm = this.fb.group({
      bOvenHeatLow: ['', Validators.required],
      bOvenHeatHigh: ['', Validators.required],
      pOvenHeatLow: ['', Validators.required],
      pOvenHeatHigh: ['', Validators.required],
      bOvenPeriod: ['', Validators.required],
      pOvenPeriod: ['', Validators.required]
    });

    this.sixthForm = this.fb.group({
      productImage: [null]
    });

  }

  // init mixes options
  initMixesOptions() {
    switch(this.selectedType) {
      case ProductType.matWalls:
        this.paintOptions = this.matWallsPaintMixes;
        this.engobOptions = this.matWallsEngobMixes;
        this.bodyOptions = this.wallsBodyMixes;
        break;
      case ProductType.matFloors:
        this.paintOptions = this.matFloorsPaintMixes;
        this.engobOptions = this.matFloorsEngobMixes;
        this.bodyOptions = this.floorsBodyMixes;
        break;
      case ProductType.transparentWalls:
        this.paintOptions = this.transparentWallsPaintMixes;
        this.engobOptions = this.transparentWallsEngobMixes;
        this.bodyOptions = this.wallsBodyMixes;
        break;
      case ProductType.transparentFloors:
        this.paintOptions = this.transparentFloorsPaintMixes;
        this.engobOptions = this.transparentFloorsEngobMixes;
        this.bodyOptions = this.floorsBodyMixes;
        break;
    }
    console.log('type ', this.selectedType);
    console.log('matWallsPaintMixes ', this.matWallsPaintMixes);
    console.log('paint options ', this.paintOptions);
  }

  onClickBack(stepper: NbStepperComponent): void {
    this.onBack.emit(false);
    stepper.reset();
  }

  onFirstSubmit() {
    for (const control in this.firstForm.controls) {
      this.firstForm.controls[control].markAsDirty();
    }
    this.initMixesOptions();
  }

  onSecondSubmit() {
    for (const control in this.secondForm.controls) {
      this.secondForm.controls[control].markAsDirty();
    }
  }

  onThirdSubmit() {
    for (const control in this.thirdForm.controls) {
      this.thirdForm.controls[control].markAsDirty();
    }
  }

  onFourthSubmit() {
    for (const control in this.fourthForm.controls) {
      this.fourthForm.controls[control].markAsDirty();
    }
  }

  onFifthSubmit() {
    for (const control in this.fifthForm.controls) {
      this.fifthForm.controls[control].markAsDirty();
    }
  }

  onSixthSubmit() {
    this.onSubmit();
  }

  onSubmit() {
    const dataToSend = new FormData();
    dataToSend.append('productImage', this.imageFile);
    this.productCard = {
      productName: this.productName.value,
      code: this.code.value,
      type: this.getType(this.type.value),
      glize: this.getGlize(this.type.value),
      productionDate: this.commonService.convertFromUTCtoLocalDate(this.productionDate.value),
      dimensions: {
        width: this.width.value,
        height: this.height.value
      },
      paintMix: this.selectedPaintMix._id,
      paintFactors: {
        weight: this.pWeight.value,
        density: this.pDensity.value,
        viscosity: this.pViscosity.value
      },
      engobMix: this.selectedEngobMix._id,
      engobFactors: {
        weight: this.eWeight.value,
        density: this.eDensity.value,
        viscosity: this.eViscosity.value
      },
      bodyMix: this.selectedBodyMix._id,
      pistonPressure: this.pistonPressure.value,
      breakingForce: this.breakingForce.value,
      radiation: this.radiation.value,
      thickness: this.thickness.value,
      pOvenPeriod: this.pOvenPeriod.value,
      pOvenHeat: {
        low: this.pOvenHeatLow.value,
        high: this.pOvenHeatHigh.value
      },
      bOvenPeriod: this.bOvenPeriod.value,
      bOvenHeat: {
        low: this.bOvenHeatLow.value,
        high: this.bOvenHeatHigh.value
      }
    };

    // for (const key in this.productCard) {
    //   if (typeof this.productCard[key] !== 'string') {
    //     dataToSend.append(key, JSON.stringify(this.productCard[key]));
    //   } else {
    //     dataToSend.append(key, this.productCard[key]);
    //   }
    // }

    console.log('dataToSend ', dataToSend);
    this.productsCardsService.createProductCard(this.productCard)
      .subscribe(async (res) => {
        const result = await this.productsCardsService.attachImage(res._id, dataToSend).toPromise();
        this.productsCardsService.productCards.unshift(result);
        this.productsCardsService.onProductCardsChange.next(this.productsCardsService.productCards);
        this.onBack.emit(false);
      });

  }

  async initSelect() {
    this.paintConfig = {
      displayKey:"code", //if objects array passed which key to be displayed defaults to description
      search:true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: await this.trans.get('PAGES.ProductsCardsStepper.selectPaintMix').toPromise(), // text to be displayed when no item is selected defaults to Select,
      customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.paintMixes.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: await this.trans.get('PAGES.ProductsCardsStepper.more').toPromise(), // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: await this.trans.get('PAGES.ProductsCardsStepper.noResultsFound').toPromise(), // text to be displayed when no items are found while searching
      searchPlaceholder:await this.trans.get('PAGES.ProductsCardsStepper.search').toPromise(), // label thats displayed in search input,
      searchOnKey: 'code' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };

    this.engobConfig = {
      displayKey:"code",
      search:true,
      height: 'auto',
      placeholder: await this.trans.get('PAGES.ProductsCardsStepper.selectEngobMix').toPromise(),
      customComparator: ()=>{},
      limitTo: this.engobMixes.length,
      moreText: await this.trans.get('PAGES.ProductsCardsStepper.more').toPromise(),
      noResultsFound: await this.trans.get('PAGES.ProductsCardsStepper.noResultsFound').toPromise(),
      searchPlaceholder:await this.trans.get('PAGES.ProductsCardsStepper.search').toPromise(),
      searchOnKey: 'code'
    };

    this.bodyConfig = {
      displayKey:"code",
      search:true,
      height: 'auto',
      placeholder: await this.trans.get('PAGES.ProductsCardsStepper.selectBodyMix').toPromise(),
      customComparator: () => {},
      limitTo: this.bodyMixes.length,
      moreText: await this.trans.get('PAGES.ProductsCardsStepper.more').toPromise(),
      noResultsFound: await this.trans.get('PAGES.ProductsCardsStepper.noResultsFound').toPromise(),
      searchPlaceholder: await this.trans.get('PAGES.ProductsCardsStepper.search').toPromise(),
      searchOnKey: 'code'
    };
  }

  getType(type: string) {
    if (type == ProductType.matWalls || type == ProductType.transparentWalls) {
      return MixType.WALLS
    } else {
      return MixType.FLOORS
    }
  }

  getGlize(type: string) {
    if (type == ProductType.matWalls || type == ProductType.matFloors) {
      return Glize.MAT
    } else {
      return Glize.TRANSPARENT
    }
  }

  // filter Mixes
  filterMixes() {
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

  onChangeSelectedPaint() {
    console.log('selected ', this.selectedPaintMix);
  }

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.sixthForm.patchValue({
      productImage: file
    });
    this.sixthForm.get('productImage').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      this.imageFile = file;

      this.imagePreview.nativeElement.style.backgroundImage = "url('" + this.imageURL + "')";
      this.imagePreview.nativeElement.style.backgroundSize = "cover";

    }
    reader.readAsDataURL(file)
  }

  get productName() {
    return this.firstForm.controls['productName'];
  }

  get code() {
    return this.firstForm.controls['code'];
  }

  get type() {
    return this.firstForm.controls['type'];
  }

  get productionDate() {
    return this.firstForm.controls['productionDate'];
  }

  get width() {
    return this.firstForm.controls['width'];
  }

  get height() {
    return this.firstForm.controls['height'];
  }

  get paintMix() {
    return this.secondForm.controls['paintMix'];
  }


  get pWeight() {
    return this.secondForm.controls['pWeight'];
  }

  get pDensity() {
    return this.secondForm.controls['pDensity'];
  }

  get pViscosity() {
    return this.secondForm.controls['pViscosity'];
  }

  get engobMix() {
    return this.thirdForm.controls['engobMix'];
  }


  get eWeight() {
    return this.thirdForm.controls['eWeight'];
  }

  get eDensity() {
    return this.thirdForm.controls['eDensity'];
  }

  get eViscosity() {
    return this.thirdForm.controls['eViscosity'];
  }

  get bodyMix() {
    return this.fourthForm.controls['bodyMix'];
  }

  get thickness() {
    return this.fourthForm.controls['thickness'];
  }

  get pistonPressure() {
    return this.fourthForm.controls['pistonPressure'];
  }

  get breakingForce() {
    return this.fourthForm.controls['breakingForce'];
  }

  get radiation() {
    return this.fourthForm.controls['radiation'];
  }

  get pOvenHeatLow() {
    return this.fifthForm.controls['pOvenHeatLow'];
  }

  get pOvenHeatHigh() {
    return this.fifthForm.controls['pOvenHeatHigh'];
  }

  get bOvenHeatLow() {
    return this.fifthForm.controls['bOvenHeatLow'];
  }

  get bOvenHeatHigh() {
    return this.fifthForm.controls['bOvenHeatHigh'];
  }

  get pOvenPeriod() {
    return this.fifthForm.controls['pOvenPeriod'];
  }

  get bOvenPeriod() {
    return this.fifthForm.controls['bOvenPeriod'];
  }

  get productImage() {
    return this.sixthForm.controls['productImage'];
  }
}
