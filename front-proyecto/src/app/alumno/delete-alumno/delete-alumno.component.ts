import { Component, Inject, OnInit } from '@angular/core';
import { AlumnosService } from 'src/app/services/alumno.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ALUMNO_ALUMNO, CLOSE } from 'src/app/shared/messages';
import { Alumno } from '../../shared/interfaces/alumno';

@Component({
  selector: 'app-delete-alumno',
  templateUrl: './delete-alumno.component.html',
  styleUrls: ['./delete-alumno.component.scss']
})
export class DeleteAlumnoComponent implements OnInit {

  ALUMNO: string;

  constructor(
    private servicioAlumno: AlumnosService,
    @Inject(MAT_DIALOG_DATA) public alumno: Alumno,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DeleteAlumnoComponent>
  ) { }

  ngOnInit(): void {
    this.ALUMNO = ALUMNO_ALUMNO;
  }

  // Cierra el dialog sin eliminar
  onNoClick(): void {
    this.dialogRef.close({ ok: false });
  }

  // Confirma eliminación
  confirmDelete(): void {
    this.servicioAlumno.deleteAlumno(this.alumno.id_alumno).subscribe({
      next: (RESPONSE: any) => {
        if (RESPONSE.ok) {
          this.snackBar.open(RESPONSE.message || 'Alumno eliminado', CLOSE, { duration: 5000 });
          // Cierra dialog y notifica al componente padre que se eliminó correctamente
          this.dialogRef.close({ ok: true });
        } else {
          this.snackBar.open(RESPONSE.message || 'No se pudo eliminar', CLOSE, { duration: 5000 });
        }
      },
      error: (err) => {
        console.error('Error al eliminar alumno', err);
        this.snackBar.open('Error al conectar con el servidor', CLOSE, { duration: 5000 });
      }
    });
  }

}
