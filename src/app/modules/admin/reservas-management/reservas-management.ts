import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
// import { CalendarModule } from 'primeng/calendar';

import { MessageService, ConfirmationService } from 'primeng/api';

// Interfaces para tipos de datos
interface Reserva {
  id?: string;
  codigoQr: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioEmail: string;
  peliculaId: string;
  peliculaTitulo: string;
  funcionId: string;
  fechaFuncion: Date;
  horaFuncion: string;
  sala: string;
  asientos: string[];
  cantidadAsientos: number;
  precioTotal: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'utilizada';
  fechaReserva: Date;
  fechaConfirmacion?: Date;
  fechaCancelacion?: Date;
  metodoPago: 'transferencia' | 'efectivo' | 'tarjeta';
  comprobantePago?: string;
  asistenciaRegistrada: boolean;
  fechaAsistencia?: Date;
}

interface EstadisticaReservas {
  total: number;
  pendientes: number;
  confirmadas: number;
  canceladas: number;
  utilizadas: number;
  ingresosTotales: number;
  promedioAsistencia: number;
}

@Component({
  selector: 'app-reservas-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // PrimeNG Modules
    TableModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    TagModule,
    ToastModule,
    TooltipModule,
    BadgeModule,
    AvatarModule,
    // CalendarModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './reservas-management.html',
  styleUrls: ['./reservas-management.scss']
})
export class ReservasManagementComponent implements OnInit {
  
  // Lista de reservas
  listareservas: Reserva[] = [];
  
  // Reserva seleccionada para detalles
  reservaSeleccionada: Reserva | null = null;
  
  // Estados del componente
  mostrarDialogoDetalles: boolean = false;
  mostrarDialogoFiltros: boolean = false;
  cargando: boolean = true;
  
  // Filtros
  filtroEstado: string = '';
  filtroFechaInicio: Date | null = null;
  filtroFechaFin: Date | null = null;
  terminoBusqueda: string = '';

  // Opciones para filtros
  opcionesEstados: any[] = [
    { label: 'Pendientes', value: 'pendiente' },
    { label: 'Confirmadas', value: 'confirmada' },
    { label: 'Canceladas', value: 'cancelada' },
    { label: 'Utilizadas', value: 'utilizada' }
  ];

  opcionesMetodosPago: any[] = [
    { label: 'Transferencia', value: 'transferencia' },
    { label: 'Efectivo', value: 'efectivo' },
    { label: 'Tarjeta', value: 'tarjeta' }
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarReservas();
  }

