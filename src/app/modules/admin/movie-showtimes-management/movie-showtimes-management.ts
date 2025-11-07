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
import { SelectModule } from 'primeng/select';
// import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { MessageService, ConfirmationService } from 'primeng/api';
import { FuncionesService } from '@app/services/funciones.service';
import { PeliculasService } from '@app/services/peliculas.service';
import { FooterComponent } from '@shared/footer/footer';
import { HeaderAdminComponent } from '../header-admin/header-admin';
// Interfaces alineadas con la base de datos
interface Funcion {
  id?: number;
  id_sala: number;
  id_peli: number;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  create_at?: string;
  update_at?: string | null;
  // Campos para mostrar en la tabla
  pelicula_nombre?: string;
  pelicula_duracion?: number;
  sala_nombre?: string;
}

interface Pelicula {
  id: number;
  nombre: string;
  duracion: number;
  estado: string;
}

interface Sala {
  id: number;
  nombre: string;
  capacidad: number;
  tipo: string;
}

@Component({
  selector: 'app-movie-showtimes-management',
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
    SelectModule,
    InputNumberModule,
    TagModule,
    ToastModule,
    TooltipModule,
    FooterComponent,
    HeaderAdminComponent
],
  providers: [MessageService, ConfirmationService, FooterComponent, HeaderAdminComponent],
  templateUrl: './movie-showtimes-management.html',
  styleUrls: ['./movie-showtimes-management.scss']
})
export class MovieShowtimesManagementComponent implements OnInit {
  
  // Lista de funciones
  listaFunciones: Funcion[] = [];
  
  // Función seleccionada para edición
  funcionSeleccionada: Funcion = this.crearFuncionVacia();
  
  // Listas para dropdowns
  listaPeliculas: Pelicula[] = [];
  listaSalas: Sala[] = [];
  
