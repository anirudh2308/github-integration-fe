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
import { ExplorerService } from '../../services/explorer.service';

interface CollectionData {
  entityName: string;
  data: any[];
  total: number;
  columnDefs: ColDef[];
  page: number;
  limit: number;
  sortField: string;
  sortOrder: 'asc' | 'desc' | null | undefined;
  filters?: any;
}

@Component({
  selector: 'app-ag-grid-global-search',
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
  allCollectionsData: CollectionData[] = [];
  columnDefs: { [key: string]: ColDef[] } = {};
  gridApis: { [entity: string]: GridApi } = {};

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  };

  search = '';
  loading = false;
  Math = Math;

  constructor(
    private globalSearchService: GlobalSearchService,
    private explorerService: ExplorerService
  ) {}

  ngOnInit(): void {
    this.fetchAllCollections();
  }

  onGridReady(params: GridReadyEvent, entityName: string) {
    this.gridApis[entityName] = params.api;
  }

  onSearchChange(value: string) {
    this.search = value.trim();
    this.allCollectionsData.forEach((col) => (col.page = 1));
    this.fetchAllCollections();
  }

  onPageChange(collection: CollectionData, newPage: number) {
    if (newPage < 1 || newPage > Math.ceil(collection.total / collection.limit))
      return;
    collection.page = newPage;
    this.fetchCollection(collection);
  }

  onLimitChange(collection: CollectionData, newLimit: number) {
    collection.limit = newLimit;
    collection.page = 1;
    this.fetchCollection(collection);
  }

  onSortChanged(collection: CollectionData) {
    const gridApi = this.gridApis[collection.entityName];
    if (!gridApi) return;

    const columnState = gridApi.getColumnState();
    const sortedColumns = columnState.filter((col) => col.sort);

    if (sortedColumns.length > 0) {
      collection.sortField = sortedColumns[0].colId;
      collection.sortOrder = sortedColumns[0].sort;
    } else {
      collection.sortField = 'id';
      collection.sortOrder = 'asc';
    }

    const filterModel = gridApi.getFilterModel() || {};
    collection.filters = filterModel;
    this.fetchCollection(collection);
  }

  onFilterChanged(event: any, collection: CollectionData) {
    collection.filters = event.api.getFilterModel() || {};
    collection.page = 1;
    this.fetchCollection(collection);
  }

  private fetchAllCollections() {
    this.loading = true;
    this.globalSearchService
      .fetchAllCollections(1, 50, 'id', 'asc', this.search)
      .subscribe({
        next: (res: any) => {
          if (!res?.results) {
            this.allCollectionsData = [];
            this.loading = false;
            return;
          }

          this.allCollectionsData = Object.entries(res.results)
            .filter(([_, entityResult]: any) => entityResult?.data?.length)
            .map(([entityName, entityResult]: any) => {
              const data = entityResult.data;
              const total = entityResult.total || data.length;
              const columnDefs: ColDef[] =
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
                page: 1,
                limit: 50,
                sortField: 'id',
                sortOrder: 'asc',
                filters: {},
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

  private fetchCollection(collection: CollectionData) {
    this.loading = true;
    const filtersParam = collection.filters || {};
    this.explorerService
      .getEntityData(
        collection.entityName,
        collection.page,
        collection.limit,
        collection.sortField,
        collection.sortOrder,
        this.search,
        filtersParam
      )
      .subscribe((res: any) => {
        collection.data = res.data || [];
        collection.total = res.total || collection.data.length;
        this.loading = false;
      });
  }
}
