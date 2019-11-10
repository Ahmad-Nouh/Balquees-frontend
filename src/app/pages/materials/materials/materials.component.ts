import { WarehouseService } from './../../../services/warehouse.service';
import { CommonService } from './../../../services/common.service';
import { Material } from './../../../models/material';
import { MaterialsService } from './../../../services/materials.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FilterDaterangeInputComponent } from '../../../shared/components/filter-daterange-input/filter-daterange-input.component';
import { FilterInputComponent } from '../../../shared/components/filter-input/filter-input.component';
import { EditorInputNumberComponent } from '../../../shared/components/editor-input-number/editor-input-number.component';
import { TranslateServiceOur } from '../../../services/our-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ee-ng-smart-table';
import { Warehouse } from '../../../models/Warehouse';

var moment = require('moment');
var momentRange = require('moment-range');
momentRange.extendMoment(moment);


@Component({
  selector: 'app-warehouses',
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
        editable: false,
        sort: true,
        sortDirection: 'desc'
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

  clayData: LocalDataSource;
  paintData: LocalDataSource;

  constructor(public materialService: MaterialsService,
    public translate: TranslateServiceOur,
    private trans: TranslateService,
    public warehouseService: WarehouseService,
    private commonService: CommonService) { }

  async ngOnInit() {
    // load data tables (clay & paint)
    this.loadDataTables();

    // translate tables
    this.trans.use(this.translate.currentLanguage);
    await this.initSettingTranslation();

    // load data tables (clay & paint)
    this.loadDataTables();
    
  }

  ngAfterViewInit(): void {
    this.translate.changeLang
      .subscribe(async(currentLang: string) => {
        this.trans.use(currentLang);
        await this.initSettingTranslation();
        this.loadDataTables()
      }); 
  }

  loadDataTables(): void {
    // load clay data table
    this.loadClayData();

    // load paint data table
    this.loadPaintData();
  }

  loadTableData(data: Array<any>, isClay: boolean): void {
    if (isClay) {
      this.clayData = new LocalDataSource(data);
    } else {
      this.paintData = new LocalDataSource(data);
    }
  }

  onDeleteConfirm(event) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.materialService.deleteMaterial(event.data._id)
        .subscribe((result) => {
          // remove from materials array
          this.materialService.removeFromArray(result);
          // remove from warehouse map
          this.materialService.removeFromMap(event.data.warehouse._id, event.data);
          // remove from ui
          event.confirm.resolve();
        });
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event, warehouse: Warehouse) {
    console.log("Create Event In Console")
    const newMaterial: Material = {
      name: event.newData.name,
      quantity: event.newData.quantity,
      warehouse: warehouse._id
    };
    this.materialService.createMaterial(newMaterial)
      .subscribe((result: any) => {
        event.confirm.resolve(result);
        this.materialService.addToArray(result);
        this.materialService.addToWarehouseMap(warehouse._id, result);
        this.loadDataTables();
      });
  }

  onSaveConfirm(event, isClay: boolean) {
    console.log(event);
    console.log(event.data._id);

    const temp: Material = {
      name: event.newData.name,
      quantity: event.newData.quantity,
      warehouse: event.data.warehouse._id,
    };

    this.materialService.updateMaterial(event.data._id, temp)
        .subscribe((result) => {
          event.confirm.resolve();
          const index = this.materialService.materials
          .findIndex((mat: Material) => mat._id == result._id);
          console.log('index ', index);
          this.materialService.materials[index] = result;
          if (isClay) {
            this.materialService.updateInMap(0, result);
            this.loadClayData();
          } else {
            this.materialService.updateInMap(1, result);
            this.loadPaintData();
          }
        });
  }


  handleChangeTab(event): void {
    console.log('event ', event);
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
            return this.commonService.convertFromUTCtoLocalDate(value);
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
          editable: false,
          sort: true,
          sortDirection: 'desc'
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
  }

  loadClayData(): void {
    const clayData = this.materialService.getClayMaterials();
    this.loadTableData(clayData, true);
  }

  loadPaintData(): void {
    const paintData = this.materialService.getPaintMaterials();
    this.loadTableData(paintData, false);
  }

}
