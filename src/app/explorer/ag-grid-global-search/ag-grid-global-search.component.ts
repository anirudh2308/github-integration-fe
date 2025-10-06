// src/app/components/ag-grid-global-search/ag-grid-global-search.component.ts
import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AgGridModule } from 'ag-grid-angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { GlobalSearchService } from '../../services/global-search.service';

interface CollectionData {
  entityName: string;
  data: any[];
  total: number;
  columnDefs: ColDef[];
}

@Component({
  selector: 'app-ag-grid-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatExpansionModule,
    FormsModule,
  ],
  templateUrl: './ag-grid-global-search.component.html',
  styleUrls: ['./ag-grid-global-search.component.scss'],
})
export class AgGridGlobalSearchComponent implements OnInit {
  entities = ['orgs', 'repos', 'commits', 'pulls', 'issues', 'users'];

  // Each entity will have its own section in the accordion
  allCollectionsData: CollectionData[] = [];

  columnDefs: { [key: string]: ColDef[] } = {};
  gridApis: { [key: string]: GridApi } = {};

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  };

  // Global params (shared for now)
  limit = 50;
  page = 1;
  sortField = 'id';
  sortOrder: 'asc' | 'desc' = 'asc';
  search = '';

  loading = false;
  Math = Math;

  constructor(private globalSearchService: GlobalSearchService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  onGridReady(params: GridReadyEvent, entityName: string) {
    this.gridApis[entityName] = params.api;
  }

  onLimitChange(newLimit: number) {
    this.limit = newLimit;
    this.page = 1;
    this.fetchData();
  }

  onSearchChange(value: string) {
    this.search = value.trim();
    this.page = 1;
    this.fetchData();
  }

  onPageChange(newPage: number) {
    if (newPage < 1) return;
    this.page = newPage;
    this.fetchData();
  }

  onSortChanged(event: any, entityName: string) {
    const sortModel = event.api.getSortModel();
    if (sortModel?.length) {
      this.sortField = sortModel[0].colId;
      this.sortOrder = sortModel[0].sort;
    } else {
      this.sortField = 'id';
      this.sortOrder = 'asc';
    }
    this.fetchData();
  }

  private fetchData() {
    this.loading = true;

    this.globalSearchService
      .fetchAllCollections(
        this.page,
        this.limit,
        this.sortField,
        this.sortOrder,
        this.search
      )
      .subscribe({
        next: (res) => {
          if (!res?.results) {
            this.allCollectionsData = [];
            this.loading = false;
            return;
          }

          console.log('Raw global response:', res);

          // Build one accordion section per entity
          this.allCollectionsData = Object.entries(res.results)
            .filter(([_, entityResult]: any) => entityResult?.data?.length)
            .map(([entityName, entityResult]: any) => {
              const data = entityResult.data;
              const total = entityResult.total || data.length;

              const columnDefs =
                data.length > 0
                  ? Object.keys(data[0]).map((key) => ({
                      field: key,
                      sortable: true,
                      filter: true,
                      resizable: true,
                      wrapText: true,
                      autoHeight: true,
                    }))
                  : [];

              this.columnDefs[entityName] = columnDefs;

              return {
                entityName,
                data,
                total,
                columnDefs,
              } as CollectionData;
            });

          this.loading = false;
        },
        error: (err) => {
          console.error('Global fetch failed:', err);
          this.allCollectionsData = [];
          this.loading = false;
        },
      });
  }
}
