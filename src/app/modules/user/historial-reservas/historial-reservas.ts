import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@shared/header/header';
import { FooterComponent } from '@shared/footer/footer';

type EstadoReserva = 'pendiente' | 'confirmada' | 'cancelada';

interface Asiento {
  fila: string;
  numero: number;
}

interface Reserva {
  id: number;
  estado: EstadoReserva;
  asientos: Asiento[];
  idUsuario: number;
  idFuncion: number;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  tituloPelicula: string;
  fechaFuncion: string;
  horarioFuncion: string;
  codigoSala: string;
  costo?: number;
}

@Component({
  selector: 'app-historial-reservas',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './historial-reservas.html',
  styleUrl: './historial-reservas.scss',
})
export class HistorialReservas {
  calcularCosto(cantidadAsientos: number): number {
    return cantidadAsientos * 12.34;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const año = date.getFullYear().toString().slice(-2);
    return `${dia}/${mes}/${año}`;
  }

  formatearCosto(costo: number): string {
    return costo.toFixed(2).replace('.', ',');
  }

  @Input() reservas: Reserva[] = [
    {
      id: 1,
      estado: 'pendiente',
      asientos: [
        { fila: 'A', numero: 1 },
        { fila: 'A', numero: 2 },
        { fila: 'A', numero: 3 }
      ],
      idUsuario: 123,
      idFuncion: 456,
      fechaCreacion: '2025-11-07T10:30:00',
      fechaActualizacion: null,
      tituloPelicula: 'Dune: Parte Dos',
      fechaFuncion: '2025-11-10',
      horarioFuncion: '19:30',
      codigoSala: 'SALA-05-A',
      costo: 37.02,
    },
    {
      id: 2,
      estado: 'confirmada',
      asientos: [
        { fila: 'B', numero: 4 },
        { fila: 'B', numero: 5 }
      ],
      idUsuario: 123,
      idFuncion: 789,
      fechaCreacion: '2025-11-05T15:45:00',
      fechaActualizacion: '2025-11-06T09:20:00',
      tituloPelicula: 'Oppenheimer',
      fechaFuncion: '2025-11-08',
      horarioFuncion: '21:00',
      codigoSala: 'SALA-03-B',

      costo: 24.68,
    }
  ];
}
