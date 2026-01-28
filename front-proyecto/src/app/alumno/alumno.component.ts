import { Component, OnInit, ViewChild } from '@angular/core';
// Angular Material: tabla, paginador, ordenación, diálogos
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
// Overlay permite abrir diálogos sin que la página se mueva
import { Overlay } from '@angular/cdk/overlay';
// Formularios reactivos para filtros
import { FormControl } from '@angular/forms';
// Selección de filas (aunque aquí usamos solo una selección)
import { SelectionModel } from '@angular/cdk/collections';

// Interfaz del alumno
import { Alumno } from '../shared/interfaces/alumno';
// Servicio que se comunica con la API de alumnos
import { AlumnosService } from '../services/alumno.service';

// Componentes de diálogo para CRUD
import { AddAlumnoComponent } from './add-alumno/add-alumno.component';
import { EditAlumnoComponent } from './edit-alumno/edit-alumno.component';
import { DeleteAlumnoComponent } from './delete-alumno/delete-alumno.component';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.css']
})
export class AlumnosComponent implements OnInit {

  // Referencias a los componentes de paginación y ordenación de Angular Material
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // DataSource de la tabla: contiene los alumnos a mostrar
  dataSource = new MatTableDataSource<Alumno>();
  // SelectionModel permite seleccionar filas de la tabla (aquí solo seleccionamos una fila)
  selection = new SelectionModel<Alumno>(false);

  // FormControls para los filtros de búsqueda
  idFilter = new FormControl('');
  nombreFilter = new FormControl('');
  apellidosFilter = new FormControl('');
  cursoFilter = new FormControl('');


  isChecked = false;
  isCheckedAll = false;
  pageSizeChecked: number;
  pageIndexChecked: number;

  // Objeto que guarda los valores de los filtros
  filterValues = { id_alumno: '', nombre: '', apellidos: '', curso: '' };

  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['id_alumno', 'nombre', 'apellidos', 'curso', 'telefono', 'actions'];

  constructor(
    private alumnosService: AlumnosService, // Servicio que trae los alumnos desde la API
    public dialog: MatDialog,               // Para abrir los diálogos de CRUD
    private overlay: Overlay                // Para controlar cómo se abre el diálogo
  ) {}

  ngOnInit(): void {
    // Al iniciar el componente:
    this.loadAlumnos();   // Cargar los alumnos desde la API
    this.setupFilters();  // Configurar los filtros reactivos
  }

  // ---------------------------------------
  // Función para cargar los alumnos
  // ---------------------------------------
  async loadAlumnos() {
    // Llamada al servicio que devuelve todos los alumnos
    const response = await this.alumnosService.getAll().toPromise();
    if (response.ok) {
      // Guardamos la lista en el servicio (opcional, para cache local)
      this.alumnosService.alumnos = response.data as Alumno[];
      // La asignamos al dataSource de la tabla
      this.dataSource.data = this.alumnosService.alumnos;
      // Conectar ordenación y paginación
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // Configuramos la función de filtrado personalizada
      this.dataSource.filterPredicate = this.createFilter();
    }
  }

  // ---------------------------------------
  // Abrir diálogo para agregar un alumno
  // ---------------------------------------
  async addAlumno() {
    const dialogRef = this.dialog.open(AddAlumnoComponent, {
      scrollStrategy: this.overlay.scrollStrategies.noop(), // evita que la página se mueva
      disableClose: true // evita cerrar el diálogo haciendo click fuera
    });
    const result = await dialogRef.afterClosed().toPromise(); // esperar hasta cerrar
    if (result?.ok) this.loadAlumnos(); // si se agregó correctamente, recargamos la tabla
  }

  // ---------------------------------------
  // Abrir diálogo para editar un alumno
  // ---------------------------------------
  async editAlumno(alumno: Alumno) {
    const dialogRef = this.dialog.open(EditAlumnoComponent, {
      data: alumno, // pasamos los datos del alumno al diálogo
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: true
    });
    const result = await dialogRef.afterClosed().toPromise();
    if (result?.ok) this.loadAlumnos(); // si se editó correctamente, recargamos la tabla
  }

  // ---------------------------------------
  // Abrir diálogo para eliminar un alumno
  // ---------------------------------------
  async deleteAlumno(alumno: Alumno) {
    const dialogRef = this.dialog.open(DeleteAlumnoComponent, {
      data: alumno, // pasamos el alumno a eliminar
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    const result = await dialogRef.afterClosed().toPromise();
    if (result?.ok) this.loadAlumnos(); // si se eliminó correctamente, recargamos la tabla
  }

  // ---------------------------------------
  // Función personalizada de filtrado
  // ---------------------------------------
  createFilter(): (alumno: Alumno, filter: string) => boolean {
    return (alumno: Alumno, filter: string): boolean => {
      const search = JSON.parse(filter);
      // Compara cada campo con el filtro correspondiente
      return alumno.id_alumno.toString().includes(search.id_alumno)
        && alumno.nombre.toLowerCase().includes(search.nombre.toLowerCase())
        && alumno.apellidos.toLowerCase().includes(search.apellidos.toLowerCase())
        && alumno.curso.toString().includes(search.curso);
    };
  }

  // ---------------------------------------
  // Conectar los FormControls a la función de filtrado
  // ---------------------------------------
  setupFilters() {
    this.idFilter.valueChanges.subscribe(val => {
      this.filterValues.id_alumno = val;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    this.nombreFilter.valueChanges.subscribe(val => {
      this.filterValues.nombre = val;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    this.apellidosFilter.valueChanges.subscribe(val => {
      this.filterValues.apellidos = val;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    this.cursoFilter.valueChanges.subscribe(val => {
      this.filterValues.curso = val;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
  }

  changePage() {
    if (this.isCheckedAll) {
      this.isChecked = true;
    } else {
      this.isChecked = (((this.pageIndexChecked + 1) * this.pageSizeChecked) /
      ((this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize)) >= 1;
    }
  }
}
