// servicios/alumno.service.ts
import { Injectable } from '@angular/core';
import { Alumno } from '../shared/interfaces/alumno'; // Interfaz Alumno
import { ApiResponse } from '../shared/interfaces/api-response'; // Interfaz de respuesta genérica
import { HttpClient, HttpParams } from '@angular/common/http'; // HttpClient de Angular
import { CommonService } from '../shared/common.service'; // Servicio común con headers
import { URL_API } from 'src/environments/environment'; // URL base de la API

// Endpoint específico para alumnos
const ENDPOINT = 'alumnos';

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
    return this.http.get<ApiResponse>(`http://127.0.0.1:8000/alumnos`, { headers: this.commonService.getHeaders() });
  }

  // -----------------------------
  // Crear un nuevo alumno
  // -----------------------------
  addAlumno(alumno: Alumno) {
  return this.http.post<{ok: boolean, message: string, data: Alumno}>(`http://127.0.0.1:8000/alumnos`, alumno, {
    headers: this.commonService.getHeaders()
  });
}

  // -----------------------------
  // Editar un alumno existente
  // -----------------------------
  editAlumno(alumno: Alumno) {
  return this.http.put<ApiResponse>(
    `http://127.0.0.1:8000/alumnos/${alumno.id_alumno}`, // ✅ URL con id
    alumno, // ✅ enviar objeto directamente
    { headers: this.commonService.getHeaders() }
  );
}



  // -----------------------------
  // Eliminar un alumno
  // -----------------------------
  deleteAlumno(id: number | string) {
  return this.http.delete<{ok: boolean, message?: string}>(`http://127.0.0.1:8000/alumnos/${id}`, {
    headers: this.commonService.headers
  });
}
}
