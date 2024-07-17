import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { routeGuard } from './guards/route.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect to dashboard for root path
    { path: 'dashboard', component: DashboardComponent, canActivate: [routeGuard] },
    { path: 'login', component: LoginComponent },
    { path: '**', component: NotFoundComponent } // Catch-all for unmatched routes
];

