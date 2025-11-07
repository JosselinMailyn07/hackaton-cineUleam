import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-horario-pelicula',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,       // Necesario para [(ngModel)]
    DialogModule,      // <p-dialog>
    SelectModule,      // <p-select>
    ButtonModule,      // <p-button>
  ],
  templateUrl: './horario-pelicula.html',
  styleUrls: ['./horario-pelicula.scss']
})
export class HorarioPelicula {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() peliculaSeleccionada: any = null;

  horarioSeleccionado: any = null;
  cantidadAsientos: number = 1;
  MAX_ASIENTOS = 3;

  // Horarios de ejemplo - aquí puedes cargar los horarios reales desde un servicio
  horariosDisponibles = [
    { label: '14:00', value: '14:00' },
    { label: '16:30', value: '16:30' },
    { label: '19:00', value: '19:00' },
    { label: '21:30', value: '21:30' }
  ];

  constructor(private messageService: MessageService) {}

  abrirModal(pelicula: any) {
    this.peliculaSeleccionada = pelicula;
    this.visible = true;
    this.cantidadAsientos = 1; // Resetear a 1 cuando se abre el modal
    // Aquí puedes cargar los horarios reales de la película
    // this.cargarHorarios(pelicula.id);
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

  reservarAsiento() {
    if (!this.horarioSeleccionado) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Por favor, selecciona un horario.'
      });
      return;
    }
    
    if (this.cantidadAsientos < 1 || this.cantidadAsientos > this.MAX_ASIENTOS) {
      this.messageService.add({
        key: 'toast1',
        severity: 'warn',
        summary: 'Cantidad inválida',
        detail: `La cantidad de asientos debe estar entre 1 y ${this.MAX_ASIENTOS}`
      });
      return;
    }
    
    console.log('Reserva confirmada:', {
      pelicula: this.peliculaSeleccionada?.nombre,
      horario: this.horarioSeleccionado,
      cantidad: this.cantidadAsientos
    });
    
    // Aquí puedes agregar la lógica para guardar la reserva
    // Ejemplo: await this.reservaService.guardarReserva(...)
    
    // Mostrar mensaje de éxito
    this.messageService.add({
      key: 'toast1',
      severity: 'success',
      summary: 'Reserva guardada',
      detail: 'Tu Reserva ha sido guardada'
    });
    
    // Cerrar el modal después de un breve delay
    setTimeout(() => {
      this.cerrarModal();
    }, 1500);
  }
}