  // Estados del componente
  mostrarDialogoEdicion: boolean = false;
  esEdicion: boolean = false;
  cargando: boolean = true;
  submitted: boolean = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private funcionesService: FuncionesService,
    private peliculasService: PeliculasService
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  /**
   * Carga todos los datos necesarios
   */
  async cargarDatos() {
    this.cargando = true;
    
    try {
      await Promise.all([
        this.cargarPeliculas(),
        this.cargarSalas(),
        this.cargarFunciones()
      ]);
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Error al cargar los datos' 
      });
    } finally {
      this.cargando = false;
    }
  }

  /**
   * Carga la lista de películas
   */
  async cargarPeliculas() {
    const { data, error } = await this.peliculasService.obtenerPeliculas();
    
    if (error) {
      console.error('Error cargando películas:', error);
      throw error;
    }
    
    this.listaPeliculas = data || [];
  }

  /**
   * Carga la lista de salas (simulada por ahora)
   */
  async cargarSalas() {
    // Simulación de salas - en producción vendría de un servicio
    this.listaSalas = [
      { id: 1, nombre: 'Sala 1 - Premium', capacidad: 120, tipo: '2D' },
      { id: 2, nombre: 'Sala 2 - Standard', capacidad: 80, tipo: '2D' },
      { id: 3, nombre: 'Sala 3 - IMAX', capacidad: 150, tipo: '3D' },
      { id: 4, nombre: 'Sala 4 - 4DX', capacidad: 100, tipo: '4DX' },
      { id: 5, nombre: 'Sala 5 - Standard', capacidad: 90, tipo: '2D' }
    ];
  }

  /**
   * Carga la lista de funciones
   */
  async cargarFunciones() {
    const { data, error } = await this.funcionesService.obtenerFunciones();
    
    if (error) {
      console.error('Error cargando funciones:', error);
      throw error;
    }
    
    this.listaFunciones = data || [];
    
    // Enriquecer datos para mostrar
    this.enriquecerDatosFunciones();
  }

  /**
   * Enriquece los datos de las funciones con información de películas y salas
   */
  enriquecerDatosFunciones() {
    this.listaFunciones = this.listaFunciones.map(funcion => {
      const pelicula = this.listaPeliculas.find(p => p.id === funcion.id_peli);
      const sala = this.listaSalas.find(s => s.id === funcion.id_sala);
      
      return {
        ...funcion,
        pelicula_nombre: pelicula?.nombre || 'Película no encontrada',
        pelicula_duracion: pelicula?.duracion || 0,
        sala_nombre: sala?.nombre || 'Sala no encontrada'
      };
    });
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
  async guardarFuncion() {
    this.submitted = true;

    if (!this.validarFuncion()) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Complete todos los campos requeridos' 
      });
      return;
    }

    try {
      // Calcular fecha_hora_fin basado en la duración de la película
      await this.calcularFechaFin();

      if (this.esEdicion) {
        const { error } = await this.funcionesService.actualizarFuncion(
          this.funcionSeleccionada.id!.toString(), 
          this.funcionSeleccionada
        );
        
        if (error) throw error;
        
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Función actualizada correctamente' 
        });
      } else {
        const { error } = await this.funcionesService.crearFuncion(this.funcionSeleccionada);
        
        if (error) throw error;
        
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Función creada correctamente' 
        });
      }

      this.mostrarDialogoEdicion = false;
      await this.cargarFunciones();
      
    } catch (error) {
      console.error('Error guardando función:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Error al guardar la función' 
      });
    }
  }

  /**
   * Calcula la fecha_hora_fin basado en la duración de la película
   */
  async calcularFechaFin() {
    const pelicula = this.listaPeliculas.find(p => p.id === this.funcionSeleccionada.id_peli);
    
    if (pelicula && this.funcionSeleccionada.fecha_hora_inicio) {
      const fechaInicio = new Date(this.funcionSeleccionada.fecha_hora_inicio);
      const fechaFin = new Date(fechaInicio.getTime() + pelicula.duracion * 60000); // minutos a milisegundos
      
      this.funcionSeleccionada.fecha_hora_fin = fechaFin.toISOString();
    }
  }

  /**
   * Valida los datos de la función
   */
  validarFuncion(): boolean {
    return !!this.funcionSeleccionada.id_peli &&
           !!this.funcionSeleccionada.id_sala &&
           !!this.funcionSeleccionada.fecha_hora_inicio;
  }

  /**
   * Confirma la eliminación de una función
   */
  confirmarEliminacion(funcion: Funcion) {
    const peliculaNombre = funcion.pelicula_nombre || 'Película desconocida';
    const fechaHora = this.formatearFechaHora(funcion.fecha_hora_inicio);
    
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la función de "${peliculaNombre}" el ${fechaHora}?`,
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
  async eliminarFuncion(id: number) {
    try {
      const { error } = await this.funcionesService.eliminarFuncion(id.toString());
      
      if (error) throw error;
      
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Función eliminada correctamente' 
      });
      
      await this.cargarFunciones();
    } catch (error) {
      console.error('Error eliminando función:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Error al eliminar la función' 
      });
    }
  }

  /**
   * Crea una función vacía para formularios nuevos
   */
  crearFuncionVacia(): Funcion {
    const fechaInicio = new Date();
    fechaInicio.setHours(19, 0, 0, 0); // Establecer a las 7:00 PM por defecto
    
    return {
      id_sala: 0,
      id_peli: 0,
      fecha_hora_inicio: fechaInicio.toISOString(),
      fecha_hora_fin: ''
    };
  }

  /**
   * Obtiene la severidad para el tag basado en el estado temporal
   */
  obtenerSeveridadEstado(funcion: Funcion): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    const ahora = new Date();
    const fechaInicio = new Date(funcion.fecha_hora_inicio);
    const fechaFin = new Date(funcion.fecha_hora_fin);
    
    if (fechaInicio > ahora) {
      return 'success'; // Programada
    } else if (fechaInicio <= ahora && fechaFin >= ahora) {
      return 'info'; // En curso
    } else {
      return 'secondary'; // Finalizada
    }
  }

  /**
   * Obtiene el texto del estado basado en las fechas
   */
  obtenerTextoEstado(funcion: Funcion): string {
    const ahora = new Date();
    const fechaInicio = new Date(funcion.fecha_hora_inicio);
    const fechaFin = new Date(funcion.fecha_hora_fin);
    
    if (fechaInicio > ahora) {
      return 'Programada';
    } else if (fechaInicio <= ahora && fechaFin >= ahora) {
      return 'En Curso';
    } else {
      return 'Finalizada';
    }
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatearFecha(fechaString: string): string {
    return new Date(fechaString).toLocaleDateString('es-ES');
  }

  /**
   * Formatea la fecha y hora para mostrar
   */
  formatearFechaHora(fechaString: string): string {
    const fecha = new Date(fechaString);
    return `${fecha.toLocaleDateString('es-ES')} ${fecha.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  }

  /**
   * Formatea la duración de minutos a formato legible
   */
  formatearDuracion(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
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