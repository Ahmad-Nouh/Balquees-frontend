import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent implements OnInit {
  settings = {
    actions: false,
    columns: {
      name: {
        title: 'Name'
      },
      quantity: {
        title: 'Quantity',
        valuePrepareFunction: (value) => {
          return value + ' Kilo';
        },
      },
      consumptionPerDay: {
        title: 'Consumption Per Day',
        valuePrepareFunction: (value) => {
          return value + 'Kilo';
        },
      },
      consumptionPerMonth: {
        title: 'Consumption Per Month',
        valuePrepareFunction: (value) => {
          return value + ' Kilo';
        },
      },
      remainingTime: {
        title: 'Remaining Time',
        valuePrepareFunction: (value) => {
          const totalDays = Math.floor(value);
          const months = Math.floor(totalDays / 30);
          const days = Math.floor(totalDays % 30);
          return `${months} Months and ${days} Days`;
        },
      }
    },
    // actions: {
    //   columnTitle: ''
    // },
    pager: {
      display : true,
      perPage: 8
    },
    mode: 'inline',
    
  };

  @Input('source') source: Array<any> = [];

  constructor() { }

  ngOnInit() {
  }

}
