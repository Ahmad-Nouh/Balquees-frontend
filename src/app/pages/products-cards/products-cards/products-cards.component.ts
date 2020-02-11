import { async } from '@angular/core/testing';
import { ProductCard } from './../../../models/productCard';

import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { ProductsCardsService } from '../../../services/products-cards.service';
import { MaterialsService } from '../../../services/materials.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProductType } from '../../../models/enums/productType';
import { PaintMix } from '../../../models/paintMix';
import { EngobMix } from '../../../models/engobMix';
import { BodyMix } from '../../../models/bodyMix';
import { TranslateServiceOur } from '../../../services/our-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { BodyMixesService } from '../../../services/body-mixes.service';
import { PaintMixesService } from '../../../services/paint-mixes.service';
import { EngobMixesService } from '../../../services/engob-mixes.service';
import { MixType } from '../../../models/enums/mixType';
import { Glize } from '../../../models/enums/glize';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
var moment = require('moment');
var momentRange = require('moment-range');
momentRange.extendMoment(moment);

@Component({
  selector: 'app-products-cards',
  templateUrl: './products-cards.component.html',
  styleUrls: ['./products-cards.component.scss']
})
export class ProductsCardsComponent implements OnInit, AfterViewInit {
  @ViewChild('imagePreview', { static: false }) imagePreview;
  isFlipped = false;
  isAdd = true;
  data = [];

  formTitle = 'PAGES.ProductsCards.productsCards';
  AskMessage = 'PAGES.Common.askDeleteMessage';

  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  fourthForm: FormGroup;
  fifthForm: FormGroup;
  sixthForm: FormGroup;

  productCardTypes = [];
  selectedPaintMix: PaintMix;
  selectedEngobMix: EngobMix;
  selectedBodyMix: BodyMix;
  selectedType: any;

  paintOptions = [];
  engobOptions = [];
  bodyOptions = [];

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

  paintMixes: Array<PaintMix> = [];
  engobMixes: Array<EngobMix> = [];
  bodyMixes: Array<BodyMix> = [];

  paintConfig = {};
  engobConfig = {};
  bodyConfig = {};

  imageURL: string;
  imageFile: any;

  backendUrl = environment.backend;

  constructor(private dialogService: NbDialogService,
              public productsCardsService: ProductsCardsService,
              private bodyMixesService: BodyMixesService,
              private paintMixesService: PaintMixesService,
              private engobMixesService: EngobMixesService,
              private materialsService: MaterialsService,
              private commonService: CommonService,
              private fb: FormBuilder,
              public translate: TranslateServiceOur,
              private trans: TranslateService) { }

