import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { MovieManagementComponent } from './movie-management/movie-management';
import { UserManagement } from './user-management/user-management';
import { Report } from './report/report';

export const routesAdmin: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent),
    },
    {
        path: 'movie-management',
        loadComponent: () => import('./movie-management/movie-management').then(m => m.MovieManagementComponent),
    },
    {
        path: 'movie-showtimes-management',
        loadComponent: () => import('./movie-showtimes-management/movie-showtimes-management').then(m => m.MovieShowtimesManagementComponent),
    },
    {
        path: 'user-management',
        loadComponent: () => import('./user-management/user-management').then(m => m.UserManagement),
    },
    {
        path: 'report',
        loadComponent: () => import('./report/report').then(m => m.Report),
    }
];
