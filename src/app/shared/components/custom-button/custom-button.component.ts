import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { ViewCell } from 'ee-ng-smart-table';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss']
})
export class CustomButtonComponent implements OnInit ,ViewCell{
  @Input() value: any;
  @Input() rowData: any;

  constructor(private dialogService: NbDialogService) { }

  ngOnInit() {
  }

  openDialog(dialog: TemplateRef<any>) {
    console.log('value ', this.value);
    this.dialogService.open(dialog, {
        context: this.value,
      });
  }
}
