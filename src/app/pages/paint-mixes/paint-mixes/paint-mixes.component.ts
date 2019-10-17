import { PaintMix } from './../../../models/paintMix';
import { CustomButtonComponent } from './../../../shared/components/custom-button/custom-button.component';
import { PaintMixesService } from './../../../services/paint-mixes.service';
import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { MixType } from './../../../models/enums/mixType';
import { Glize } from './../../../models/enums/glize';
import { MixComponent } from '../../../models/mixComponent';
import { TranslateServiceOur } from '../../../services/our-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource, Cell } from 'ee-ng-smart-table';
import { CommonService } from '../../../services/common.service';

import { FilterInputComponent } from '../../../shared/components/filter-input/filter-input.component';
import { EditorInputNumberComponent } from '../../../shared/components/editor-input-number/editor-input-number.component';
import { FilterDaterangeInputComponent } from '../../../shared/components/filter-daterange-input/filter-daterange-input.component';


var moment = require('moment');
var momentRange = require('moment-range');
momentRange.extendMoment(moment);


@Component({
  selector: 'app-paint-mixes',
  templateUrl: './paint-mixes.component.html',
  styleUrls: ['./paint-mixes.component.scss']
})
export class PaintMixesComponent implements OnInit, AfterViewInit {

  GLIZE_OPTIONS = [
    { value: Glize.MAT, title: 'PAGES.PaintMixes.mat' },
    { value: Glize.TRANSPARENT, title: 'PAGES.PaintMixes.transparent' },
  ];
  
