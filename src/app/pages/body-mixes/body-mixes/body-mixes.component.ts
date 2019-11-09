import { SelectComponent } from './../../../shared/components/select/select.component';
import { MaterialsService } from './../../../services/materials.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Glize } from '../../../models/enums/glize';
import { MixType } from '../../../models/enums/mixType';
import { FilterDaterangeInputComponent } from '../../../shared/components/filter-daterange-input/filter-daterange-input.component';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { FilterInputComponent } from '../../../shared/components/filter-input/filter-input.component';
import { EditorInputNumberComponent } from '../../../shared/components/editor-input-number/editor-input-number.component';
import { BodyMixComponent } from '../../../models/bodyMixComponent';
import { BodyMixesService } from '../../../services/body-mixes.service';
import { NbDialogService } from '@nebular/theme';
import { TranslateServiceOur } from '../../../services/our-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../services/common.service';
import { LocalDataSource } from 'ee-ng-smart-table';
import { BodyMix } from '../../../models/bodyMix';
import { Material } from '../../../models/material';

var moment = require('moment');
var momentRange = require('moment-range');
momentRange.extendMoment(moment);

@Component({
  selector: 'app-body-mixes',
  templateUrl: './body-mixes.component.html',
  styleUrls: ['./body-mixes.component.scss']
})
export class BodyMixesComponent implements OnInit {

  settings = {
    add: {
      addButtonContent: '<i class="fa fa-plus"></i>',
      createButtonContent: '<i class="fa fa-check"></i>',
      cancelButtonContent: '<i class="fa fa-times"></i>',
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil"></i>',
      saveButtonContent: '<i class="fa fa-floppy-o"></i>',
      cancelButtonContent: '<i class="fa fa-times"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash"></i>',
      saveButtonContent: '<i class="fa fa-floppy-o"></i>',
      cancelButtonContent: '<i class="fa fa-times"></i>',
    },
    columns: {
      createdAt: {
        title: 'Date',
        valuePrepareFunction: (value) => {
          return value;
        },
        filter: {
          type: 'custom',
          component: FilterDaterangeInputComponent,
        },
        filterFunction: (cell: any, search?: string) => {
          return true;
        },
        sort: true,
        sortDirection: 'desc'
      },
      code: {
        title: 'Code',
      },
      components: {
        filter: false,
        editable: true,
        type: 'custom',
        renderComponent: CustomButtonComponent
      }
    },
    // actions: {
    //   columnTitle: ''
    // },
    pager: {
      display: true,
      perPage: 5
    },
    mode: 'external',

  };

  settings1 = {
    add: {
      addButtonContent: '<i class="fa fa-plus"></i>',
      createButtonContent: '<i class="fa fa-check"></i>',
      cancelButtonContent: '<i class="fa fa-times"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil"></i>',
      saveButtonContent: '<i class="fa fa-floppy-o"></i>',
      cancelButtonContent: '<i class="fa fa-times"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash"></i>',
      saveButtonContent: '<i class="fa fa-floppy-o"></i>',
      cancelButtonContent: '<i class="fa fa-times"></i>',
      confirmDelete: true
    },
    columns: {
      material: {
        title: 'Material',
        filter: {
          type: 'custom',
          component: SelectComponent
        },
        editor: {
          type: 'custom',
          component: SelectComponent
        },
        valuePrepareFunction: (value) => value.name,
      },
      quantity: {
        title: 'Quantity',
        filter: {
          type: 'custom',
          component: FilterInputComponent
        },
        editor: {
          type: 'custom',
          component: EditorInputNumberComponent
        },
        valuePrepareFunction: (value) => {
          return value + '%';
        },
      },
      moisture: {
        title: 'Moisture',
        filter: {
          type: 'custom',
          component: FilterInputComponent
        },
        editor: {
          type: 'custom',
          component: EditorInputNumberComponent
        }
      },
      dryRM: {
        title: 'DryRM',
        filter: {
          type: 'custom',
          component: FilterInputComponent
        },
        editor: {
          type: 'custom',
          component: EditorInputNumberComponent
        }
      },
      wetRM: {
        title: 'WetRM',
        filter: {
          type: 'custom',
          component: FilterInputComponent
        },
        editor: {
          type: 'custom',
          component: EditorInputNumberComponent
        }
      },
      wet: {
        title: 'Wet',
        filter: {
          type: 'custom',
          component: FilterInputComponent
        },
        editor: {
          type: 'custom',
          component: EditorInputNumberComponent
        }
      },
    },
    pager: {
      display: true,
      perPage: 4
    },
    mode: 'inline',

  };

