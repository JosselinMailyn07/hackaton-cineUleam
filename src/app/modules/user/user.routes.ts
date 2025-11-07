import { Routes } from '@angular/router';

export const routesUser: Routes = [
    {
        path: 'cartelera',
        loadComponent: () => import('./cartelera/cartelera').then(m => m.Cartelera)
    },
];
