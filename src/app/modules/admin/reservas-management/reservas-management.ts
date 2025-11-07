import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HeaderAdminComponent } from '../header-admin/header-admin';
import { FooterComponent } from '@shared/footer/footer';

// Interfaces para tipos de datos
interface Horario {
  horaInicio: string; // Cambiado a string para simplificar
  horaFin: string;
}

interface ConfiguracionAlquiler {
  id?: string;
  nombre: string;
  descripcion: string;
  diasDisponibles: string[];
  horarios: Horario[];
  duracionSesion: number;
  precioBase: number;
  fechaInicio: string; // Cambiado a string para simplificar
  fechaFin: string;
  estado: 'activa' | 'inactiva' | 'programada';
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-rental-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    TagModule,
    TooltipModule,
    ToastModule,
    HeaderAdminComponent,
    FooterComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './reservas-management.html',
  styleUrls: ['./reservas-management.scss']
})
export class ReservasManagementComponent implements OnInit {
  
  // Lista de configuraciones
  listaConfiguraciones: ConfiguracionAlquiler[] = [];
  
  // Configuración seleccionada para edición
  configuracionSeleccionada: ConfiguracionAlquiler = this.crearConfiguracionVacia();
  
  // Estados del componente
  mostrarDialogoEdicion: boolean = false;
  esEdicion: boolean = false;
  cargando: boolean = true;
  submitted: boolean = false;

  // Opciones para dropdowns
  opcionesDias: any[] = [
    { label: 'Lunes', value: 'lunes' },
    { label: 'Martes', value: 'martes' },
    { label: 'Miércoles', value: 'miercoles' },
    { label: 'Jueves', value: 'jueves' },
    { label: 'Viernes', value: 'viernes' },
    { label: 'Sábado', value: 'sabado' },
    { label: 'Domingo', value: 'domingo' }
  ];

  opcionesEstados: any[] = [
    { label: 'Activa', value: 'activa' },
    { label: 'Inactiva', value: 'inactiva' },
    { label: 'Programada', value: 'programada' }
  ];

  // Opciones predefinidas para horarios
  opcionesHorarios: any[] = [
    { label: '09:00 - 12:00', value: { horaInicio: '09:00', horaFin: '12:00' } },
    { label: '14:00 - 17:00', value: { horaInicio: '14:00', horaFin: '17:00' } },
    { label: '19:00 - 22:00', value: { horaInicio: '19:00', horaFin: '22:00' } },
    { label: '10:00 - 13:00', value: { horaInicio: '10:00', horaFin: '13:00' } },
    { label: '15:00 - 18:00', value: { horaInicio: '15:00', horaFin: '18:00' } },
    { label: '20:00 - 23:00', value: { horaInicio: '20:00', horaFin: '23:00' } },
    { label: '22:00 - 02:00', value: { horaInicio: '22:00', horaFin: '02:00' } }
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarConfiguraciones();
  }

  /**
   * Carga la lista de configuraciones
   */
  cargarConfiguraciones() {
    this.cargando = true;
    
    // Simulación de datos
    setTimeout(() => {
      this.listaConfiguraciones = [
        {
          id: '1',
          nombre: 'Configuración Semanal Estándar',
          descripcion: 'Horarios estándar para toda la semana',
          diasDisponibles: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
          horarios: [
            { horaInicio: '09:00', horaFin: '12:00' },
            { horaInicio: '14:00', horaFin: '17:00' },
            { horaInicio: '19:00', horaFin: '22:00' }
          ],
          duracionSesion: 180,
          precioBase: 200,
          fechaInicio: '2024-01-01',
          fechaFin: '2024-12-31',
          estado: 'activa'
        },
        {
          id: '2',
          nombre: 'Fines de Semana Premium',
          descripcion: 'Horarios especiales para fines de semana',
          diasDisponibles: ['sabado', 'domingo'],
          horarios: [
            { horaInicio: '10:00', horaFin: '13:00' },
            { horaInicio: '15:00', horaFin: '18:00' },
            { horaInicio: '20:00', horaFin: '23:00' }
          ],
          duracionSesion: 180,
          precioBase: 250,
          fechaInicio: '2024-01-01',
          fechaFin: '2024-12-31',
          estado: 'activa'
        },
        {
          id: '3',
          nombre: 'Horario Nocturno',
          descripcion: 'Horarios nocturnos especiales',
          diasDisponibles: ['viernes', 'sabado'],
          horarios: [
            { horaInicio: '22:00', horaFin: '02:00' }
          ],
          duracionSesion: 240,
          precioBase: 300,
          fechaInicio: '2024-02-01',
          fechaFin: '2024-06-30',
          estado: 'programada'
        }
      ];
      this.cargando = false;
    }, 1000);
  }

  /**
   * Abre el diálogo para crear una nueva configuración
   */
  abrirDialogoNuevaConfiguracion() {
    this.configuracionSeleccionada = this.crearConfiguracionVacia();
    this.esEdicion = false;
    this.mostrarDialogoEdicion = true;
    this.submitted = false;
  }

  /**
   * Abre el diálogo para editar una configuración existente
   */
  abrirDialogoEditarConfiguracion(configuracion: ConfiguracionAlquiler) {
    this.configuracionSeleccionada = { ...configuracion };
    this.esEdicion = true;
    this.mostrarDialogoEdicion = true;
    this.submitted = false;
  }

