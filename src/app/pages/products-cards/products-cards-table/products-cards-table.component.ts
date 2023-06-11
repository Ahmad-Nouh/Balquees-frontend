import { CommonService } from './../../../services/common.service';
import { Component, OnInit, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges, Input, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductsCardsService } from '../../../services/products-cards.service';
import { TranslateServiceOur } from '../../../services/our-translate.service';
import { TranslateService } from '@ngx-translate/core';
var moment = require('moment');
var momentRange = require('moment-range');
momentRange.extendMoment(moment);


@Component({
  selector: 'app-products-cards-table',
  templateUrl: './products-cards-table.component.html',
  styleUrls: ['./products-cards-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductsCardsTableComponent implements OnInit, OnChanges, AfterViewInit {
 
  @Output('onCreate') onCreate = new EventEmitter();
  @Output('onView') onView = new EventEmitter();
  @Output('onDelete') onDelete = new EventEmitter();
  @Output('onEdit') onEdit = new EventEmitter();
  @Input('datasource') datasource = [];
 
  displayedColumns = [];
  allColumns = [
    { name: 'actions', title: 'PAGES.Common.actions', filterTitle: 'filterTitle', index: 1},
    { name: 'productionDate', title: 'PAGES.Common.productionDate', filterTitle: 'productionDateFilter', index: 2 },
    { name: 'productName', title: 'PAGES.Common.name', filterTitle: 'productNameFilter', index: 3 },
    { name: 'code', title: 'PAGES.Common.code', filterTitle: 'codeFilter', index: 4 },
    { name: 'type', title: 'PAGES.Common.type', filterTitle: 'typeFilter', index: 5 },
    { name: 'glize', title: 'PAGES.Common.glize', filterTitle: 'glizeFilter', index: 6 },
    { name: 'dimensions', title: 'PAGES.Common.dimensions', filterTitle: 'dimensionsFilter', index: 7 },
    { name: 'paintMix', title: 'PAGES.Common.paintMix', filterTitle: 'paintMixFilter', index: 8 },
    { name: 'engobMix', title: 'PAGES.Common.engobMix', filterTitle: 'engobMixFilter', index: 9 },
    { name: 'bodyMix', title: 'PAGES.Common.bodyMix', filterTitle: 'bodyMixFilter', index: 10 },
  ];

  dataSource: MatTableDataSource<any>;
  expandedElement: any;

  productsCards = [];
  columnsToDisplay = [];
  filtersToDisplay = [];
  prevColumns = [];

  filteredData = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  maximumColumnValidationMessage = 'You can choose 5 columns maximum';
  showAlert = false;

  columnsValues = {};

  constructor(private commonService: CommonService,
              public productsCardsService: ProductsCardsService,
              private translate: TranslateServiceOur,
              private trans: TranslateService) { }

  ngOnInit() {
    this.productsCardsService.onProductCardsChange
      .subscribe(() => {
        this.refreshTable(this.productsCardsService.productCards);
      });

    // initilize table columns 
    this.initTableColumns();

    this.filteredData = this.productsCardsService.productCards.slice();
    this.refreshTable(this.productsCardsService.productCards);
  }

  ngAfterViewInit(): void {
    this.translate.changeLang
      .subscribe(async(currentLang: string) => {
        this.trans.use(currentLang);
        // moment.locale(this.translate.currentLanguage);
      });
  }

  initTableColumns(): void {
    this.displayedColumns = [
      { name: 'productionDate', title: 'PAGES.Common.productionDate', filterTitle: 'productionDateFilter' , type: 'datepicker'},
      { name: 'productName', title: 'PAGES.Common.name', filterTitle: 'productNameFilter', type: 'text' },
      { name: 'code', title: 'PAGES.Common.code', filterTitle: 'codeFilter', type: 'text' },
      { name: 'type', title: 'PAGES.Common.type', filterTitle: 'typeFilter', type: 'selectType' },
      { name: 'glize', title: 'PAGES.Common.glize', filterTitle: 'glizeFilter', type: 'selectGlize' },
      { name: 'dimensions', title: 'PAGES.Common.dimensions', filterTitle: 'dimensionsFilter', type: 'text' },
      { name: 'paintMix', title: 'PAGES.Common.paintMix', filterTitle: 'paintMixFilter', type: 'text' },
      { name: 'engobMix', title: 'PAGES.Common.engobMix', filterTitle: 'engobMixFilter', type: 'text' },
      { name: 'bodyMix', title: 'PAGES.Common.bodyMix', filterTitle: 'bodyMixFilter', type: 'text' },
      // { name: 'actions', title: 'Actions', filterTitle: 'filterTitle'}
    ];

    this.columnsToDisplay = this.displayedColumns.map(col => col.name);
    this.filtersToDisplay = this.displayedColumns.map(col => col.filterTitle);
    this.columnsToDisplay.unshift('actions');
    this.filtersToDisplay.unshift('actionsFilter');
    this.prevColumns = this.columnsToDisplay.slice();
  }

  onSelectionColumn(): void {
    // validate number of columns
    if (this.columnsToDisplay.length > 10) {
      this.columnsToDisplay = this.prevColumns.slice();
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    }

    this.prevColumns = this.columnsToDisplay.slice();
    // sort columns
    this.columnsToDisplay = this.columnsToDisplay
    .sort((a, b) => {
      const index1 = this.allColumns.find(item => item.name === a).index;
      const index2 = this.allColumns.find(item => item.name === b).index;
      return index1 > index2 ? 1 : index1 < index2 ? -1 : 0;
    });
    // determine whitch filters columns to display
    this.filtersToDisplay = this.columnsToDisplay.map(item => `${item}Filter`);
  }

  filterTable(data: {column: string, value: any}): void {
    console.log('change ', data);
    this.columnsValues[data.column] = data.value;
    this.filteredData = this.productsCardsService.productCards.slice()
    .filter((row: any) => {
      const counter = this.filterRow(row);
      return counter === this.columnsToDisplay.length;
    });
    console.log(this.columnsValues)

    this.refreshTable(this.filteredData);
  }

  filterRow(row) {
    let counter = 0;
      for (const col of this.columnsToDisplay) {
        const val = this.columnsValues[col];

        switch(col) {
          case 'productName':
          case 'code':
          case 'type':
          case 'glize':
            if (!val || val === '' || row[col].indexOf(val) >= 0) {
              counter++;
            }
            break;
          case 'paintMix':
          case 'engobMix':
          case 'bodyMix':
            if (!val || val === '' || row[col].code.indexOf(val) >= 0) {
              counter++;
            }
            break;
          case 'dimensions':
            if (!val || val === '') {
              counter++;
            } else {
              const width = row[col].width;
              const height = row[col].height;
              const dimensions = `${width} x ${height}`;
              if (dimensions.indexOf(val) >= 0) {
                counter++;
              }
            }
            break;
          case 'productionDate':
            if (!val) {
              console.log('fats');
              counter++;
            } else if (val.start && val.end) {
              const cellDate = moment(row[col]);
              const startDate = moment(val.start);
              const endDate = moment(val.end);
              const range = moment().range(startDate, endDate)
              if (range.contains(cellDate)) {
                counter++;
              }
            } else {
              counter++;
            }
            break;

          default:
            counter++;
        }
      }
      return counter;
  }

  refreshTable(data: any): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onClickCreate(): void {
    this.onCreate.emit(true);
  }

  onClickEdit(element): void {
    this.onEdit.emit(element);
  }

  onClickView(element): void {
    this.onView.emit(element);
  }

  onClickDelete(element): void {
    this.onDelete.emit(element);
  }

  getValueOfColumn(element: any, column): string {
    let value = '';
    switch(column) {
      case 'dimensions':
        value = `${element.width} x ${element.height}`;
        break;
      case 'paintMix':
      case 'engobMix':
      case 'bodyMix':
        value = element.code;
        break;

      case 'productionDate':
        value = this.commonService.convertFromUTCtoLocalDate(element.toString(), false);
        break;
      
      default:
        value = element
    }

    return value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes ', changes);
    if (changes.datasource) {
      this.refreshTable(this.productsCardsService.productCards.slice())
    }
  }

}
