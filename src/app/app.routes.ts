import { Routes } from '@angular/router';
import { IntegrationDashboardComponent } from './integration/integration-dashboard/integration-dashboard.component';
import { ExplorerComponent } from './explorer/explorer/explorer.component';
import { AgGridGlobalSearchComponent } from './explorer/ag-grid-global-search/ag-grid-global-search.component';

export const routes: Routes = [
  { path: 'integration', component: IntegrationDashboardComponent },
  { path: 'explorer', component: ExplorerComponent },
  { path: 'globalSearch', component: AgGridGlobalSearchComponent },
  { path: '', redirectTo: '/integration', pathMatch: 'full' }, // default landing page
  { path: '**', redirectTo: '/integration' }, // fallback for unknown routes
];
