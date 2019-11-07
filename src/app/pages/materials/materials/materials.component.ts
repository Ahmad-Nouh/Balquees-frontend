import { Material } from './../../../models/material';
import { MaterialsService } from './../../../services/materials.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FilterDaterangeInputComponent } from '../../../shared/components/filter-daterange-input/filter-daterange-input.component';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { FilterInputComponent } from '../../../shared/components/filter-input/filter-input.component';
import { EditorInputNumberComponent } from '../../../shared/components/editor-input-number/editor-input-number.component';
import { TranslateServiceOur } from '../../../services/our-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ee-ng-smart-table';
var moment = require('moment');
var momentRange = require('moment-range');
momentRange.extendMoment(moment);


@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit, AfterViewInit {

  settings = {
    add: {
      confirmCreate: true,
      addButtonContent: '<i class="fa fa-plus"></i>',
      createButtonContent: '<i class="fa fa-check"></i>',
      cancelButtonContent: '<i class="fa fa-times"></i>',
    },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="fa fa-pencil"></i>',
      saveButtonContent: '<i class="fa fa-floppy-o"></i>',
      cancelButtonContent: '<i class="fa fa-times"></i>',
    },
    delete: {
      confirmDelete: true,
      deleteButtonContent: '<i class="fa fa-trash"></i>',
      saveButtonContent: '<i class="fa fa-floppy-o"></i>',
      cancelButtonContent: '<i class="fa fa-times"></i>',
    },
    columns: {
      name: {
        title: 'Name',
        type: 'text'
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
          return value;
        },
      },
      createdAt: {
        title: 'Date',
        valuePrepareFunction: (value) => {
          return value;
        },
        filter: {
          type: 'custom',
          component: FilterDaterangeInputComponent,
        },
        editor: {
          type: 'custom',
          component: '<span></span>'
        },
        filterFunction: (cell: any, search?: string) => {
          return true;
        },
        editable: false
      },
    },
    // actions: {
    //   columnTitle: ''
    // },
    pager: {
      display : true,
      perPage: 5
    },
  };

  data: any = [];

  constructor(private materialService: MaterialsService,
    private translate: TranslateServiceOur,
    private trans: TranslateService,) { }

  async ngOnInit() {
    this.loadTableData(this.materialService.materials);
    console.log('materials ', this.data);
    this.trans.use(this.translate.currentLanguage);
    await this.initSettingTranslation();
  }

  ngAfterViewInit(): void {
    this.translate.changeLang
      .subscribe(async(currentLang: string) => {
        this.trans.use(currentLang);
        await this.initSettingTranslation();
      }); 
  }

  loadTableData(data: Array<Material>): void {
    this.data = new LocalDataSource(data);
  }
  onDeleteConfirm(event) {
    console.log("Delete Event In Console")
    console.log(event);
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event) {
    console.log("Create Event In Console")
    console.log(event);

  }

  onSaveConfirm(event) {
    console.log("Edit Event In Console")
    console.log(event);
  }


  async initSettingTranslation() {
    moment.locale(this.translate.currentLanguage);

    this.settings = {
      add: {
        confirmCreate: true,
        addButtonContent: '<i class="fa fa-plus"></i>',
        createButtonContent: '<i class="fa fa-check"></i>',
        cancelButtonContent: '<i class="fa fa-times"></i>',
      },
      edit: {
        confirmSave: true,
        editButtonContent: '<i class="fa fa-pencil"></i>',
        saveButtonContent: '<i class="fa fa-floppy-o"></i>',
        cancelButtonContent: '<i class="fa fa-times"></i>',
      },
      delete: {
        confirmDelete: true,
        deleteButtonContent: '<i class="fa fa-trash"></i>',
        saveButtonContent: '<i class="fa fa-floppy-o"></i>',
        cancelButtonContent: '<i class="fa fa-times"></i>',
      },
      columns: {
        name: {
          title: await this.trans.get('PAGES.Materials.name').toPromise(),
          type: 'text'
        },
        quantity: {
          title: await this.trans.get('PAGES.Materials.quantity').toPromise(),
          filter: {
            type: 'custom',
            component: FilterInputComponent
          },
          editor: {
            type: 'custom',
            component: EditorInputNumberComponent
          },
          valuePrepareFunction: (value) => {
            return value;
          },
        },
        createdAt: {
          title: await this.trans.get('PAGES.Materials.date').toPromise(),
          valuePrepareFunction: (value) => {
            const newVal = moment.utc(value).format('YYYY-MM-DD hh:mm a');
            return newVal;
            // return value;
          },
          filter: {
            type: 'custom',
            component: FilterDaterangeInputComponent,
          },
          editor: {
            type: 'custom',
            component: '<span></span>'
          },
          filterFunction: (cell: any, search?: string) => {
            return true;
          },
          editable: false
        },
      },
      // actions: {
      //   columnTitle: ''
      // },
      pager: {
        display : true,
        perPage: 5
      },
    }
    this.loadTableData(this.materialService.materials);
  }

}