  /**
   * Guarda la configuración (crear o actualizar)
   */
  guardarConfiguracion() {
    this.submitted = true;

    if (!this.validarConfiguracion()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Por favor complete todos los campos requeridos correctamente'
      });
      return;
    }

    // Simular guardado
    if (this.esEdicion) {
      const index = this.listaConfiguraciones.findIndex(c => c.id === this.configuracionSeleccionada.id);
      if (index !== -1) {
        this.listaConfiguraciones[index] = { ...this.configuracionSeleccionada };
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Configuración actualizada correctamente'
      });
    } else {
      const nuevaConfiguracion = {
        ...this.configuracionSeleccionada,
        id: (this.listaConfiguraciones.length + 1).toString(),
        createdAt: new Date().toISOString()
      };
      this.listaConfiguraciones.push(nuevaConfiguracion);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Configuración creada correctamente'
      });
    }

    this.mostrarDialogoEdicion = false;
    this.configuracionSeleccionada = this.crearConfiguracionVacia();
  }

  /**
   * Valida los datos de la configuración
   */
  validarConfiguracion(): boolean {
    return !!this.configuracionSeleccionada.nombre &&
           this.configuracionSeleccionada.diasDisponibles.length > 0 &&
           this.configuracionSeleccionada.horarios.length > 0 &&
           this.configuracionSeleccionada.horarios.every(h => h.horaInicio && h.horaFin) &&
           !!this.configuracionSeleccionada.fechaInicio &&
           this.configuracionSeleccionada.duracionSesion > 0 &&
           this.configuracionSeleccionada.precioBase >= 0;
  }

  /**
   * Confirma la eliminación de una configuración
   */
  confirmarEliminacion(configuracion: ConfiguracionAlquiler) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar "${configuracion.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => this.eliminarConfiguracion(configuracion.id!)
    });
  }

  /**
   * Elimina una configuración
   */
  eliminarConfiguracion(id: string) {
    this.listaConfiguraciones = this.listaConfiguraciones.filter(c => c.id !== id);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Configuración eliminada correctamente'
    });
  }

  /**
   * Cambia el estado de una configuración
   */
  cambiarEstadoConfiguracion(configuracion: ConfiguracionAlquiler) {
    const nuevoEstado = configuracion.estado === 'activa' ? 'inactiva' : 'activa';
    configuracion.estado = nuevoEstado;
    
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `Configuración ${nuevoEstado === 'activa' ? 'activada' : 'desactivada'}`
    });
  }

  /**
   * Agrega un nuevo horario
   */
  agregarHorario() {
    this.configuracionSeleccionada.horarios.push({
      horaInicio: '09:00',
      horaFin: '12:00'
    });
  }

  /**
   * Elimina un horario
   */
  eliminarHorario(index: number) {
    if (this.configuracionSeleccionada.horarios.length > 1) {
      this.configuracionSeleccionada.horarios.splice(index, 1);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe haber al menos un horario configurado'
      });
    }
  }

  /**
   * Crea una configuración vacía para formularios nuevos
   */
  crearConfiguracionVacia(): ConfiguracionAlquiler {
    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    
    return {
      nombre: '',
      descripcion: '',
      diasDisponibles: [],
      horarios: [{
        horaInicio: '09:00',
        horaFin: '12:00'
      }],
      duracionSesion: 180,
      precioBase: 200,
      fechaInicio: today.toISOString().split('T')[0],
      fechaFin: nextYear.toISOString().split('T')[0],
      estado: 'activa'
    };
  }

  /**
   * Obtiene la severidad para el tag de estado
   */
  obtenerSeveridadEstado(estado: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (estado) {
      case 'activa':
        return 'success';
      case 'inactiva':
        return 'danger';
      case 'programada':
        return 'warn';
      default:
        return 'info';
    }
  }

  /**
   * Formatea los días para mostrar
   */
  formatearDia(dia: string): string {
    const opcion = this.opcionesDias.find(d => d.value === dia);
    return opcion ? opcion.label : dia;
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatearFecha(fecha: string): string {
    if (!fecha) return 'No definida';
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  /**
   * Cancela el formulario y cierra el diálogo
   */
  cancelarFormulario() {
    this.mostrarDialogoEdicion = false;
    this.submitted = false;
    this.configuracionSeleccionada = this.crearConfiguracionVacia();
    
    this.messageService.add({
      severity: 'info',
      summary: 'Cancelado',
      detail: 'Los cambios no fueron guardados',
      life: 3000
    });
  }

  /**
   * Guarda la configuración como borrador
   */
  guardarBorrador() {
    if (!this.validarConfiguracion()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Complete los campos requeridos para guardar como borrador',
        life: 5000
      });
      return;
    }

    const configuracionBorrador: ConfiguracionAlquiler = {
      ...this.configuracionSeleccionada,
      estado: 'inactiva'
    };

    if (this.esEdicion) {
      const index = this.listaConfiguraciones.findIndex(c => c.id === configuracionBorrador.id);
      if (index !== -1) {
        this.listaConfiguraciones[index] = configuracionBorrador;
      }
    } else {
      const nuevaConfiguracion = {
        ...configuracionBorrador,
        id: (this.listaConfiguraciones.length + 1).toString(),
        createdAt: new Date().toISOString()
      };
      this.listaConfiguraciones.push(nuevaConfiguracion);
    }

    this.mostrarDialogoEdicion = false;
    this.configuracionSeleccionada = this.crearConfiguracionVacia();
    
    this.messageService.add({
      severity: 'success',
      summary: 'Borrador Guardado',
      detail: 'La configuración fue guardada como borrador',
      life: 5000
    });
  }

  /**
   * Maneja el cierre del diálogo
   */
  onHideDialog() {
    this.submitted = false;
    this.configuracionSeleccionada = this.crearConfiguracionVacia();
  }

  /**
   * Selecciona un horario predefinido
   */
  seleccionarHorarioPredefinido(horario: any, index: number) {
    this.configuracionSeleccionada.horarios[index] = { ...horario.value };
  }
}