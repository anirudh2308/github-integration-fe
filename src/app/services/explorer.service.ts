import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExplorerService {
  private baseUrl = 'http://localhost:3000/api/entity';

  constructor(private http: HttpClient) {}

  getEntityData(
    entity: string,
    page: number = 1,
    limit: number = 50,
    sortField: string = 'id',
    sortOrder: 'asc' | 'desc' | null | undefined = 'asc',
    search: string = '',
    filters: any = {}
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('sortField', sortField)
      .set('sortOrder', sortOrder ? sortOrder : 'asc')
      .set('search', search);

    console.log(filters);
    if (filters && Object.keys(filters).length > 0) {
      params = params.set('filters', JSON.stringify(filters));
    }

    return this.http.get(`${this.baseUrl}/${entity}`, { params });
  }
}
