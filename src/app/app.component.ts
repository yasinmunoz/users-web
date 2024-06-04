import { Component, OnInit, ViewChild } from '@angular/core';

import { UserService } from './services/user.service';

import { User } from './interfaces/User';
import { ApiResponsePageable } from './interfaces/ApiResponsePageable';
import { GroupService } from './services/group.service';
import { Group } from './interfaces/Group';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  @ViewChild('closeButton') closeButton: any;
  title: string = 'users-web';

  totalPages: number = 0;
  page: number = 0;
  size: number = 5;
  sort: string[] = [];

  users: User[] = [];
  groups: Group[] = [];

  formFilter!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userSvc: UserService,
    private groupSvc: GroupService
  ) { }

  ngOnInit(): void {
    console.log('Se ejecuta el ngOnInit');

    this.initialize();
  }

  getPageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  initialize() {

    this.formFilter = this.formBuilder.group({
      groupFilter: [null]
    });

    const savedFormValue = localStorage.getItem('formFilter');
    if (savedFormValue) {
      this.formFilter.patchValue(JSON.parse(savedFormValue));
    }

    this.getUsersPageable(this.page, this.size, this.sort);
    this.getGroups();
  }

  getUsersPageable(page: number, size: number, sort: string[]) {
    this.userSvc.getUsersPageable(page, size, sort).subscribe({
      next: (res: ApiResponsePageable) => {
        this.users = res.content;
        this.totalPages = res.totalPages;
      },
      error: (err) => {
        // Manejo de errores en caso de que ocurra alguno durante la solicitud
        console.error("Error al obtener usuarios:", err);
      },
      complete: () => {
        // Acciones a realizar cuando la operación se completa (opcional)
        console.log("Operación completada");
      }
    });
  }

  getGroups() {
    this.groupSvc.getGroups().subscribe({
      next: (res: ApiResponsePageable) => {
        this.groups = res.content;
      },
      error: (err) => {
        console.error("Error al obtener los roles", err);
      },
      complete: () => {
        console.log('Operación completada');
      }
    })
  }

  nextPage() {
    console.log('Ir a la siguiente página ', this.page);

    if (this.page < this.totalPages - 1) this.page += 1;

    this.getUsersPageable(this.page, this.size, this.sort);
  }

  previousPage() {
    console.log('Página actual', this.page);

    if (this.page > 0) this.page -= 1;

    console.log('Página a la que se va ', this.page);
    this.getUsersPageable(this.page, this.size, this.sort);
  }

  goToPage(page: number) {
    console.log('Ir a la página ', page);
    this.page = page;

    this.getUsersPageable(this.page, this.size, this.sort);
  }

  hasContent(array: any[]) {
    return Array.isArray(array) && array.length > 0;
  }

  closeModal() {
    const formFilterStringValue = JSON.stringify(this.formFilter.value);
    console.log(this.formFilter.value);
    localStorage.setItem('formFilter', formFilterStringValue);
    this.closeButton.nativeElement.click();
  }

  clearFilters() {
    localStorage.removeItem('formFilter');
    this.formFilter.reset();
    console.log('Form filter', this.formFilter);
  }

  submitFilters() {
    const formFilterValue = JSON.stringify(this.formFilter.value);
    console.log(this.formFilter.value);
    localStorage.setItem('formFilter', formFilterValue);
    this.closeButton.nativeElement.click();
  }

  toggleSort(column: string) {
    console.log('Ordenado: ', column);

    const regex = new RegExp(`^${column}.*`);
    const index = this.sort.findIndex(item => regex.test(item));

    if(index === -1){ //Si no encuentra la columna
      this.sort.push(column + ',desc');  // Sustituye el valor que coincide con la expresión regular
      this.getUsersPageable(this.page, this.size, this.sort);
      console.log('SORT DESCENDIENTE: ', this.sort);
    }
    else if (this.sort.includes(`${column},desc`)){
      const regex = new RegExp(`^${column}.*`);
      const index = this.sort.findIndex(item => regex.test(item));

      if (index !== -1) {  // Verifica si hay una coincidencia
        this.sort[index] = column + ',asc';  // Sustituye el valor que coincide con la expresión regular
        this.getUsersPageable(this.page, this.size, this.sort);
      }
      console.log('SORT ASCENDIENTE: ', this.sort);
    }
    else {
      const regex = new RegExp(`^${column}.*`);
      const index = this.sort.findIndex(item => regex.test(item));

      if (index !== -1) {  // Verifica si hay una coincidencia
        this.sort.splice(index, 1);   // Elimina un elemento a partir del índice encontrado
        this.getUsersPageable(this.page, this.size, this.sort);
      }
      console.log('SORT POR DEFECTO: ', this.sort);
    }
  }

  showOrderingIcon(column: string, ordering: string): boolean {
    const regex = new RegExp(`^${column}.*`);
    const index = this.sort.findIndex(item => regex.test(item));

    if(index === -1) return true; // si no hay una coincidencia
    else return this.sort.includes(`${column},${ordering}`);
  }

}
