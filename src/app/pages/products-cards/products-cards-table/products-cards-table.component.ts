import { CommonService } from './../../../services/common.service';
import { Component, OnInit, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductsCardsService } from '../../../services/products-cards.service';

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
export class ProductsCardsTableComponent implements OnInit, OnChanges {
 
  @Output('onCreate') onCreate = new EventEmitter();
  @Output('onEdit') onEdit = new EventEmitter();
  @Output('onDelete') onDelete = new EventEmitter();
  @Input('datasource') datasource = [];
 
  displayedColumns = [];
  allColumns = [
    { name: 'actions', title: 'Actions', filterTitle: 'filterTitle', index: 1},
    { name: 'productionDate', title: 'Production Date', filterTitle: 'productionDateFilter', index: 2 },
    { name: 'name', title: 'Name', filterTitle: 'nameFilter', index: 3 },
    { name: 'code', title: 'Code', filterTitle: 'codeFilter', index: 4 },
    { name: 'dimensions', title: 'Dimensions', filterTitle: 'dimensionsFilter', index: 5 },
    { name: 'paintMix', title: 'Paint Mix', filterTitle: 'paintMixFilter', index: 6 },
    { name: 'engobMix', title: 'Engob Mix', filterTitle: 'engobMixFilter', index: 7 },
    { name: 'bodyMix', title: 'Body Mix', filterTitle: 'bodyMixFilter', index: 8 },
    { name: 'paintType', title: 'Paint Type', filterTitle: 'paintTypeFilter', index: 9 },
    { name: 'engobType', title: 'Engob Type', filterTitle: 'engobTypeFilter', index: 10 },
    { name: 'bodyType', title: 'Body Type', filterTitle: 'bodyTypeFilter', index: 11 }
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
              public productsCardsService: ProductsCardsService) { }

  ngOnInit() {
    // initilize table columns 
    this.initTableColumns();

    this.filteredData = this.productsCardsService.productCards.slice();
    this.dataSource = new MatTableDataSource(this.productsCardsService.productCards);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  initTableColumns(): void {
    this.displayedColumns = [
      { name: 'productionDate', title: 'Production Date', filterTitle: 'productionDateFilter' },
      { name: 'name', title: 'Name', filterTitle: 'nameFilter' },
      { name: 'code', title: 'Code', filterTitle: 'codeFilter' },
      { name: 'dimensions', title: 'Dimensions', filterTitle: 'dimensionsFilter' },
      { name: 'paintMix', title: 'Paint Mix', filterTitle: 'paintMixFilter' },
      { name: 'engobMix', title: 'Engob Mix', filterTitle: 'engobMixFilter' },
      { name: 'bodyMix', title: 'Body Mix', filterTitle: 'bodyMixFilter' },
      // { name: 'actions', title: 'Actions', filterTitle: 'filterTitle'}
      { name: 'paintType', title: 'Paint Type', filterTitle: 'paintTypeFilter' },
      { name: 'engobType', title: 'Engob Type', filterTitle: 'engobTypeFilter' },
      { name: 'bodyType', title: 'Body Type', filterTitle: 'bodyTypeFilter' }
    ];

    this.columnsToDisplay = this.displayedColumns.map(col => col.name).slice(0, 7);
    this.filtersToDisplay = this.displayedColumns.map(col => col.filterTitle).slice(0, 7);
    this.columnsToDisplay.unshift('actions');
    this.filtersToDisplay.unshift('actionsFilter');
    this.prevColumns = this.columnsToDisplay.slice();
  }

  onSelectionColumn(): void {
    // validate number of columns
    if (this.columnsToDisplay.length > 8) {
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
    this.columnsValues[data.column] = data.value;
    this.filteredData = this.productsCardsService.productCards.slice()
    .filter((item: any) => {
      let counter = 0;
      for (const col of this.columnsToDisplay) {
        const val = this.columnsValues[col];
        // if filter is not date => text
        if (col !== 'productionDate') {
          if (!val || val === '' || item[col].indexOf(val) >= 0) {
            counter++;
            console.log(col);
          }
        } else {
          // todo handle date
          counter++;
          console.log(col);
        }
      }
      console.log('counter ', counter);

      return counter === this.columnsToDisplay.length;
    });

    // console.log('filteredData ', this.filteredData);

    this.refreshTable(this.filteredData);
  }

  refreshTable(data: any): void {
    this.dataSource = new MatTableDataSource(data);
  }

  onClickCreate(): void {
    this.onCreate.emit(true);
  }

  onClickEdit(element): void {
    this.onEdit.emit(element);
  }

  onClickDelete(element): void {
    this.onDelete.emit(element);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes ', changes);
    if (changes.datasource) {
      this.dataSource = new MatTableDataSource(this.productsCardsService.productCards.slice());
    }
  }

}