  async ngOnInit() {
    // initialize forms with required validation
    this.initForms();

    // initialize translation 
    await this.initSettingTranslation();
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

    // get product cards
    this.productsCardsService.getProductCards()
      .subscribe((data) => {
        this.productsCardsService.productCards = data;
      });
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

  onClickBack(result: boolean, isAdd): void {
    this.isFlipped = result;
  }

  onCreateProductCard(event): void {
    this.isFlipped = true;
    this.isAdd = true;
  }

  onDeleteProductCard(dialog: TemplateRef<any>, product: any): void {
    console.log('delete ', product);
    this.dialogService.open(dialog, {
      context:  {
        info: product.name,
        message: this.AskMessage,
        id: product._id
      }
    });
  }

  onEditProductCard(dialog: TemplateRef<any>, product: any): void {
    console.log('edit ', product);
    this.initForms(product);
    this.dialogService.open(dialog, {
      context:  {
        info: product,
        id: product._id
      },
      dialogClass: 'w-75'
    });

    if (product.imageUrl) {
      setTimeout(() => {
        this.imageURL = this.backendUrl + product.imageUrl;
        this.imagePreview.nativeElement.style.backgroundImage = "url('" + this.imageURL + "')";
        this.imagePreview.nativeElement.style.backgroundSize = "cover";
      }, 100);
    }
  }

  onConfirmDelete(id, ref): void {
    console.log('id ', id);
    this.productsCardsService.removeProductCard(id)
      .subscribe((res) => {
        const index = this.productsCardsService.productCards.findIndex((prod: ProductCard) => prod._id == id);
        if (index >= 0) {
          this.productsCardsService.productCards.splice(index, 1);
          this.productsCardsService.onProductCardsChange.next(this.productsCardsService.productCards);
        }
        ref.close();
      })
  }

  onConfirmEdit(productId, ref): void {
    console.log('confirm');
    const dataToSend = new FormData();
    dataToSend.append('productImage', this.imageFile);

    const productCard = {
      _id: productId,
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

    this.productsCardsService.editProductCard(productId, productCard)
      .subscribe(async (res: any) => {
        const result = await this.productsCardsService.attachImage(res._id, dataToSend).toPromise();
        const index = this.productsCardsService.productCards.findIndex((pCard: ProductCard) => pCard._id == res._id);
        if (index >= 0) {
          this.productsCardsService.productCards[index] = result;
          this.productsCardsService.onProductCardsChange.next(this.productsCardsService.productCards);
        }
        ref.close();
      });
  }

  onViewProductCard(productCard: ProductCard): void {
    this.productsCardsService.selectedProduct = {...productCard};
    this.extendSelectedProduct();
    console.log('selected ', this.productsCardsService.selectedProduct)
    this.isFlipped = true;
    this.isAdd = false;
  }

  extendSelectedProduct(): void {
    const paintMixComponents = this.productsCardsService.selectedProduct.paintMix.components;
    
    // if paintMixComponents materials aren't objects (not populated) => populate them
    if (!paintMixComponents[0].material._id) {
      for(const comp of paintMixComponents) {
        comp.material = this.materialsService.materials.find(mat => mat._id == comp.material);
      }
    }

    // if engobMixComponents materials aren't objects (not populated) => populate them
    const engobMixComponents = this.productsCardsService.selectedProduct.engobMix.components;
    if (!engobMixComponents[0].material._id) {
      for(const comp of engobMixComponents) {
        comp.material = this.materialsService.materials.find(mat => mat._id == comp.material);
      }
    }

    // if bodyMixComponents materials aren't objects (not populated) => populate them
    const bodyMixComponents = this.productsCardsService.selectedProduct.bodyMix.components;
    if (!bodyMixComponents[0].material._id) {
      for(const comp of bodyMixComponents) {
        comp.material = this.materialsService.materials.find(mat => mat._id == comp.material);
      }
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

  initForms(product?: ProductCard): void {
    if (product) {
      this.firstForm = this.fb.group({
        productName: [product.productName, Validators.required],
        code: [product.code, Validators.required],
        type: [product.type+product.glize, Validators.required],
        productionDate: [product.productionDate, Validators.required],
        width: [product.dimensions.width, Validators.required],
        height: [product.dimensions.height, Validators.required],
        productImage: ['']
      });

      this.secondForm = this.fb.group({
        paintMix: [product.paintMix, Validators.required],
        pWeight: [product.paintFactors.weight, Validators.required],
        pDensity: [product.paintFactors.density, Validators.required],
        pViscosity: [product.paintFactors.viscosity, Validators.required]
      });

      this.thirdForm = this.fb.group({
        engobMix: [product.engobMix, Validators.required],
        eWeight: [product.engobFactors.weight, Validators.required],
        eDensity: [product.engobFactors.density, Validators.required],
        eViscosity: [product.engobFactors.viscosity, Validators.required]
      });

      this.fourthForm = this.fb.group({
        bodyMix: [product.bodyMix, Validators.required],
        thickness: [product.thickness, Validators.required],
        pistonPressure: [product.pistonPressure, Validators.required],
        breakingForce: [product.breakingForce, Validators.required],
        radiation: [product.radiation, Validators.required]
      });

      this.fifthForm = this.fb.group({
        bOvenHeatLow: [product.bOvenHeat.low, Validators.required],
        bOvenHeatHigh: [product.bOvenHeat.high, Validators.required],
        pOvenHeatLow: [product.pOvenHeat.low, Validators.required],
        pOvenHeatHigh: [product.pOvenHeat.high, Validators.required],
        bOvenPeriod: [product.bOvenPeriod, Validators.required],
        pOvenPeriod: [product.pOvenPeriod, Validators.required]
      });

      this.sixthForm = this.fb.group({
        productImage: [null]
      });

      this.selectedType = product.type+product.glize;
      this.selectedPaintMix = product.paintMix;
      this.selectedEngobMix = product.engobMix;
      this.selectedBodyMix = product.bodyMix;

      this.initMixesOptions();
    } else {
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

  async initSettingTranslation() {
    moment.locale(this.translate.currentLanguage);
    // init select ui
    await this.initSelect(); 
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
