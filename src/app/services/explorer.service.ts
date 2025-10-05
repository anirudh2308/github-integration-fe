// src/app/services/explorer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExplorerService {
  private baseUrl = 'http://localhost:3000/api/entity'; // backend endpoint

  constructor(private http: HttpClient) {}

  getEntityData(
    entity: string,
    page: number = 1,
    limit: number = 50,
    sortField: string = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
    search: string = ''
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('sortField', sortField)
      .set('sortOrder', sortOrder)
      .set('search', search);

    return this.http.get(`${this.baseUrl}/${entity}`, { params });
  }
}
