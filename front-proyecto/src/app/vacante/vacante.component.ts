import { Component, OnInit , AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Vacante } from '../shared/interfaces/vacante';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { VacantesService } from '../services/vacante.service';
import { Overlay } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-vacante',
  templateUrl: './vacante.component.html',
  styleUrls: ['./vacante.component.scss']
})
export class VacanteComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<Vacante>();

    // Control de selección (una sola fila)
  selection = new SelectionModel<Vacante>(false);

  idVacanteFilter = new FormControl('');
  idEntidadFilter = new FormControl('');
  idCicloFilter = new FormControl('');
  cursoFilter = new FormControl('');
  numVacantesFilter = new FormControl('');
  observacionesFilter = new FormControl('');

  isChecked = false;
  isCheckedAll = false;
  pageSizeChecked: number;
  pageIndexChecked: number;

  filterValues = {
    id_vacante: '',
    id_entidad: '',
    id_ciclo: '',
    curso: '',
    num_vacantes: '',
    observaciones: ''

  };


  displayedColumns: string[] = [
    "id_vacante",
    "id_entidad",
    "id_ciclo",
    "curso",
    "num_vacantes",
    "observaciones",
  ];

  constructor(
    private vacantesService: VacantesService, // Comunicación con la API
    public dialog: MatDialog,                // Diálogos modales
    private overlay: Overlay                 // Control visual de los diálogos
  ) { }

  ngOnInit(): void {
    this.loadVacantes();
  }

   ngAfterViewInit(): void {
    // Se asignan paginator y sort cuando la vista ya existe
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadVacantes(){
    this.vacantesService.getAll().subscribe(
      (Response: any)=>{
        if (Response.ok) {
          this.dataSource.data=Response.data;
          this.dataSource.filterPredicate=this.createFilter();
          this.setupFilters();
          this.dataSource.filter=JSON.stringify(this.filterValues);



        }
      },
      err =>{
        console.error('Error al cargar Vacantes', err);
      }
    );
  }


 // TODO: Metodos crud
 addVacante(){

 }

 editVacante(vacante: Vacante){

 }

 deleteVacante(vacante: Vacante){

 }





  createFilter(): (vacante: Vacante, filter: string) => boolean {
  return (vacante: Vacante, filter: string): boolean => {
    const search = JSON.parse(filter);

    return (vacante.id_vacante?.toString() ?? '').includes(search.id_vacante)
      && (vacante.id_entidad?.toString() ?? '').includes(search.id_entidad)
      && (vacante.id_ciclo?.toString() ?? '').includes(search.id_ciclo)
      && (vacante.curso?.toString() ?? '').includes(search.curso)
      && (vacante.num_vacantes?.toString() ?? '').includes(search.num_vacantes)
      && (vacante.observaciones?.toLowerCase() ?? '').includes(search.observaciones.toLowerCase());
  };
}

setupFilters() {
  this.idVacanteFilter.valueChanges.subscribe(val => {
    this.filterValues.id_vacante = val;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  });

  this.idEntidadFilter.valueChanges.subscribe(val => {
    this.filterValues.id_entidad = val;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  });

  this.idCicloFilter.valueChanges.subscribe(val => {
    this.filterValues.id_ciclo = val;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  });

  this.cursoFilter.valueChanges.subscribe(val => {
    this.filterValues.curso = val;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  });

  this.numVacantesFilter.valueChanges.subscribe(val => {
    this.filterValues.num_vacantes = val;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  });

  this.observacionesFilter.valueChanges.subscribe(val => {
    this.filterValues.observaciones = val;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  });
}


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
