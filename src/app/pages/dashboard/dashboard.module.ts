import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    DashboardRoutingModule,
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
