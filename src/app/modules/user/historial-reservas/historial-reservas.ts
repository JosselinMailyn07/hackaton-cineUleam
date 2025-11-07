import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@shared/header/header';
import { FooterComponent } from '@shared/footer/footer';
import { Supabase } from '@services/supabase';
import { Qrdisplay } from '../qrdisplay/qrdisplay';

type EstadoReserva = 'pendiente' | 'confirmada' | 'cancelada';

interface Asiento {
  fila: string;
  numero: number;
}

interface Reserva {
  id: number;
  estado: EstadoReserva;
  asientos: Asiento[];
  idUsuario: string;
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
    FooterComponent,
    Qrdisplay
  ],
  templateUrl: './historial-reservas.html',
  styleUrls: ['./historial-reservas.scss'],
})
export class HistorialReservas implements OnInit {
  reservas: Reserva[] = [];
  idFuncionQR: number | null = null;

  constructor(private supabase: Supabase) {}

  async ngOnInit() {
    try {
      const { data: userData } = await this.supabase.supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) return;

      const { data, error } = await this.supabase.supabase
        .from('reservas')
        .select(`
          id,
          estado,
          asientos,
          funciones (
            id,
            fecha_hora_inicio,
            peliculas (nombre, imagen),
            salas (codigo)
          )
        `)
        .eq('id_usuario', userId)
        .order('create_at', { ascending: false });

      if (error) throw error;

      this.reservas = (data || []).map((r: any) => ({
        id: r.id,
        estado: r.estado,
        asientos: r.asientos || [],
        idUsuario: userId,
        idFuncion: r.funciones?.id,
        fechaCreacion: r.create_at,
        fechaActualizacion: null,
        tituloPelicula: r.funciones?.peliculas?.nombre,
        fechaFuncion: r.funciones?.fecha_hora_inicio,
        horarioFuncion: new Date(r.funciones?.fecha_hora_inicio).toLocaleTimeString('es-EC', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        codigoSala: r.funciones?.salas?.codigo,
      }));
    } catch (err) {
      console.error('Error cargando reservas:', err);
    }
  }

  mostrarQR(idFuncion: number) {
    this.idFuncionQR = this.idFuncionQR === idFuncion ? null : idFuncion;
  }

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
}
