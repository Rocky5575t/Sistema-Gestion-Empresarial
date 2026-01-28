export interface Alumno {
  id_alumno: number;
  nif_nie: string;
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;  // date -> string en JSON
  id_entidad_centro: number;
  id_ciclo: number;
  curso: number;
  telefono: string;

  direccion?: string;
  cp?: string;
  localidad?: string;
  id_provincia?: number;
  observaciones?: string;
}
