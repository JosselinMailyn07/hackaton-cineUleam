import { Routes } from '@angular/router';

export const routes: Routes = [
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
