import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules - Verificar que estén instalados
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

// Módulos que pueden faltar - alternativas si no están disponibles
// import { DropdownModule } from 'primeng/dropdown';
// import { CalendarModule } from 'primeng/calendar';
// import { InputNumberModule } from 'primeng/inputnumber';

import { MessageService, ConfirmationService } from 'primeng/api';
import { HeaderAdminComponent } from '../header-admin/header-admin';
import { FooterComponent } from '@shared/footer/footer';

// Interfaces para tipos de datos
interface Funcion {
  id?: string;
  peliculaId: string;
  peliculaTitulo: string;
  sala: string;
  fecha: Date;
  hora: string;
  asientosDisponibles: number;
  asientosTotales: number;
  precio: number;
  tipo: '2D' | '3D' | '4DX';
  estado: 'activa' | 'cancelada' | 'completa';
  createdAt?: Date;
  updatedAt?: Date;
}

interface Pelicula {
  id: string;
  titulo: string;
  duracion: number;
  estado: string;
}

@Component({
  selector: 'app-movie-showtimes-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // PrimeNG Modules disponibles
    TableModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    TagModule,
    ToastModule,
    TooltipModule,
   HeaderAdminComponent,
   FooterComponent
    // DropdownModule,
    // CalendarModule,
    // InputNumberModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './movie-showtimes-management.html',
  styleUrls: ['./movie-showtimes-management.scss']
})
export class MovieShowtimesManagementComponent implements OnInit {
  
  // Lista de funciones
  listaFunciones: Funcion[] = [];
  
  // Función seleccionada para edición
  funcionSeleccionada: Funcion = this.crearFuncionVacia();
  
  // Lista de películas para dropdown
  listaPeliculas: Pelicula[] = [];
  
  // Estados del componente
  mostrarDialogoEdicion: boolean = false;
  esEdicion: boolean = false;
  cargando: boolean = true;
  submitted: boolean = false;

  // Opciones para dropdowns (usaremos inputs normales temporalmente)
  opcionesSalas: any[] = [
    { label: 'Sala 1 - Premium', value: 'sala-1' },
    { label: 'Sala 2 - Standard', value: 'sala-2' },
    { label: 'Sala 3 - IMAX', value: 'sala-3' },
    { label: 'Sala 4 - 4DX', value: 'sala-4' },
    { label: 'Sala 5 - Standard', value: 'sala-5' }
  ];

  opcionesTipos: any[] = [
    { label: '2D - Standard', value: '2D' },
    { label: '3D - Tres Dimensiones', value: '3D' },
    { label: '4DX - Experiencia Completa', value: '4DX' }
  ];

  opcionesEstados: any[] = [
    { label: 'Activa', value: 'activa' },
    { label: 'Cancelada', value: 'cancelada' },
    { label: 'Completa', value: 'completa' }
  ];

  opcionesHoras: any[] = [
    { label: '10:00 AM', value: '10:00' },
    { label: '12:30 PM', value: '12:30' },
    { label: '03:00 PM', value: '15:00' },
    { label: '05:30 PM', value: '17:30' },
    { label: '08:00 PM', value: '20:00' },
    { label: '10:30 PM', value: '22:30' }
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // Simular carga de datos
    this.cargarPeliculas();
    this.cargarFunciones();
  }

  /**
   * Carga la lista de películas para el dropdown
   */
  cargarPeliculas() {
    // Simulación de datos de películas
    this.listaPeliculas = [
      { id: '1', titulo: 'Avatar: The Way of Water', duracion: 192, estado: 'activa' },
      { id: '2', titulo: 'The Batman', duracion: 176, estado: 'activa' },
      { id: '3', titulo: 'Spider-Man: No Way Home', duracion: 148, estado: 'activa' },
      { id: '4', titulo: 'Dune: Part Two', duracion: 166, estado: 'proximamente' },
      { id: '5', titulo: 'Black Panther: Wakanda Forever', duracion: 161, estado: 'activa' }
    ];
  }

  /**
   * Carga la lista de funciones desde el servicio
   */
  cargarFunciones() {
    this.cargando = true;
    
    // Simulación de datos - en producción vendrían de un servicio
    setTimeout(() => {
      this.listaFunciones = [
        {
          id: '1',
          peliculaId: '1',
          peliculaTitulo: 'Avatar: The Way of Water',
          sala: 'sala-3',
          fecha: new Date('2024-01-15'),
          hora: '20:00',
          asientosDisponibles: 45,
          asientosTotales: 120,
          precio: 12.50,
          tipo: '3D',
          estado: 'activa'
        },
        {
          id: '2',
          peliculaId: '2',
          peliculaTitulo: 'The Batman',
          sala: 'sala-1',
          fecha: new Date('2024-01-15'),
          hora: '17:30',
          asientosDisponibles: 12,
          asientosTotales: 80,
          precio: 8.50,
          tipo: '2D',
          estado: 'activa'
        }
      ];
      this.cargando = false;
    }, 1000);
  }

