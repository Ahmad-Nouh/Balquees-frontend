import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BodyMixesComponent } from './body-mixes/body-mixes.component';


const routes: Routes = [
    {
        path: '',
        component: BodyMixesComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BodyMixesRoutingModule {
}
