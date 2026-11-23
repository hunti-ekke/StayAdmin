import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
    canActivate: [guestGuard],
  },
  {
    path: 'overview',
    loadComponent: () => import('./pages/overview-page/overview-page').then((m) => m.OverviewPage),
    canActivate: [authGuard],
  },
  {
    path: 'properties',
    loadComponent: () =>
      import('./pages/properties-page/properties-page').then((m) => m.PropertiesPage),
    canActivate: [authGuard],
  },
  {
    path: 'properties/new',
    loadComponent: () =>
      import('./pages/property-editor/property-editor').then((m) => m.PropertyEditor),
    canActivate: [authGuard],
  },
  {
    path: 'properties/:id/edit',
    loadComponent: () =>
      import('./pages/property-editor/property-editor').then((m) => m.PropertyEditor),
    canActivate: [authGuard],
  },
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: '**', redirectTo: 'overview' },
];