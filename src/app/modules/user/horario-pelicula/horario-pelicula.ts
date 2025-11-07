import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Supabase } from '@app/services/supabase';

@Component({
  selector: 'app-horario-pelicula',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, SelectModule, ButtonModule],
  templateUrl: './horario-pelicula.html',
  styleUrls: ['./horario-pelicula.scss']
})
export class HorarioPeliculaComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() peliculaSeleccionada: any = null;

  horarioSeleccionado: any = null;
  cantidadAsientos: number = 1;
  MAX_ASIENTOS = 3;
  horariosDisponibles: { label: string; value: string }[] = [];

  constructor(
    private messageService: MessageService,
    private supabase: Supabase,
  ) {}

  async abrirModal(pelicula: any) {
    this.peliculaSeleccionada = pelicula;
    this.visible = true;
    this.cantidadAsientos = 1;
    console.log(this.peliculaSeleccionada)
    try {
      // Cargar horarios reales desde Supabase
      const funciones = await this.supabase.getFuncionesPorPelicula(pelicula.id);
      this.horariosDisponibles = funciones.map((f: any) => ({
        label: new Date(f.fecha_hora_inicio).toLocaleString('es-EC', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          day: '2-digit',
          month: 'short'
        }),
        value: f.id
      }));
    } catch (err) {
      console.error(err);
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se pudieron cargar los horarios disponibles.'
      });
    }
  }

  cerrarModal() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.horarioSeleccionado = null;
    this.cantidadAsientos = 1;
  }

  incrementarAsientos() {
    if (this.cantidadAsientos < this.MAX_ASIENTOS) {
      this.cantidadAsientos++;
    } else {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Límite alcanzado',
        detail: `Solo se pueden reservar máximo ${this.MAX_ASIENTOS} asientos`
      });
    }
  }

  decrementarAsientos() {
    if (this.cantidadAsientos > 1) {
      this.cantidadAsientos--;
    }
  }

  async reservarAsiento() {
    if (!this.horarioSeleccionado) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Por favor, selecciona un horario.'
      });
      return;
    }

    try {
      const usuario = await this.supabase.getUsuarioActual();
      if (!usuario?.id) {
        this.messageService.add({
          key: 'toast1',
          severity: 'error',
          summary: 'Error',
          detail: 'No se encontró sesión activa.'
        });
        return;
      }

      const datos = {
        id_funcion: this.horarioSeleccionado,
        id_usuario: usuario.id,
        cantidad_asientos: this.cantidadAsientos,
        estado: 'pendiente'
      };

      await this.supabase.createReserva(datos);

      this.messageService.add({
        key: 'toast1',
        severity: 'success',
        summary: 'Reserva exitosa',
        detail: 'Tu reserva ha sido guardada correctamente.'
      });

      setTimeout(() => this.cerrarModal(), 1500);
    } catch (err: any) {
      console.error('Error al crear reserva:', err);
      this.messageService.add({
        key: 'toast1',
        severity: 'error',
        summary: 'Error',
        detail: err?.message || 'No se pudo guardar la reserva.'
      });
    }
  }
}
