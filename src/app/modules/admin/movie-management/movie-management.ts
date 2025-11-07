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
// import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
// import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PeliculasService } from '@app/services/peliculas.service';
import { HeaderAdminComponent } from '../header-admin/header-admin';
import { FooterComponent } from '@shared/footer/footer';
import { Select, SelectModule } from 'primeng/select';

// Interface alineada con la base de datos
interface Pelicula {
  id?: number;
  nombre: string;
  duracion: number;
  categorias: any[]; // IDs de categorías
  imagen: string;
  director: string | null;
  autores: string | null;
  descripcion: string;
  estado: 'cartelera' | 'estreno' | 'proximamente' | 'retirada';
  clasificacion: string | null;
  url_trailer: string | null;
  fecha_estreno: string;
  create_at?: string;
  update_at?: string | null;
}

// Mapeo de categorías
const MAPA_CATEGORIAS: { [key: number]: string } = {
  1: 'Acción',
  2: 'Comedia', 
  3: 'Drama',
  4: 'Terror',
  5: 'Aventura',
  6: 'Romance',
  7: 'Animación',
  8: 'Suspenso',
  9: 'Ciencia Ficción'
};

@Component({
  selector: 'app-movie-management',
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
    // DropdownModule,
    MultiSelectModule,
    SelectModule,
 
    FileUploadModule,
    TagModule,
    TooltipModule,
    ToastModule,
    HeaderAdminComponent,
    FooterComponent
  ],
  providers: [MessageService, ConfirmationService, CommonModule, HeaderAdminComponent, FooterComponent],
  templateUrl: './movie-management.html',
  styleUrls: ['./movie-management.scss']
})
export class MovieManagementComponent implements OnInit {
  
  // Lista de películas
  listaPeliculas: Pelicula[] = [];
  
  // Película seleccionada para edición
  peliculaSeleccionada: Pelicula = this.crearPeliculaVacia();
  
  // Estados del componente
  mostrarDialogoEdicion: boolean = false;
  esEdicion: boolean = false;
  cargando: boolean = true;
  submitted: boolean = false;

  // Opciones para dropdowns
  opcionesCategorias: any[] = [
    { label: 'Acción', value: 1 },
    { label: 'Comedia', value: 2 },
    { label: 'Drama', value: 3 },
    { label: 'Terror', value: 4 },
    { label: 'Aventura', value: 5 },
    { label: 'Romance', value: 6 },
    { label: 'Animación', value: 7 },
    { label: 'Suspenso', value: 8 },
    { label: 'Ciencia Ficción', value: 9 }
  ];

  opcionesClasificacion: any[] = [
    { label: 'A - Todo Público', value: 'A' },
    { label: 'B - 12+ años', value: 'B' },
    { label: 'B15 - 15+ años', value: 'B15' },
    { label: 'C - 18+ años', value: 'C' },
    { label: 'D - Películas Adultas', value: 'D' }
  ];

  opcionesEstados: any[] = [
    { label: 'Cartelera', value: 'cartelera' },
    { label: 'Estreno', value: 'estreno' },
    { label: 'Próximamente', value: 'proximamente' },
    { label: 'Retirada', value: 'retirada' }
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private peliculaService: PeliculasService
  ) {}

  async ngOnInit() {
    await this.cargarPeliculas();
  }
  
  /**
   * Carga la lista de películas desde el servicio
   */
  async cargarPeliculas() {
    this.cargando = true;
  
    const { data, error } = await this.peliculaService.obtenerPeliculas();
  
    if (error) {
      console.error('Error cargando películas:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No se pudieron cargar las películas.' 
      });
    } else {
      this.listaPeliculas = data || [];
      console.log('Películas cargadas:', this.listaPeliculas);
    }
  
    this.cargando = false;
  }

  /**
   * Abre el diálogo para crear una nueva película
   */
  abrirDialogoNuevaPelicula() {
    this.peliculaSeleccionada = this.crearPeliculaVacia();
    this.esEdicion = false;
    this.mostrarDialogoEdicion = true;
    this.submitted = false;
  }

  /**
   * Abre el diálogo para editar una película existente
   */
  abrirDialogoEditarPelicula(pelicula: Pelicula) {
    this.peliculaSeleccionada = { ...pelicula };
    this.esEdicion = true;
    this.mostrarDialogoEdicion = true;
    this.submitted = false;
  }

  /**
   * Guarda la película (crear o actualizar)
   */
 /**
 * Guarda la película (crear o actualizar)
 */
