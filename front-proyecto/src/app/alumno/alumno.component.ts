// --------------------------------------------------
// IMPORTS GENERALES DE ANGULAR
// --------------------------------------------------
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

// --------------------------------------------------
// IMPORTS DE ANGULAR MATERIAL (TABLA, PAGINACIÓN, ORDENACIÓN, DIÁLOGOS)
// --------------------------------------------------
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

// --------------------------------------------------
// CDK Y FORMULARIOS REACTIVOS
// --------------------------------------------------
import { Overlay } from '@angular/cdk/overlay';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

// --------------------------------------------------
// INTERFACES Y SERVICIOS PROPIOS
// --------------------------------------------------
import { Alumno } from '../shared/interfaces/alumno';
import { AlumnosService } from '../services/alumno.service';

// --------------------------------------------------
// COMPONENTES DE LOS DIÁLOGOS (CRUD)
// --------------------------------------------------
import { AddAlumnoComponent } from './add-alumno/add-alumno.component';
import { EditAlumnoComponent } from './edit-alumno/edit-alumno.component';
import { DeleteAlumnoComponent } from './delete-alumno/delete-alumno.component';

// --------------------------------------------------
// DECORADOR DEL COMPONENTE
// --------------------------------------------------
@Component({
  selector: 'app-alumnos',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.scss']
})
export class AlumnosComponent implements OnInit, AfterViewInit {

  // --------------------------------------------------
  // REFERENCIAS A ELEMENTOS DE LA VISTA
  // --------------------------------------------------
  // Permiten conectar la tabla con paginación y ordenación
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // --------------------------------------------------
  // DATA SOURCE Y SELECCIÓN DE FILAS
  // --------------------------------------------------
  // Fuente de datos de la tabla
  dataSource = new MatTableDataSource<Alumno>();

  // Control de selección (una sola fila)
  selection = new SelectionModel<Alumno>(false);

  // --------------------------------------------------
  // FORM CONTROLS PARA LOS FILTROS
  // --------------------------------------------------
  idFilter = new FormControl('');
  nombreFilter = new FormControl('');
  apellidosFilter = new FormControl('');
  cursoFilter = new FormControl('');
  nifFilter = new FormControl('');
  fechaNacimientoFilter = new FormControl('');
  entidadFilter = new FormControl('');
  cicloFilter = new FormControl('');
  telefonoFilter = new FormControl('');

  // --------------------------------------------------
  // VARIABLES DE ESTADO Y PAGINACIÓN
  // --------------------------------------------------
  isChecked = false;
  isCheckedAll = false;
  pageSizeChecked: number;
  pageIndexChecked: number;

  // --------------------------------------------------
  // OBJETO QUE ALMACENA LOS VALORES DE LOS FILTROS
  // --------------------------------------------------
  filterValues = {
    id_alumno: '',
    nif_nie: '',
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
    id_entidad_centro: '',
    id_ciclo: '',
    curso: '',
    telefono: ''
  };

  // --------------------------------------------------
  // COLUMNAS QUE SE MUESTRAN EN LA TABLA
  // --------------------------------------------------
  displayedColumns: string[] = [
    'id_alumno',
    'nif_nie',
    'nombre',
    'apellidos',
    'fecha_nacimiento',
    'id_entidad_centro',
    'id_ciclo',
    'curso',
    'telefono',
    'actions'
  ];

  // --------------------------------------------------
  // CONSTRUCTOR (INYECCIÓN DE DEPENDENCIAS)
  // --------------------------------------------------
  constructor(
    private alumnosService: AlumnosService, // Comunicación con la API
    public dialog: MatDialog,                // Diálogos modales
    private overlay: Overlay                 // Control visual de los diálogos
  ) {}

  // --------------------------------------------------
  // CICLO DE VIDA: INICIALIZACIÓN
  // --------------------------------------------------
  ngOnInit(): void {
    // Carga inicial de alumnos al abrir el componente
    this.loadAlumnos();
  }

