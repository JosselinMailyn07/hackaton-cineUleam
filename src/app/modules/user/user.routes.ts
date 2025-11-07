import { Routes } from '@angular/router';

export const routesUser: Routes = [
    {
        path: 'cartelera',
        loadComponent: () => import('./cartelera/cartelera').then(m => m.Cartelera)
    },
    {
        path: 'historial-reservas',
        loadComponent: () =>
          import('./historial-reservas/historial-reservas').then(m => m.HistorialReservas)
      },
    {
        path: 'alquiler',
        loadComponent: () => import('./alquiler/alquiler').then(m => m.Alquiler)
    },
    {
        path: 'perfil',
        loadComponent: () => import('./perfil/perfil').then(m => m.Perfil)
    }
];