  TYPE_OPTIONS = [
    { value: MixType.WALLS, title: 'PAGES.PaintMixes.walls' },
    { value: MixType.FLOORS, title: 'PAGES.PaintMixes.floors' },
  ];

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
        }
      },
      code: {
        title: 'Code',
      },
      type: {
        title: 'Type',
        filter: {
          type: 'list',
          config: {
            list: this.TYPE_OPTIONS
          }
        },
        valuePrepareFunction: (value) => value,
      },
      glize: {
        title: 'Glize',
        filter: {
          type: 'list',
          config: {
            list: this.GLIZE_OPTIONS
          }
        },
        valuePrepareFunction: (value) => value,
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
      display : true,
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
      name: {
        title: 'Name',
        type:'text'
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
      }
    },
    pager: {
      display : true,
      perPage: 4
    },
    mode: 'inline',
    
  };

  isFlipped = false;
  selectedType = MixType.WALLS;
  formTitle = '';
  paintMixes: Array<PaintMix> = [];
  mixComponents: Array<MixComponent> = [];
  totalQuantity = 0;

  newPaintMix: PaintMix = {
    code: '',
    type: '',
    glize: '',
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
  @ViewChild('paintMixTable', { static: true }) paintMixTable;

  constructor(private paintMixesService: PaintMixesService,
    private dialogService: NbDialogService,
    private translate: TranslateServiceOur,
    private trans: TranslateService,
    private commonService: CommonService) { }

  async ngOnInit() {
    this.paintMixes = await this.paintMixesService.getPaintMixes();
    this.commonService.paintMixes = this.paintMixes;
    // moment(paintMix.createdAt).format('llll')
    console.log('paintMixes ', this.paintMixes);
    this.loadTableData(this.paintMixes);
    this.trans.use(this.translate.currentLanguage);
    await this.initSettingTranslation();
  }

  ngAfterViewInit(): void {
    const h = document.getElementsByClassName('createdAt');
    const input = h[1].children[0].children[0].children[0].children[0];

    console.log('input ', input);
    this.translate.changeLang
      .subscribe(async(currentLang: string) => {
        this.trans.use(currentLang);
        await this.initSettingTranslation();
      });
  }

  onCreatePaintMix(event: any): void {
    console.log('create');
    this.formTitle = 'PAGES.PaintMixes.createPaintMix';
    this.isFlipped = true;
  }

  onEditPaintMix(event: any): void {
    console.log('edit', event);
    this.newPaintMix = {...event.data};
    this.formTitle = 'PAGES.PaintMixes.editPaintMix';
    this.isEdit = true;
    this.totalQuantity = this.newPaintMix.components
    .map((component: MixComponent) => +component.quantity)
    .reduce((sum, num) => sum + num);
    console.log('totalQuantity ', this.totalQuantity);
    this.isFlipped = true;

  }

  onAddComponent(event: any): void {
    const newComponent = event.newData;
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

    const index = this.newPaintMix.components.indexOf(event.data);
    console.log('ind ', index);
    if (index >= 0) {
      this.newPaintMix[index] = event.data;
    }
  }

  onDeleteComponent(event: any): void {
    console.log('event ', event);
    const component = event.data;
    this.totalQuantity -= (+component.quantity);
    event.confirm.resolve();

    const index = this.newPaintMix.components.indexOf(event.data);
    console.log('ind ', index);
    if (index >= 0) {
      this.newPaintMix.components.splice(index, 1);
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
    const temp: PaintMix = {
      code: this.newPaintMix.code,
      components: this.newPaintMix.components,
      type: this.newPaintMix.type,
      glize: this.newPaintMix.glize
    };
    this.paintMixesService.createPaintMix(temp)
        .subscribe((result) => {
          console.log(result);
          this.resetForm(form);
          this.paintMixes.push(result);
          this.loadTableData(this.paintMixes);
          this.totalQuantity = 0;
          this.isFlipped = false;
        });
  }

  handleEdit(form: any): void {
    const temp: PaintMix = {
      code: this.newPaintMix.code,
      components: this.newPaintMix.components,
      type: this.newPaintMix.type,
      glize: this.newPaintMix.glize
    };
    this.paintMixesService.updatePaintMix(this.newPaintMix._id, temp)
        .subscribe((result) => {
          this.resetForm(form);
          const index = this.paintMixes.findIndex((paintMix: PaintMix) => paintMix._id == result._id);
          console.log('index ', index);
          this.paintMixes[index] = result;
          this.loadTableData(this.paintMixes);
          this.totalQuantity = 0;
          this.isFlipped = false;
        });
  }

  openAskModal(dialog: TemplateRef<any>, event: any): void {
    this.dialogService.open(dialog, {
      context:  {
        info: event.data,
        message: this.AskMessage
      }
    });
  }

  handleAccept(paintMix: PaintMix, dialog: any): void {
    this.paintMixesService.deletePaintMix(paintMix._id)
      .subscribe((result: any) => {
        const index = this.paintMixes.findIndex(mix => mix._id === paintMix._id);
        if (index >= 0) {
          this.paintMixes.splice(index, 1);
        }
        this.loadTableData(this.paintMixes);
        dialog.close();
      })
  }

  resetForm(form): void {
    form.reset();
    this.isSubmited = false;
    this.newPaintMix = {
      code: '',
      type: '',
      glize: '',
      components: []
    };
  }

  loadTableData(data: Array<PaintMix>): void {
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
    // require validation
    if (!newComponent.quantity.length || !newComponent.name.length) {
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
    if (form.invalid || this.newPaintMix.components.length <= 0) {
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

    const typeOptions = [], glizeOptions = [];
    for(const item of this.TYPE_OPTIONS.slice()) {
      const temp = {
        ...item,
        title: await this.trans.get(item.title).toPromise()
      };
      typeOptions.push(temp);
    }

    for(const item of this.GLIZE_OPTIONS.slice()) {
      const temp = {
        ...item,
        title: await this.trans.get(item.title).toPromise()
      };
      glizeOptions.push(temp);
    }
    
    

    console.log(typeOptions);

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
          title: await this.trans.get('PAGES.PaintMixes.date').toPromise(),
          valuePrepareFunction: (value) => {
            const newVal = moment.utc(value).format('YYYY-MM-DD hh:mm a');
            return newVal;
            // return value;
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
          }
        },
        code: {
          title: await this.trans.get('PAGES.PaintMixes.code').toPromise(),
        },
        type: {
          title: await this.trans.get('PAGES.PaintMixes.type').toPromise(),
          filter: {
            type: 'list',
            config: {
              list: typeOptions
            }
          },
          valuePrepareFunction: (value) => this.handleTranslateCells(value, true),
        },
        glize: {
          title: await this.trans.get('PAGES.PaintMixes.glize').toPromise(),
          filter: {
            type: 'list',
            config: {
              list: glizeOptions
            }
          },
          valuePrepareFunction: (value) => this.handleTranslateCells(value, false),
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
        display : true,
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
        name: {
          title: await this.trans.get('PAGES.PaintMixes.name').toPromise(),
          type:'text'
        },
        quantity: {
          title: await this.trans.get('PAGES.PaintMixes.quantity').toPromise(),
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
        }
      },
      pager: {
        display : true,
        perPage: 4
      },
      mode: 'inline',
      
    };
    
    this.loadTableData(this.paintMixes);
  }
}
