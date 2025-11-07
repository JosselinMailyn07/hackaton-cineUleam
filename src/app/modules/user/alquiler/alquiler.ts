import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FooterComponent } from '@shared/footer/footer';
import { HeaderComponent } from '@shared/header/header';
import { Dialog, DialogModule } from 'primeng/dialog';
type TipoEvento = 'película' | 'conferencia' | 'concierto' | 'teatro' | 'otro';

interface AlquilerSala {
  id: number;
  nombreSala: string;
  tipoEvento: TipoEvento;
  fecha: string;
  horario: string;
  capacidad: number;
  estado: 'disponible' | 'reservado' | 'ocupado';
}
@Component({
  selector: 'app-alquiler',
  imports: [
    CardModule,
    ButtonModule,
    DialogModule,
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './alquiler.html',
  styleUrl: './alquiler.scss',
})
export class Alquiler {
  @Input() alquileres: AlquilerSala[] = [
    {
      id: 1,
      nombreSala: 'Sala Premium',
      tipoEvento: 'película',
      fecha: '2025-12-15',
      horario: '18:00 - 22:00',
      capacidad: 100,
      estado: 'disponible'
    },
    {
      id: 2,
      nombreSala: 'Auditorio Central',
      tipoEvento: 'concierto',
      fecha: '2025-12-20',
      horario: '20:00 - 23:00',
      capacidad: 300,
      estado: 'reservado'
    },
    {
      id: 3,
      nombreSala: 'Sala de Conferencias',
      tipoEvento: 'conferencia',
      fecha: '2025-12-18',
      horario: '09:00 - 17:00',
      capacidad: 150,
      estado: 'disponible'
    }
  ];
  visible: boolean = false;
  salaSeleccionada: AlquilerSala | null = null;

  alquilar(sala: AlquilerSala) {
    this.salaSeleccionada = sala;
    this.visible = true;
    sala.estado = 'reservado';
  }
}