  /**
   * Carga la lista de reservas desde el servicio
   */
  cargarReservas() {
    this.cargando = true;
    
    // Simulación de datos - en producción vendrían de un servicio
    setTimeout(() => {
      this.listareservas = [
        {
          id: '1',
          codigoQr: 'RES-001-2024',
          usuarioId: '1',
          usuarioNombre: 'María González',
          usuarioEmail: 'maria.gonzalez@uleam.edu.ec',
          peliculaId: '1',
          peliculaTitulo: 'Avatar: The Way of Water',
          funcionId: '1',
          fechaFuncion: new Date('2024-01-20'),
          horaFuncion: '20:00',
          sala: 'Sala 3 - IMAX',
          asientos: ['A5', 'A6', 'A7'],
          cantidadAsientos: 3,
          precioTotal: 37.50,
          estado: 'confirmada',
          fechaReserva: new Date('2024-01-15'),
          fechaConfirmacion: new Date('2024-01-15'),
          metodoPago: 'transferencia',
          comprobantePago: 'comp-001.jpg',
          asistenciaRegistrada: false
        },
        {
          id: '2',
          codigoQr: 'RES-002-2024',
          usuarioId: '2',
          usuarioNombre: 'Carlos López',
          usuarioEmail: 'carlos.lopez@uleam.edu.ec',
          peliculaId: '2',
          peliculaTitulo: 'The Batman',
          funcionId: '2',
          fechaFuncion: new Date('2024-01-18'),
          horaFuncion: '17:30',
          sala: 'Sala 1 - Premium',
          asientos: ['B12'],
          cantidadAsientos: 1,
          precioTotal: 8.50,
          estado: 'pendiente',
          fechaReserva: new Date('2024-01-16'),
          metodoPago: 'efectivo',
          asistenciaRegistrada: false
        },
        {
          id: '3',
          codigoQr: 'RES-003-2024',
          usuarioId: '3',
          usuarioNombre: 'Ana Martínez',
          usuarioEmail: 'ana.martinez@uleam.edu.ec',
          peliculaId: '1',
          peliculaTitulo: 'Avatar: The Way of Water',
          funcionId: '3',
          fechaFuncion: new Date('2024-01-19'),
          horaFuncion: '15:00',
          sala: 'Sala 4 - 4DX',
          asientos: ['C3', 'C4'],
          cantidadAsientos: 2,
          precioTotal: 30.00,
          estado: 'utilizada',
          fechaReserva: new Date('2024-01-14'),
          fechaConfirmacion: new Date('2024-01-14'),
          metodoPago: 'tarjeta',
          asistenciaRegistrada: true,
          fechaAsistencia: new Date('2024-01-19')
        },
        {
          id: '4',
          codigoQr: 'RES-004-2024',
          usuarioId: '4',
          usuarioNombre: 'Luis Torres',
          usuarioEmail: 'luis.torres@uleam.edu.ec',
          peliculaId: '5',
          peliculaTitulo: 'Black Panther: Wakanda Forever',
          funcionId: '4',
          fechaFuncion: new Date('2024-01-17'),
          horaFuncion: '12:30',
          sala: 'Sala 2 - Standard',
          asientos: ['D8', 'D9'],
          cantidadAsientos: 2,
          precioTotal: 15.00,
          estado: 'cancelada',
          fechaReserva: new Date('2024-01-13'),
          fechaCancelacion: new Date('2024-01-14'),
          metodoPago: 'transferencia',
          asistenciaRegistrada: false
        },
        {
          id: '5',
          codigoQr: 'RES-005-2024',
          usuarioId: '5',
          usuarioNombre: 'Elena Castro',
          usuarioEmail: 'elena.castro@uleam.edu.ec',
          peliculaId: '3',
          peliculaTitulo: 'Spider-Man: No Way Home',
          funcionId: '5',
          fechaFuncion: new Date('2024-01-21'),
          horaFuncion: '19:00',
          sala: 'Sala 1 - Premium',
          asientos: ['A1', 'A2', 'A3', 'A4'],
          cantidadAsientos: 4,
          precioTotal: 34.00,
          estado: 'confirmada',
          fechaReserva: new Date('2024-01-16'),
          fechaConfirmacion: new Date('2024-01-16'),
          metodoPago: 'tarjeta',
          asistenciaRegistrada: false
        }
      ];
      this.cargando = false;
    }, 1000);
  }

  /**
   * Abre el diálogo para ver detalles de una reserva
   */
  abrirDialogoDetalles(reserva: Reserva) {
    this.reservaSeleccionada = { ...reserva };
    this.mostrarDialogoDetalles = true;
  }

