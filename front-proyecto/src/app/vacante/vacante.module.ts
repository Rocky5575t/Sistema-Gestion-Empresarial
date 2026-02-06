import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VacanteComponent } from "./vacante.component";
import { AddVacanteComponent } from "./add-vacante/add-vacante.component";
import { EditVacanteComponent } from "./edit-vacante/edit-vacante.component";
import { DeleteVacanteComponent } from "./delete-vacante/delete-vacante.component";
import { VacantesRoutingModule } from './vacantes-routing.module'; // <- import corregido
import { CrudMaterialModule } from "../modules/crud-material/crud-material.module";

@NgModule({
  declarations: [
    VacanteComponent,
    AddVacanteComponent,
    EditVacanteComponent,
    DeleteVacanteComponent
  ],
  imports: [
    CommonModule,
    VacantesRoutingModule, // <- routing interno
    CrudMaterialModule
  ]
})
export class VacanteModule {}
