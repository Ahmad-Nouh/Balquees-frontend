import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products-cards',
  templateUrl: './products-cards.component.html',
  styleUrls: ['./products-cards.component.scss']
})
export class ProductsCardsComponent implements OnInit {
  isFlipped = false;
  formTitle = 'PAGES.ProductsCards.productsCards';
  data = [];
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
      },
      name: {
        title: 'Name',
      },
      code: {
        title: 'Code',
      },
      type: {
        title: 'Type',
      },
      glize: {
        title: 'Glize',
      },
      components: {
        filter: false,
        editable: true,
        type: 'custom',
        renderComponent: `<button>details</button>`
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

  constructor() { }

  ngOnInit() {
  }

  onClickBack(): void {
    this.isFlipped = false;
  }

  onSubmit(): void {
    console.log('submited');
  }

  onCreateProductCard(): void {
    console.log('create');
  }

  onDeleteProductCard(): void {
    console.log('delete');
  }

  onEditProductCard(): void {
    console.log('edit');
  }
}