  /**
   * Confirma una reserva pendiente
   */
  confirmarReserva(reserva: Reserva) {
    this.confirmationService.confirm({
      message: `¿Confirmar la reserva de ${reserva.usuarioNombre} para ${reserva.peliculaTitulo}?`,
      header: 'Confirmar Reserva',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sí, confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        reserva.estado = 'confirmada';
        reserva.fechaConfirmacion = new Date();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Reserva Confirmada',
          detail: 'La reserva ha sido confirmada exitosamente'
        });
      }
    });
  }

  /**
   * Cancela una reserva
   */
  cancelarReserva(reserva: Reserva) {
    this.confirmationService.confirm({
      message: `¿Cancelar la reserva de ${reserva.usuarioNombre} para ${reserva.peliculaTitulo}?`,
      header: 'Cancelar Reserva',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No',
      accept: () => {
        reserva.estado = 'cancelada';
        reserva.fechaCancelacion = new Date();
        
        this.messageService.add({
          severity: 'warn',
          summary: 'Reserva Cancelada',
          detail: 'La reserva ha sido cancelada'
        });
      }
    });
  }

  /**
   * Marca una reserva como utilizada (check-in)
   */
  marcarComoUtilizada(reserva: Reserva) {
    reserva.estado = 'utilizada';
    reserva.asistenciaRegistrada = true;
    reserva.fechaAsistencia = new Date();
    
    this.messageService.add({
      severity: 'success',
      summary: 'Asistencia Registrada',
      detail: 'La reserva ha sido marcada como utilizada'
    });
  }

  /**
   * Reembolsa una reserva cancelada
   */
  procesarReembolso(reserva: Reserva) {
    this.confirmationService.confirm({
      message: `¿Procesar reembolso de $${reserva.precioTotal} para ${reserva.usuarioNombre}?`,
      header: 'Procesar Reembolso',
      icon: 'pi pi-dollar',
      acceptLabel: 'Sí, procesar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Reembolso Procesado',
          detail: `Reembolso de $${reserva.precioTotal} procesado exitosamente`
        });
      }
    });
  }

  /**
   * Obtiene la severidad para el tag de estado
   */
  obtenerSeveridadEstado(estado: string): any {
    switch (estado) {
      case 'confirmada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelada':
        return 'danger';
      case 'utilizada':
        return 'info';
      default:
        return 'secondary';
    }
  }

  /**
   * Obtiene la severidad para el tag de método de pago
   */
  obtenerSeveridadMetodoPago(metodo: string): any {
    switch (metodo) {
      case 'transferencia':
        return 'info';
      case 'efectivo':
        return 'success';
      case 'tarjeta':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  /**
   * Obtiene el icono para el método de pago
   */
  obtenerIconoMetodoPago(metodo: string): string {
    switch (metodo) {
      case 'transferencia':
        return 'pi pi-building-columns';
      case 'efectivo':
        return 'pi pi-money-bill';
      case 'tarjeta':
        return 'pi pi-credit-card';
      default:
        return 'pi pi-question-circle';
    }
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  /**
   * Formatea la fecha y hora completa
   */
  formatearFechaHora(fecha: Date): string {
    return new Date(fecha).toLocaleString('es-ES');
  }

  /**
   * Formatea los asientos para mostrar
   */
  formatearAsientos(asientos: string[]): string {
    return asientos.join(', ');
  }

  /**
   * Obtiene las iniciales del nombre para el avatar
   */
  obtenerIniciales(nombre: string): string {
    const partes = nombre.split(' ');
    let iniciales = '';
    
    if (partes.length > 0) {
      iniciales += partes[0].charAt(0);
    }
    if (partes.length > 1) {
      iniciales += partes[1].charAt(0);
    }
    
    return iniciales.toUpperCase();
  }

  /**
   * Filtra las reservas según los criterios
   */
  get reservasFiltradas(): Reserva[] {
    return this.listareservas.filter(reserva => {
      const coincideBusqueda = !this.terminoBusqueda || 
        reserva.usuarioNombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        reserva.peliculaTitulo.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        reserva.codigoQr.toLowerCase().includes(this.terminoBusqueda.toLowerCase());
      
      const coincideEstado = !this.filtroEstado || reserva.estado === this.filtroEstado;
      
      let coincideFecha = true;
      if (this.filtroFechaInicio && this.filtroFechaFin) {
        const fechaReserva = new Date(reserva.fechaFuncion);
        coincideFecha = fechaReserva >= this.filtroFechaInicio && fechaReserva <= this.filtroFechaFin;
      }
      
      return coincideBusqueda && coincideEstado && coincideFecha;
    });
  }

  /**
   * Obtiene estadísticas de reservas
   */
  get estadisticasReservas(): EstadisticaReservas {
    const total = this.listareservas.length;
    const pendientes = this.listareservas.filter(r => r.estado === 'pendiente').length;
    const confirmadas = this.listareservas.filter(r => r.estado === 'confirmada').length;
    const canceladas = this.listareservas.filter(r => r.estado === 'cancelada').length;
    const utilizadas = this.listareservas.filter(r => r.estado === 'utilizada').length;
    
    const ingresosTotales = this.listareservas
      .filter(r => r.estado === 'confirmada' || r.estado === 'utilizada')
      .reduce((sum, reserva) => sum + reserva.precioTotal, 0);
    
    const promedioAsistencia = total > 0 ? (utilizadas / total * 100) : 0;
    
    return {
      total,
      pendientes,
      confirmadas,
      canceladas,
      utilizadas,
      ingresosTotales,
      promedioAsistencia
    };
  }

  /**
   * Exporta las reservas a CSV
   */
  exportarReservas() {
    // Simulación de exportación
    this.messageService.add({
      severity: 'success',
      summary: 'Exportación Exitosa',
      detail: 'Las reservas han sido exportadas a CSV'
    });
  }

  /**
   * Limpia todos los filtros
   */
  limpiarFiltros() {
    this.filtroEstado = '';
    this.filtroFechaInicio = null;
    this.filtroFechaFin = null;
    this.terminoBusqueda = '';
    
    this.messageService.add({
      severity: 'info',
      summary: 'Filtros Limpiados',
      detail: 'Todos los filtros han sido restablecidos'
    });
  }

  /**
   * Cancela y cierra el diálogo
   */
  cancelarDialogo() {
    this.mostrarDialogoDetalles = false;
    this.mostrarDialogoFiltros = false;
    this.reservaSeleccionada = null;
  }
}