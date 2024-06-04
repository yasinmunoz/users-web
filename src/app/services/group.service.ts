import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiResponsePageable } from '../interfaces/ApiResponsePageable';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private REST_API_URL: string = 'http://localhost:8080/api/v1/groups'

  constructor(
    private _http: HttpClient
  ) { }

  getGroups(): Observable<ApiResponsePageable> {
    return this._http.get<ApiResponsePageable>(`${this.REST_API_URL}`);
  }

  getGroupsPageable(page: number, size: number): Observable<ApiResponsePageable> {
    return this._http.get<ApiResponsePageable>(`${this.REST_API_URL}?p=${page}&s=${size}`);
  }
}
