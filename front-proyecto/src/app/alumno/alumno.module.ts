import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditAlumnoComponent } from './edit-alumno/edit-alumno.component';
import { AddAlumnoComponent } from './add-alumno/add-alumno.component';
import { DeleteAlumnoComponent } from './delete-alumno/delete-alumno.component';
import { AlumnosComponent } from './alumno.component';
import { AlumnosRoutingModule } from './alumno-routing.module';
import { CrudMaterialModule } from '../modules/crud-material/crud-material.module';



@NgModule({
  declarations: [EditAlumnoComponent, AddAlumnoComponent, DeleteAlumnoComponent,AlumnosComponent],
  imports: [
    CommonModule, AlumnosRoutingModule,CrudMaterialModule


  ]
})
export class AlumnoModule { }
