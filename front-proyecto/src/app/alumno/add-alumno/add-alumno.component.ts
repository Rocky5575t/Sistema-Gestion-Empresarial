
import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { Provincia } from 'src/app/shared/interfaces/provincia';
import { Alumno } from '../../shared/interfaces/alumno';
import { CiclosService } from 'src/app/services/ciclos.service';
import { EntidadesService } from 'src/app/services/entidades.service';
import { Ciclo } from 'src/app/shared/interfaces/ciclo';
import { Entidad } from 'src/app/shared/interfaces/entidad';
import { AlumnosService } from 'src/app/services/alumno.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CLOSE, INVALID_FORM,ALUMNO_ALUMNO } from 'src/app/shared/messages';
import { MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-add-alumno',
  templateUrl: './add-alumno.component.html',
  styleUrls: ['./add-alumno.component.scss']
})
export class AddAlumnoComponent implements OnInit {
  alumnoForm: FormGroup;
  provincias: Provincia[];
  ciclos: Ciclo[];
  entidades: Entidad[];
  cursos = [1, 2];


  ALUMNO: String;





  constructor(public dialogRef: MatDialogRef<AddAlumnoComponent>,
    private snackBar: MatSnackBar,
    private servicioProvincia: ProvinciasService,
    private servicioCiclos: CiclosService,
    private servicioCentros: EntidadesService,
    private servicioAlumnos: AlumnosService,

  ) { }

  ngOnInit(): void {
  this.alumnoForm = new FormGroup({
    nif_nie: new FormControl(null, Validators.required),
    nombre: new FormControl(null, Validators.required),
    apellidos: new FormControl(null, Validators.required),
    fecha_nacimiento: new FormControl(null, Validators.required),
    id_entidad_centro: new FormControl(null, Validators.required), //Necesita metodo para mostrar -- listo getAllEntidades
    id_ciclo: new FormControl(null, Validators.required), //Necesita metodo para mostrar -- listo
    curso: new FormControl(null, Validators.required),
    telefono: new FormControl(null, Validators.required),

    direccion: new FormControl(null),
    cp: new FormControl(null),
    localidad: new FormControl(null),
    id_provincia: new FormControl(null), //Necesita metodo para mostrar -- listo
    observaciones: new FormControl(null)
  });
  this.ALUMNO = ALUMNO_ALUMNO
  }

  async confirmAdd(){
    if (this.alumnoForm.valid) {
      const alumnoCreado = this.alumnoForm.value as Alumno;

      const RESPONSE = await this.servicioAlumnos.addAlumno(alumnoCreado).toPromise();
      if (RESPONSE.ok) {
        this.snackBar.open(RESPONSE.message, CLOSE, {duration:5000});
        this.dialogRef.close({ok: RESPONSE.ok, data: RESPONSE.data});
      } else {
        this.snackBar.open(RESPONSE.message,CLOSE,{duration:5000});
      }

    }else{
      this.snackBar.open(INVALID_FORM,CLOSE,{duration:5000});
    }
  }







  //Muetra el listado de provincias pero no mete

  async getProvincias(){
    const RESPONSE = await this.servicioProvincia.getAllProvincias().toPromise();
    if (RESPONSE.ok) {
      this.provincias = RESPONSE.data as Provincia[];
    }
  }



  async getCiclos(){
    const RESPONSE = await this.servicioCiclos.getAllCiclos().toPromise();
    if (RESPONSE.ok) {
      this.ciclos = RESPONSE.data as Ciclo[];
    }
  }

  async getEntidadCentros(){
    const RESPONSE = await this.servicioCentros.getAllEntidades().toPromise();
    if (RESPONSE.ok) {
      this.entidades = RESPONSE.data as Entidad[];
    }
  }

  onClick(){
    this.dialogRef.close({ok:false})
  }


}
