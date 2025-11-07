import { Routes } from '@angular/router';

export const routes: Routes = [
     {
        path: 'auth',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: 'admin',
        redirectTo: 'admin/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'user',
        redirectTo: 'user/cartelera',
        pathMatch: 'full'
    },
    {
        path: 'access',
        redirectTo: 'access/qr-scanner',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: () => import('@modules/auth/auth.routes').then(m => m.routesAuth)
    },
    {
        path: 'admin',
        loadChildren: () => import('@modules/admin/admin.routes').then(m => m.routesAdmin)
    },
    {
        path: 'user',
        loadChildren: () => import('@modules/user/user.routes').then(m => m.routesUser)
    },
    {
        path: 'access',
        loadChildren: () => import('@modules/access/access.routes').then(m => m.routesAccess)
    },
   
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'auth',
        pathMatch: 'full'
    }
];

