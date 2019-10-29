import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaintMix } from '../../../models/paintMix';
import { EngobMix } from '../../../models/engobMix';
import { BodyMix } from '../../../models/bodyMix';
import { NbStepperComponent } from '@nebular/theme';

@Component({
  selector: 'app-product-card-stepper',
  templateUrl: './product-card-stepper.component.html',
  styleUrls: ['./product-card-stepper.component.scss']
})
export class ProductCardStepperComponent implements OnInit {
  @Input('formTitle') formTitle;
  @Output('onBack') onBack = new EventEmitter<boolean>();

  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  fourthForm: FormGroup;
  fifthForm: FormGroup;


  selectedPaintMix: PaintMix;
  selectedEngobMix: EngobMix;
  selectedBodyMix: BodyMix;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // initialize forms with required validation
    this.initForms();
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

      case 3:
        this.onFifthSubmit();
        stepper.next();
        break;


      default:
          console.log('submit');

    }
    console.log('firstForm ', this.firstForm);
  }

  onPrevious(stepper: NbStepperComponent): void {
    stepper.previous();
  }

  // forms & validations

  initForms(): void {
    this.firstForm = this.fb.group({
      productName: ['', Validators.required],
      code: ['', Validators.required],
      productionDate: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required]
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

  }


  onClickBack(stepper: NbStepperComponent): void {
    this.onBack.emit(false);
    stepper.reset();
  }

  onFirstSubmit() {
    for (const control in this.firstForm.controls) {
      this.firstForm.controls[control].markAsDirty();
    }
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

  get productName() {
    return this.firstForm.controls['productName'];
  }

  get code() {
    return this.firstForm.controls['code'];
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
}
