import { Routes } from '@angular/router';

export const routesAccess: Routes = [
    {
        path: 'qr-scanner',
        loadComponent: () => import('./qr-scanner/qr-scanner').then(m => m.QrLectorComponent)
    },
];