  /**
   * Abre el diálogo para crear una nueva función
   */
  abrirDialogoNuevaFuncion() {
    this.funcionSeleccionada = this.crearFuncionVacia();
    this.esEdicion = false;
    this.mostrarDialogoEdicion = true;
    this.submitted = false;
  }

  /**
   * Abre el diálogo para editar una función existente
   */
  abrirDialogoEditarFuncion(funcion: Funcion) {
    this.funcionSeleccionada = { ...funcion };
    this.esEdicion = true;
    this.mostrarDialogoEdicion = true;
    this.submitted = false;
  }

  /**
   * Guarda la función (crear o actualizar)
   */
  guardarFuncion() {
    this.submitted = true;

    // Validación básica
    if (!this.validarFuncion()) {
      return;
    }

    // Simular guardado
    if (this.esEdicion) {
      // Actualizar función existente
      const index = this.listaFunciones.findIndex(f => f.id === this.funcionSeleccionada.id);
      if (index !== -1) {
        this.listaFunciones[index] = { 
          ...this.funcionSeleccionada,
          updatedAt: new Date()
        };
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Función actualizada correctamente'
      });
    } else {
      // Crear nueva función
      const peliculaSeleccionada = this.listaPeliculas.find(p => p.id === this.funcionSeleccionada.peliculaId);
      const nuevaFuncion: Funcion = {
        ...this.funcionSeleccionada,
        id: (this.listaFunciones.length + 1).toString(),
        peliculaTitulo: peliculaSeleccionada?.titulo || 'Película Desconocida',
        createdAt: new Date()
      };
      this.listaFunciones.push(nuevaFuncion);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Función creada correctamente'
      });
    }

    this.mostrarDialogoEdicion = false;
    this.funcionSeleccionada = this.crearFuncionVacia();
  }

  /**
   * Valida los datos de la función
   */
  validarFuncion(): boolean {
    return !!this.funcionSeleccionada.peliculaId &&
           !!this.funcionSeleccionada.sala &&
           !!this.funcionSeleccionada.fecha &&
           !!this.funcionSeleccionada.hora &&
           this.funcionSeleccionada.asientosTotales > 0 &&
           this.funcionSeleccionada.precio >= 0;
  }

  /**
   * Confirma la eliminación de una función
   */
  confirmarEliminacion(funcion: Funcion) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la función de "${funcion.peliculaTitulo}" el ${this.formatearFecha(funcion.fecha)} a las ${funcion.hora}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => this.eliminarFuncion(funcion.id!)
    });
  }

  /**
   * Elimina una función
   */
  eliminarFuncion(id: string) {
    this.listaFunciones = this.listaFunciones.filter(f => f.id !== id);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Función eliminada correctamente'
    });
  }

  /**
   * Cambia el estado de una función
   */
  cambiarEstadoFuncion(funcion: Funcion, nuevoEstado: 'activa' | 'cancelada' | 'completa') {
    funcion.estado = nuevoEstado;
    
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `Función ${this.obtenerTextoEstado(nuevoEstado)}`
    });
  }

  /**
   * Crea una función vacía para formularios nuevos
   */
  crearFuncionVacia(): Funcion {
    return {
      peliculaId: '',
      peliculaTitulo: '',
      sala: '',
      fecha: new Date(),
      hora: '',
      asientosDisponibles: 0,
      asientosTotales: 0,
      precio: 0,
      tipo: '2D',
      estado: 'activa'
    };
  }

  /**
   * Obtiene la severidad para el tag de estado
   */
  obtenerSeveridadEstado(estado: string): any {
    switch (estado) {
      case 'activa':
        return 'success';
      case 'cancelada':
        return 'danger';
      case 'completa':
        return 'warning';
      default:
        return 'info';
    }
  }

  /**
   * Obtiene el texto descriptivo del estado
   */
  obtenerTextoEstado(estado: string): string {
    switch (estado) {
      case 'activa':
        return 'activada';
      case 'cancelada':
        return 'cancelada';
      case 'completa':
        return 'marcada como completa';
      default:
        return 'actualizada';
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
  formatearFechaHora(funcion: Funcion): string {
    const fecha = new Date(funcion.fecha).toLocaleDateString('es-ES');
    return `${fecha} - ${funcion.hora}`;
  }

  /**
   * Calcula el porcentaje de ocupación
   */
  calcularOcupacion(funcion: Funcion): number {
    return ((funcion.asientosTotales - funcion.asientosDisponibles) / funcion.asientosTotales) * 100;
  }

  /**
   * Cancela el formulario y cierra el diálogo
   */
  cancelarFormulario() {
    this.mostrarDialogoEdicion = false;
    this.submitted = false;
    this.funcionSeleccionada = this.crearFuncionVacia();
    
    this.messageService.add({
      severity: 'info',
      summary: 'Cancelado',
      detail: 'Los cambios no fueron guardados',
      life: 3000
    });
  }

  /**
   * Maneja el cierre del diálogo
   */
  onHideDialog() {
    this.submitted = false;
    this.funcionSeleccionada = this.crearFuncionVacia();
  }
}