  isFlipped = false;
  selectedType = MixType.WALLS;
  formTitle = '';
  bodyMixes: Array<BodyMix> = [];
  bodyMixComponents: Array<BodyMixComponent> = [];
  totalQuantity = 0;

  newBodyMix: BodyMix = {
    code: '',
    components: []
  };


  isSubmited = false;
  isEdit = false;

  AskMessage = 'PAGES.Common.askDeleteMessage';
  validationMessage = 'PAGES.Common.validationMessage';
  numValidationMessage = 'PAGES.Common.numValidationMessage';
  requiredTableMessage = 'PAGES.Common.requiredTableMessage';
  overQuantityMessage = 'PAGES.Common.overQuantityMessage';
  validQuantityMessage = 'PAGES.Common.validQuantityMessage';

  requiredMessage = 'PAGES.Common.requiredMessage';
  componentsValidation = 'PAGES.Common.componentsValidation';

  data: any;
  @ViewChild('bodyMixTable', { static: true }) bodyMixTable;

  constructor(private bodyMixesService: BodyMixesService,
    private dialogService: NbDialogService,
    private translate: TranslateServiceOur,
    private trans: TranslateService,
    private commonService: CommonService,
    private materialService: MaterialsService) { }

  async ngOnInit() {
    const data: Array<any> = await this.bodyMixesService.getBodyMixes();
    // this.bodyMixes = data.map((mix: any) => ({
    //   ...mix,
    //   components: mix.components.map((component: any) => ({
    //     ...component,
    //     material: this.materialService.materials.find((mat: Material) => mat._id === component.material)
    //   }))
    // }));
    this.bodyMixes = data;  
    this.commonService.bodyMixes = this.bodyMixes;
    // moment(bodyMix.createdAt).format('llll')
    console.log('bodyMixes ', this.bodyMixes);
    this.loadTableData(this.bodyMixes);
    this.trans.use(this.translate.currentLanguage);
    await this.initSettingTranslation();
  }

  ngAfterViewInit(): void {
    this.translate.changeLang
      .subscribe(async (currentLang: string) => {
        this.trans.use(currentLang);
        await this.initSettingTranslation();
      });
  }

  onCreateBodyMix(event: any): void {
    console.log('create');
    this.formTitle = 'PAGES.BodyMixes.createBodyMix';
    this.isFlipped = true;
  }

  onEditBodyMix(event: any): void {
    console.log('edit', event);
    this.newBodyMix = { ...event.data };
    this.formTitle = 'PAGES.BodyMixes.editBodyMix';
    this.isEdit = true;
    this.totalQuantity = this.newBodyMix.components
      .map((component: any) => +component.quantity)
      .reduce((sum, num) => sum + num);
    console.log('totalQuantity ', this.totalQuantity);
    this.isFlipped = true;

  }

  onAddComponent(event: any): void {
    const newComponent = event.newData;
    console.log('newComponent ', newComponent);
    // validate component
    if (this.validateComponent(newComponent)) {
      return;
    }
    // increment quantity
    this.totalQuantity += (+newComponent.quantity);
    // save component
    event.confirm.resolve();
  }

  onEditComponent(event): void {
    const newComponent = event.newData;
    const oldComponent = event.data;
    // validate component
    if (this.validateComponent(newComponent, oldComponent)) {
      return;
    }
    // remove old quantity
    this.totalQuantity -= (+oldComponent.quantity);
    console.log('before ', this.totalQuantity);
    // increment quantity
    this.totalQuantity += (+newComponent.quantity);
    console.log('after ', this.totalQuantity);
    // save component
    event.confirm.resolve();

    const index = this.newBodyMix.components.indexOf(event.data);
    console.log('ind ', index);
    if (index >= 0) {
      this.newBodyMix.components[index] = event.data;
    }
  }

  onDeleteComponent(event: any): void {
    console.log('event ', event);
    const component = event.data;
    this.totalQuantity -= (+component.quantity);
    event.confirm.resolve();

    const index = this.newBodyMix.components.indexOf(event.data);
    console.log('ind ', index);
    if (index >= 0) {
      this.newBodyMix.components.splice(index, 1);
    }
  }

  onClickBack(form: any): void {
    this.resetForm(form);
    this.isFlipped = false;
    this.isEdit = false;
    this.totalQuantity = 0;
  }

