import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacantesRoutingModule } from './vacantes-routing.module';
import { VacantesComponent } from './vacantes/vacantes.component';
import { AddVacanteComponent } from './add-vacante/add-vacante.component';
import { EditVacanteComponent } from './edit-vacante/edit-vacante.component';
import { DeleteVacanteComponent } from './delete-vacante/delete-vacante.component';


@NgModule({
  declarations: [VacantesComponent, AddVacanteComponent, EditVacanteComponent, DeleteVacanteComponent],
  imports: [
    CommonModule,
    VacantesRoutingModule
  ]
})
export class VacantesModule { }
