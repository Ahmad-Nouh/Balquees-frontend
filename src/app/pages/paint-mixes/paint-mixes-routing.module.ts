import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PaintMixesComponent } from './paint-mixes/paint-mixes.component';


const routes: Routes = [
    {
        path: '',
        component: PaintMixesComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaintMixesRoutingModule {
}
