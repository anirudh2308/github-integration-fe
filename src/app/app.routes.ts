import { Routes } from '@angular/router';
import { IntegrationDashboardComponent } from './integration/integration-dashboard/integration-dashboard.component';
import { ExplorerComponent } from './explorer/explorer/explorer.component';

export const routes: Routes = [
  { path: 'integration', component: IntegrationDashboardComponent },
  { path: 'explorer', component: ExplorerComponent },
  { path: '', redirectTo: '/integration', pathMatch: 'full' }, // default landing page
  { path: '**', redirectTo: '/integration' } // fallback for unknown routes
];
