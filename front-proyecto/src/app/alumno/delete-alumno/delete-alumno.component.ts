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

  ALUMNO: String;

  constructor(
    public servicioAlumno: AlumnosService,
    @Inject(MAT_DIALOG_DATA) public alumno: Alumno,
    public snackBar: MatSnackBar,
    public dialogRef:MatDialogRef<DeleteAlumnoComponent>

  )
   {   }

  ngOnInit(): void {
    this.ALUMNO = ALUMNO_ALUMNO;
  }

  onNoClick(){
    this.dialogRef.close({ok:false});
  }

  async confirmDelete(){
    const RESPONSE = await this.servicioAlumno.deleteAlumno(this.alumno.id_alumno).toPromise();
    if (RESPONSE.ok) {
      this.snackBar.open(RESPONSE.message, CLOSE, { duration: 5000 });
            this.dialogRef.close({ ok: RESPONSE.ok, data: RESPONSE.data });
    } else { this.snackBar.open(RESPONSE.message, CLOSE, { duration: 5000 }); }
  }

}