async guardarPelicula() {
  this.submitted = true;

  // Convertir fecha a formato ISO si es necesario
  if (this.peliculaSeleccionada.fecha_estreno && typeof this.peliculaSeleccionada.fecha_estreno !== 'string') {
    this.peliculaSeleccionada.fecha_estreno = new Date(this.peliculaSeleccionada.fecha_estreno).toISOString().split('T')[0];
  }

  if (!this.validarPelicula()) {
    this.messageService.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Complete los campos obligatorios' 
    });
    return;
  }

  try {
    if (this.esEdicion) {
      const { error } = await this.peliculaService.actualizarPelicula(
        this.peliculaSeleccionada.id!.toString(), 
        this.peliculaSeleccionada
      );
      
      if (error) throw error;
      
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Película actualizada correctamente' 
      });
    } else {
      const { error } = await this.peliculaService.crearPelicula(this.peliculaSeleccionada);
      
      if (error) throw error;
      
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Película creada correctamente' 
      });
    }

    this.mostrarDialogoEdicion = false;
    await this.cargarPeliculas();
    
  } catch (error) {
    console.error('Error guardando película:', error);
    this.messageService.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al guardar la película' 
    });
  }
}

  /**
   * Valida los datos de la película
   */
  validarPelicula(): boolean {
    return !!this.peliculaSeleccionada.nombre &&
           !!this.peliculaSeleccionada.descripcion &&
           this.peliculaSeleccionada.categorias.length > 0 &&
           !!this.peliculaSeleccionada.fecha_estreno;
  }

  /**
   * Confirma la eliminación de una película
   */
  confirmarEliminacion(pelicula: Pelicula) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar "${pelicula.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => this.eliminarPelicula(pelicula.id!)
    });
  }

  /**
   * Elimina una película
   */
  async eliminarPelicula(id: number) {
    try {
      await this.peliculaService.eliminarPelicula(id.toString());
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Película eliminada correctamente' 
      });
      await this.cargarPeliculas();
    } catch (error) {
      console.error('Error eliminando película:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Error al eliminar la película' 
      });
    }
  }

  /**
   * Cambia el estado de una película
   */
  async cambiarEstadoPelicula(pelicula: Pelicula) {
    const nuevoEstado = this.obtenerSiguienteEstado(pelicula.estado);
    
    try {
      await this.peliculaService.actualizarPelicula(
        pelicula.id!.toString(), 
        { estado: nuevoEstado }
      );
      
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: `Película ${this.formatearEstado(nuevoEstado)}`
      });
      
      await this.cargarPeliculas();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Error al cambiar el estado' 
      });
    }
  }

  /**
   * Obtiene el siguiente estado
   */
  private obtenerSiguienteEstado(estadoActual: string): string {
    const estados = ['proximamente', 'estreno', 'cartelera', 'retirada'];
    const indexActual = estados.indexOf(estadoActual);
    return estados[(indexActual + 1) % estados.length];
  }

  /**
   * Formatea el estado para mostrar
   */
  private formatearEstado(estado: string): string {
    const estados: { [key: string]: string } = {
      'proximamente': 'marcada como próximamente',
      'estreno': 'marcada como estreno', 
      'cartelera': 'marcada en cartelera',
      'retirada': 'retirada de cartelera'
    };
    return estados[estado] || estado;
  }

  /**
   * Crea una película vacía para formularios nuevos
   */
  crearPeliculaVacia(): Pelicula {
    return {
      nombre: '',
      descripcion: '',
      duracion: 120,
      categorias: [],
      imagen: '',
      director: '',
      autores: '',
      estado: 'proximamente',
      clasificacion: 'A',
      url_trailer: '',
      fecha_estreno: new Date().toISOString().split('T')[0]
    };
  }

  /**
   * Obtiene la severidad para el tag de estado
   */
  obtenerSeveridadEstado(estado: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (estado) {
      case 'cartelera':
        return 'success';
      case 'estreno':
        return 'info';
      case 'proximamente':
        return 'warn';
      case 'retirada':
        return 'danger';
      default:
        return 'info';
    }
  }

  /**
   * Formatea las categorías para mostrar
   */
  formatearCategorias(categorias: any[]): string {
    if (!categorias || !Array.isArray(categorias)) return '';
    
    return categorias
      .map(catId => MAPA_CATEGORIAS[catId] || `Categoría ${catId}`)
      .join(', ');
  }

  /**
   * Maneja la subida de imágenes
   */
  onUploadImagen(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.peliculaSeleccionada.imagen = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Cancela el formulario y cierra el diálogo
   */
  cancelarFormulario() {
    this.mostrarDialogoEdicion = false;
    this.submitted = false;
    this.peliculaSeleccionada = this.crearPeliculaVacia();
    
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
    this.peliculaSeleccionada = this.crearPeliculaVacia();
  }
}