  onSubmit(form: any): void {
    this.isSubmited = true;
    // validate form before create or update
    if (this.validateForm(form)) {
      return;
    }
    // check if we open card to create or update
    if (this.isEdit) {
      this.handleEdit(form);
    } else {
      this.handleCreate(form)
    }
  }

  handleCreate(form: any): void {
    const temp: BodyMix = {
      code: this.newBodyMix.code,
      components: this.newBodyMix.components
        .map((component: any) => ({ ...component, material: component.material._id }))
    };
    this.bodyMixesService.createBodyMix(temp)
      .subscribe((result) => {
        console.log(result);
        this.resetForm(form);
        this.bodyMixes.push(result);
        this.loadTableData(this.bodyMixes);
        this.totalQuantity = 0;
        this.isFlipped = false;
      });
  }

  handleEdit(form: any): void {
    const temp: BodyMix = {
      code: this.newBodyMix.code,
      components: this.newBodyMix.components
      .map((component: any) => ({ ...component, material: component.material._id }))
    };
    this.bodyMixesService.updateBodyMix(this.newBodyMix._id, temp)
      .subscribe((result) => {
        this.resetForm(form);
        const index = this.bodyMixes.findIndex((bodyMix: BodyMix) => bodyMix._id == result._id);
        console.log('index ', index);
        this.bodyMixes[index] = result;
        this.loadTableData(this.bodyMixes);
        this.totalQuantity = 0;
        this.isEdit = false;
        this.isFlipped = false;
      });
  }

  openAskModal(dialog: TemplateRef<any>, event: any): void {
    this.dialogService.open(dialog, {
      context: {
        info: event.data,
        message: this.AskMessage
      }
    });
  }

  handleAccept(bodyMix: BodyMix, dialog: any): void {
    this.bodyMixesService.deleteBodyMix(bodyMix._id)
      .subscribe((result: any) => {
        const index = this.bodyMixes.findIndex(mix => mix._id === bodyMix._id);
        if (index >= 0) {
          this.bodyMixes.splice(index, 1);
        }
        this.loadTableData(this.bodyMixes);
        dialog.close();
      })
  }

  resetForm(form): void {
    form.reset();
    this.isSubmited = false;
    this.newBodyMix = {
      code: '',
      components: []
    };
  }

  loadTableData(data: Array<BodyMix>): void {
    this.data = new LocalDataSource(data);
  }


  handleTranslateCells(value: string, isType: boolean): string {
    let translation = '';
    if (isType) {
      if (value === MixType.WALLS) {
        translation = this.translate.currentLanguage == 'en' ? MixType.WALLS : 'جدران';
      } else {
        translation = this.translate.currentLanguage == 'en' ? MixType.FLOORS : 'أرضيات';
      }
    } else {
      if (value === Glize.MAT) {
        translation = this.translate.currentLanguage == 'en' ? Glize.MAT : 'مت';
      } else {
        translation = this.translate.currentLanguage == 'en' ? Glize.TRANSPARENT : 'شفاف';
      }
    }
    return translation;
  }

  validateComponent(newComponent: any, oldComponent?: any): boolean {
    console.log('newComponent ', newComponent);
    const quantity = (newComponent.quantity instanceof String) ? +newComponent.quantity : newComponent.quantity;
    // require validation
    if (quantity == undefined || !newComponent.material) {
      this.commonService.showToast('bottom-end', 'danger', this.requiredTableMessage, 3000);
      return true;
    }

    if (oldComponent) {
      if (this.totalQuantity + (+newComponent.quantity) - (+oldComponent.quantity) > 100) {
        console.log('total ', this.totalQuantity + (+newComponent.quantity) - (+oldComponent.quantity));
        this.commonService.showToast('bottom-end', 'danger', this.overQuantityMessage, 3000);
        return true;
      }
    } else {
      if (this.totalQuantity + (+newComponent.quantity) > 100) {
        console.log('total ', this.totalQuantity + (+newComponent.quantity));
        this.commonService.showToast('bottom-end', 'danger', this.overQuantityMessage, 3000);
        return true;
      }
    }

    return false;
  }

  validateForm(form): boolean {
    // validate form
    if (form.invalid || this.newBodyMix.components.length <= 0) {
      this.commonService.showToast('bottom-end', 'danger', this.validationMessage, 3000);
      return true;
    }

    // validate components quantities
    if (this.totalQuantity != 100) {
      this.commonService.showToast('bottom-end', 'danger', this.validQuantityMessage, 3000);
      return true;
    }

    return false;
  }

