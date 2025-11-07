import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { MovieManagement } from './movie-management/movie-management';
import { UserManagement } from './user-management/user-management';
import { Report } from './report/report';

export const routesAdmin: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
    },
    {
        path: 'movie-management',
        loadComponent: () => import('./movie-management/movie-management').then(m => m.MovieManagement),
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
