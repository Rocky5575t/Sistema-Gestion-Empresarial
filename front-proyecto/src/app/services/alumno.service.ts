// servicios/alumno.service.ts
import { Injectable } from '@angular/core';
import { Alumno } from '../shared/interfaces/alumno'; // Interfaz Alumno
import { ApiResponse } from '../shared/interfaces/api-response'; // Interfaz de respuesta genérica
import { HttpClient } from '@angular/common/http'; // HttpClient de Angular
import { CommonService } from '../shared/common.service'; // Servicio común con headers
import { URL_API } from 'src/environments/environment'; // URL base de la API

// Endpoint específico para alumnos
const ENDPOINT = 'alumno';

@Injectable({
  providedIn: 'root' // Angular lo inyecta automáticamente en toda la app
})
export class AlumnosService {

  // Array local de alumnos (opcional, para cachear si quieres)
  alumnos: Alumno[];

  constructor(private http: HttpClient, private commonService: CommonService) { }

  // -----------------------------
  // Obtener todos los alumnos
  // -----------------------------
  getAll() {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, {
      headers: this.commonService.headers
    });
  }

  // -----------------------------
  // Crear un nuevo alumno
  // -----------------------------
  addAlumno(alumno: Alumno) {
    const body = JSON.stringify(alumno); // Convertimos el objeto a JSON
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, {
      headers: this.commonService.headers
    });
  }

  // -----------------------------
  // Editar un alumno existente
  // -----------------------------
  editAlumno(alumno: Alumno) {
    const body = JSON.stringify(alumno);
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, {
      headers: this.commonService.headers
    });
  }

  // -----------------------------
  // Eliminar un alumno
  // -----------------------------
  deleteAlumno(id: number | string) {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${id}`, {
      headers: this.commonService.headers
    });
  }
}
