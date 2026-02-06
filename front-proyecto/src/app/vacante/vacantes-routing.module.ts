import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacanteComponent } from './vacante.component';

const routes: Routes = [
  { path: '', component: VacanteComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacantesRoutingModule {}