  // --------------------------------------------------
  // CICLO DE VIDA: DESPUÉS DE RENDERIZAR LA VISTA
  // --------------------------------------------------
  ngAfterViewInit(): void {
    // Se asignan paginator y sort cuando la vista ya existe
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // --------------------------------------------------
  // CARGA DE ALUMNOS DESDE LA API
  // --------------------------------------------------
  loadAlumnos() {
    this.alumnosService.getAll().subscribe(
      (response: any) => {
        if (response.ok) {
          // Asignar datos a la tabla
          this.dataSource.data = response.data;

          // Configurar filtros personalizados
          this.dataSource.filterPredicate = this.createFilter();
          this.setupFilters();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      },
      err => {
        console.error('Error al cargar alumnos', err);
      }
    );
  }

  // --------------------------------------------------
  // MÉTODOS CRUD (ABREN DIÁLOGOS)
  // --------------------------------------------------
  addAlumno() {
    const dialogRef = this.dialog.open(AddAlumnoComponent, {
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.ok) {
        this.loadAlumnos();
      }
    });
  }

  editAlumno(alumno: Alumno) {
    const dialogRef = this.dialog.open(EditAlumnoComponent, {
      data: alumno,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.ok) {
        this.loadAlumnos();
      }
    });
  }

  deleteAlumno(alumno: Alumno) {
    const dialogRef = this.dialog.open(DeleteAlumnoComponent, {
      data: alumno,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.ok) {
        this.loadAlumnos();
      }
    });
  }

  // --------------------------------------------------
  // FILTRADO PERSONALIZADO DE LA TABLA
  // --------------------------------------------------
  createFilter(): (alumno: Alumno, filter: string) => boolean {
    return (alumno: Alumno, filter: string): boolean => {
      const search = JSON.parse(filter);

      return (alumno.id_alumno?.toString() ?? '').includes(search.id_alumno)
        && (alumno.nif_nie?.toLowerCase() ?? '').includes(search.nif_nie.toLowerCase())
        && (alumno.nombre?.toLowerCase() ?? '').includes(search.nombre.toLowerCase())
        && (alumno.apellidos?.toLowerCase() ?? '').includes(search.apellidos.toLowerCase())
        && (alumno.fecha_nacimiento?.toString() ?? '').includes(search.fecha_nacimiento)
        && (alumno.id_entidad_centro?.toString() ?? '').includes(search.id_entidad_centro)
        && (alumno.id_ciclo?.toString() ?? '').includes(search.id_ciclo)
        && (alumno.curso?.toString() ?? '').includes(search.curso)
        && (alumno.telefono?.toString() ?? '').includes(search.telefono);
    };
  }

  // --------------------------------------------------
  // ASOCIAR FORM CONTROLS CON EL FILTRO
  // --------------------------------------------------
  setupFilters() {
    this.idFilter.valueChanges.subscribe(val => {
      this.filterValues.id_alumno = val;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.nifFilter.valueChanges.subscribe(val => {
      this.filterValues.nif_nie = val;
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

    this.fechaNacimientoFilter.valueChanges.subscribe(val => {
      this.filterValues.fecha_nacimiento = val;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.entidadFilter.valueChanges.subscribe(val => {
      this.filterValues.id_entidad_centro = val;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.cicloFilter.valueChanges.subscribe(val => {
      this.filterValues.id_ciclo = val;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.telefonoFilter.valueChanges.subscribe(val => {
      this.filterValues.telefono = val;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
  }

  // --------------------------------------------------
  // CONTROL DE PAGINACIÓN
  // --------------------------------------------------
  changePage() {
    if (this.isCheckedAll) {
      this.isChecked = true;
    } else {
      this.isChecked =
        (((this.pageIndexChecked + 1) * this.pageSizeChecked) /
        ((this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize)) >= 1;
    }
  }
}
