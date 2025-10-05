import { Component, OnInit } from '@angular/core';
import { ExplorerService } from '../../services/explorer.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit {
  entities = ['orgs', 'repos', 'commits', 'pulls', 'issues', 'users'];
  selectedEntity = 'orgs';

  integrations = ['GitHub'];
  selectedIntegration = 'GitHub';

  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  };

  rowData: any[] = [];
  totalRows = 0;
  page = 1;
  limit = 50;
  sortField = 'id';
  sortOrder: 'asc' | 'desc' = 'asc';
  search = '';

  loading = false;
  Math = Math;

  private gridApi!: GridApi;

  constructor(private explorerService: ExplorerService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  onIntegrationChange(integration: string) {
    this.selectedIntegration = integration;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onEntityChange(entity: string) {
    this.selectedEntity = entity;
    this.page = 1;
    this.fetchData();
  }

  onLimitChange(newLimit: number) {
    this.limit = newLimit;
    this.page = 1;
    this.fetchData();
  }

  onSearchChange(value: string) {
    this.search = value;
    this.page = 1;
    this.fetchData();
  }

  onPageChange(newPage: number) {
    if (newPage < 1 || newPage > Math.ceil(this.totalRows / this.limit)) return;
    this.page = newPage;
    this.fetchData();
  }

  onSortChanged(event: any) {
    const sortModel = event.api.getSortModel();
    if (sortModel.length) {
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

    this.explorerService
      .getEntityData(
        this.selectedEntity,
        this.page,
        this.limit,
        this.sortField,
        this.sortOrder,
        this.search
      )
      .subscribe({
        next: (res) => {
          if (!res) {
            console.error('No response received.');
            this.rowData = [];
            this.totalRows = 0;
            this.loading = false;
            return;
          }

          console.log('Raw response:', res);

          const data = res.data;
          this.totalRows = res.total;

          if (data.length) {
            this.columnDefs = Object.keys(data[0]).map((key) => ({
              field: key,
              sortable: true,
              filter: true,
              resizable: true,
              wrapText: true,
              autoHeight: true,
            }));
          }

          this.rowData = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Fetch failed:', err);
          this.rowData = [];
          this.loading = false;
        },
      });
  }
}
