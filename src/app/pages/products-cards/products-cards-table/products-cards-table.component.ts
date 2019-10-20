import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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
export class ProductsCardsTableComponent implements OnInit {
  displayedColumns = [];

  displayedColumnsNames = [];

  displayedColumnsFilters = [];

  dataSource: MatTableDataSource<any>;
  expandedElement: any;

  productsCards = [];
  columnsToDisplay = [];
  filtersToDisplay = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor() { }

  ngOnInit() {
    // initilize table columns 
    this.initTableColumns();
    this.productsCards = [
      {
        productionDate : '2-2-2019', 
        name: 'product1', 
        code: 'eqeq' ,
        dimensions: '200x800', 
        paintMix: 'code1', 
        engobMix: 'code2',
        bodyMix: 'code3'
      },
      {
        productionDate : '2-2-2019', 
        name: 'product1', 
        code: 'eqeq' ,
        dimensions: '200x800', 
        paintMix: 'code1', 
        engobMix: 'code2',
        bodyMix: 'code3'
      },
      {
        productionDate : '2-2-2019', 
        name: 'product2', 
        code: 'eqeq' ,
        dimensions: '200x800', 
        paintMix: 'code1', 
        engobMix: 'code2',
        bodyMix: 'code3'
      },
      {
        productionDate : '2-2-2019', 
        name: 'product3', 
        code: 'eqeq' ,
        dimensions: '200x800', 
        paintMix: 'code1', 
        engobMix: 'code2',
        bodyMix: 'code3'
      }
    ];
    this.dataSource = new MatTableDataSource(this.productsCards);
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
    ];

    this.displayedColumnsNames = this.displayedColumns.map(col => col.name);
    this.displayedColumnsNames.unshift('actions');
    this.displayedColumnsFilters = this.displayedColumns.map(col => col.filterTitle);
    this.displayedColumnsFilters.unshift('actionsFilter');


    this.columnsToDisplay = this.displayedColumnsNames.slice(0, 4);
    this.filtersToDisplay = this.displayedColumnsFilters.slice(0, 4);
  }

  onSelectionColumn(): void {
    console.log('selected ', this.columnsToDisplay);
    this.filtersToDisplay = this.columnsToDisplay.map(item => `${item}Filter`);
  }

}
