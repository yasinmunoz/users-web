import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiResponsePageable } from '../interfaces/ApiResponsePageable';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private REST_API_URL: string = 'http://localhost:8080/api/v1/users';

  constructor(
    private _http: HttpClient
  ) { }

  getUsers(): Observable<ApiResponsePageable> {
    return this._http.get<ApiResponsePageable>(`${this.REST_API_URL}`);
  }

  getUsersPageable(page: number, size: number, sort: string[]): Observable<ApiResponsePageable> {
    console.log('Service page', page);
    const buildSortParams = sort.map(s => `sort=${s}`).join('&');

    if(sort.length > 0) return this._http.get<ApiResponsePageable>(`${this.REST_API_URL}?p=${page}&s=${size}&${buildSortParams}`);
    else return this._http.get<ApiResponsePageable>(`${this.REST_API_URL}?p=${page}&s=${size}`);
  }
}