  async initSettingTranslation() {
    moment.locale(this.translate.currentLanguage);

    const materials = this.materialService.materials.map((mat: Material) => mat.name);
    console.log('materials ', materials);

    this.settings = {
      add: {
        addButtonContent: '<i class="fa fa-plus"></i>',
        createButtonContent: '<i class="fa fa-check"></i>',
        cancelButtonContent: '<i class="fa fa-times"></i>'
      },
      edit: {
        editButtonContent: '<i class="fa fa-pencil"></i>',
        saveButtonContent: '<i class="fa fa-floppy-o"></i>',
        cancelButtonContent: '<i class="fa fa-times"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-trash"></i>',
        saveButtonContent: '<i class="fa fa-floppy-o"></i>',
        cancelButtonContent: '<i class="fa fa-times"></i>',
      },
      columns: {
        createdAt: {
          title: await this.trans.get('PAGES.BodyMixes.date').toPromise(),
          valuePrepareFunction: (value) => {
            return this.commonService.convertFromUTCtoLocalDate(value);
          },
          filter: {
            type: 'custom',
            component: FilterDaterangeInputComponent,
          },
          filterFunction: (cell: any, search?: string) => {
            if (search === '') {
              return true;
            }

            const range1 = JSON.parse(search);
            if (range1.start && range1.end) {
              const cellDate = moment(cell);
              const startDate = moment(range1.start).add(1, 'days');
              const endDate = moment(range1.end).add(1, 'days');
              const range = moment().range(startDate, endDate)
              return range.contains(cellDate);
            } else {
              return true;
            }
          },
          sort: true,
          sortDirection: 'desc'
        },
        code: {
          title: await this.trans.get('PAGES.BodyMixes.code').toPromise(),
        },
        components: {
          filter: false,
          editable: true,
          type: 'custom',
          renderComponent: CustomButtonComponent
        }
      },
      // actions: {
      //   columnTitle: ''
      // },
      pager: {
        display: true,
        perPage: 5
      },
      mode: 'external',

    };


    this.settings1 = {
      add: {
        addButtonContent: '<i class="fa fa-plus"></i>',
        createButtonContent: '<i class="fa fa-check"></i>',
        cancelButtonContent: '<i class="fa fa-times"></i>',
        confirmCreate: true
      },
      edit: {
        editButtonContent: '<i class="fa fa-pencil"></i>',
        saveButtonContent: '<i class="fa fa-floppy-o"></i>',
        cancelButtonContent: '<i class="fa fa-times"></i>',
        confirmSave: true
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-trash"></i>',
        saveButtonContent: '<i class="fa fa-floppy-o"></i>',
        cancelButtonContent: '<i class="fa fa-times"></i>',
        confirmDelete: true
      },
      columns: {
        material: {
          title:  await this.trans.get('PAGES.Common.material').toPromise(),
          filter: {
            type: 'custom',
            component: SelectComponent
          },
          editor: {
            type: 'custom',
            component: SelectComponent
          },
          valuePrepareFunction: (value) => value.name,
        },
        quantity: {
          title: await this.trans.get('PAGES.BodyMixes.quantity').toPromise(),
          filter: {
            type: 'custom',
            component: FilterInputComponent
          },
          editor: {
            type: 'custom',
            component: EditorInputNumberComponent
          },
          valuePrepareFunction: (value) => {
            return value + '%';
          },
        },
        moisture: {
          title: await this.trans.get('PAGES.BodyMixes.moisture').toPromise(),
          filter: {
            type: 'custom',
            component: FilterInputComponent
          },
          editor: {
            type: 'custom',
            component: EditorInputNumberComponent
          }
        },
        dryRM: {
          title: await this.trans.get('PAGES.BodyMixes.dryRM').toPromise(),
          filter: {
            type: 'custom',
            component: FilterInputComponent
          },
          editor: {
            type: 'custom',
            component: EditorInputNumberComponent
          }
        },
        wetRM: {
          title: await this.trans.get('PAGES.BodyMixes.wetRM').toPromise(),
          filter: {
            type: 'custom',
            component: FilterInputComponent
          },
          editor: {
            type: 'custom',
            component: EditorInputNumberComponent
          }
        },
        wet: {
          title: await this.trans.get('PAGES.BodyMixes.wet').toPromise(),
          filter: {
            type: 'custom',
            component: FilterInputComponent
          },
          editor: {
            type: 'custom',
            component: EditorInputNumberComponent
          }
        },
      },
      pager: {
        display: true,
        perPage: 4
      },
      mode: 'inline',

    };

    this.loadTableData(this.bodyMixes);
  }

}
