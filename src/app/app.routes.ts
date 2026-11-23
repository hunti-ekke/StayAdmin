import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';
import { LoginPage } from './pages/login-page/login-page';
import { OverviewPage } from './pages/overview-page/overview-page';
import { PropertiesPage } from './pages/properties-page/properties-page';

export const routes: Routes = [
  { path: 'login', component: LoginPage, canActivate: [guestGuard] },
  { path: 'overview', component: OverviewPage, canActivate: [authGuard] },
  { path: 'properties', component: PropertiesPage, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: '**', redirectTo: 'overview' },
];