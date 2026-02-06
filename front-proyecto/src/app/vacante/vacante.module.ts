import { NgModule } from "@angular/core";
import { EditVacanteComponent } from "./edit-vacante/edit-vacante.component";
import { AddVacanteComponent } from "./add-vacante/add-vacante.component";
import { DeleteVacanteComponent } from "./delete-vacante/delete-vacante.component";
import { VacanteComponent } from "./vacante.component";
import { CommonModule } from "@angular/common";
import { VacantesRoutingModule } from "../app/vacantes/vacantes-routing.module";
import { CrudMaterialModule } from "../modules/crud-material/crud-material.module";


@NgModule({
  declarations:[EditVacanteComponent,AddVacanteComponent,DeleteVacanteComponent,VacanteComponent],
  imports: [
    CommonModule,VacantesRoutingModule,CrudMaterialModule
  ]


})
export class Vacantemodule{}
