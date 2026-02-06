import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Alumno } from '../../shared/interfaces/alumno';
import { AlumnosService } from 'src/app/services/alumno.service';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { CiclosService } from 'src/app/services/ciclos.service';
import { EntidadesService } from 'src/app/services/entidades.service';
import { Provincia } from 'src/app/shared/interfaces/provincia';
import { Ciclo } from 'src/app/shared/interfaces/ciclo';
import { Entidad } from 'src/app/shared/interfaces/entidad';
import { CLOSE, INVALID_FORM, ALUMNO_ALUMNO, ERROR } from 'src/app/shared/messages';

@Component({
  selector: 'app-edit-alumno',
  templateUrl: './edit-alumno.component.html',
  styleUrls: ['./edit-alumno.component.scss']
})
export class EditAlumnoComponent implements OnInit {

  alumnoForm: FormGroup;
  provincias: Provincia[];
  ciclos: Ciclo[];
  entidades: Entidad[];
  cursos = [1, 2];

  ALUMNO: string;

  constructor(
    public dialogRef: MatDialogRef<EditAlumnoComponent>,
    @Inject(MAT_DIALOG_DATA) public alumno: Alumno,
    private snackBar: MatSnackBar,
    private servicioProvincia: ProvinciasService,
    private servicioCiclos: CiclosService,
    private servicioCentros: EntidadesService,
    private servicioAlumnos: AlumnosService
  ) { }

  ngOnInit(): void {
    this.ALUMNO = ALUMNO_ALUMNO;

    // Inicializa formulario con valores existentes
    this.alumnoForm = new FormGroup({
      nif_nie: new FormControl(this.alumno.nif_nie, Validators.required),
      nombre: new FormControl(this.alumno.nombre, Validators.required),
      apellidos: new FormControl(this.alumno.apellidos, Validators.required),
      fecha_nacimiento: new FormControl(this.alumno.fecha_nacimiento, Validators.required),
      id_entidad_centro: new FormControl(this.alumno.id_entidad_centro, Validators.required),
      id_ciclo: new FormControl(this.alumno.id_ciclo, Validators.required),
      curso: new FormControl(this.alumno.curso, Validators.required),
      telefono: new FormControl(this.alumno.telefono, Validators.required),

      direccion: new FormControl(this.alumno.direccion),
      cp: new FormControl(this.alumno.cp),
      localidad: new FormControl(this.alumno.localidad),
      id_provincia: new FormControl(this.alumno.id_provincia),
      observaciones: new FormControl(this.alumno.observaciones)
    });

    // Carga selects
    this.getProvincias();
    this.getCiclos();
    this.getEntidadCentros();
  }

  // Confirmar edición
  confirmEdit(): void {
    if (this.alumnoForm.valid) {
      const alumnoActualizado = { ...this.alumno, ...this.alumnoForm.value };

      // Usamos subscribe para manejar la respuesta de manera reactiva
      this.servicioAlumnos.editAlumno(alumnoActualizado).subscribe({
        next: (RESPONSE: any) => {
          if (RESPONSE.ok) {
            this.snackBar.open(RESPONSE.message || 'Alumno modificado correctamente', CLOSE, { duration: 5000 });
            this.dialogRef.close({ ok: true, data: RESPONSE.data });
          } else {
            this.snackBar.open(RESPONSE.message || ERROR, CLOSE, { duration: 5000 });
          }
        },
        error: (err) => {
          console.error('Error al modificar alumno', err);
          this.snackBar.open('Error al conectar con el servidor', CLOSE, { duration: 5000 });
        }
      });
    } else {
      this.snackBar.open(INVALID_FORM, CLOSE, { duration: 5000 });
    }
  }

  async getProvincias() {
    const RESPONSE = await this.servicioProvincia.getAllProvincias().toPromise();
    if (RESPONSE.ok) this.provincias = RESPONSE.data as Provincia[];
  }

  async getCiclos() {
    const RESPONSE = await this.servicioCiclos.getAllCiclos().toPromise();
    if (RESPONSE.ok) this.ciclos = RESPONSE.data as Ciclo[];
  }

  async getEntidadCentros() {
    const RESPONSE = await this.servicioCentros.getAllEntidades().toPromise();
    if (RESPONSE.ok) this.entidades = RESPONSE.data as Entidad[];
  }

  onNoClick(): void {
    this.dialogRef.close({ ok: false });
  }

}
