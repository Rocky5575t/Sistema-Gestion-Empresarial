// servicios/vacante.service.ts
// Este servicio se encarga de comunicar el frontend con la API de Vacantes

import { Injectable } from '@angular/core';
import { Vacante } from '../shared/interfaces/vacante'; // Interfaz Vacante
import { ApiResponse } from '../shared/interfaces/api-response'; // Interfaz de respuesta genérica
import { HttpClient } from '@angular/common/http'; // HttpClient de Angular
import { CommonService } from '../shared/common.service'; // Servicio común con headers
import { URL_API2 } from 'src/environments/environment'; // URL base de la API

// Endpoint específico para vacantes
const ENDPOINT = 'vacantes';

@Injectable({
  providedIn: 'root' // Angular lo inyecta automáticamente en toda la app
})
export class VacantesService {

  // Array local de vacantes (opcional, para cachear)
  vacantes: Vacante[];

  constructor(private http: HttpClient, private commonService: CommonService) { }

  // -----------------------------
  // Obtener todas las vacantes
  // -----------------------------
  getAll() {
    return this.http.get<ApiResponse>(`${URL_API2}/${ENDPOINT}`, {
  headers: this.commonService.getHeaders()
});
  }

// -----------------------------
// Crear una nueva vacante
// -----------------------------
addVacante(vacante: Vacante) {
  return this.http.post<ApiResponse>(`${URL_API2}/${ENDPOINT}`, vacante, {
    headers: this.commonService.headers
  });
}

// -----------------------------
// Editar una vacante existente
// -----------------------------
editVacante(vacante: Vacante) {
  // FastAPI espera el ID en la URL
  return this.http.put<ApiResponse>(`${URL_API2}/${ENDPOINT}/${vacante.id_vacante}`, vacante, {
    headers: this.commonService.headers
  });
}

// -----------------------------
// Eliminar una vacante
// -----------------------------
deleteVacante(id: number | string) {
  // FastAPI espera el ID en la URL, no en query params
  return this.http.delete<ApiResponse>(`${URL_API2}/${ENDPOINT}/${id}`, {
    headers: this.commonService.headers
  });
}
}
