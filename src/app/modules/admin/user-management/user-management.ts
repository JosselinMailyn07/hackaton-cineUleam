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
import { MenuModule } from 'primeng/menu';

import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { HeaderAdminComponent } from "../header-admin/header-admin";
import { FooterComponent } from "@shared/footer/footer";

// Interfaces para tipos de datos
interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  rol: 'estudiante' | 'administrador' | 'control_acceso';
  estado: 'activo' | 'inactivo' | 'bloqueado';
  fechaRegistro: Date;
  ultimoAcceso?: Date;
  reservasRealizadas: number;
  telefono?: string;
  carrera?: string;
  permisosEspeciales?: string[];
}

interface Rol {
  codigo: 'estudiante' | 'administrador' | 'control_acceso';
  nombre: string;
  descripcion: string;
  permisos: string[];
  icono: string;
  color: string;
}

@Component({
  selector: 'app-user-management',
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
    MenuModule,
    HeaderAdminComponent,
    FooterComponent,
    HeaderAdminComponent,
    FooterComponent
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.scss']
})
export class UserManagementComponent implements OnInit {
  
  // Lista de usuarios
  listaUsuarios: Usuario[] = [];
  
  // Usuario seleccionado para edición
  usuarioSeleccionado: Usuario = this.crearUsuarioVacio();
  
  // Estados del componente
  mostrarDialogoEdicion: boolean = false;
  mostrarDialogoPermisos: boolean = false;
  esEdicion: boolean = false;
  cargando: boolean = true;
  submitted: boolean = false;

  // Filtros
  filtroRol: string = '';
  filtroEstado: string = '';
  terminoBusqueda: string = '';

  // Roles del sistema
  rolesSistema: any[] = [
    {
      label: 'Estudiante',
      value: 'estudiante',
      descripcion: 'Puede ver cartelera y realizar reservas',
      icono: 'pi pi-user',
      color: '#3b82f6'
    },
    {
      label: 'Administrador', 
      value: 'administrador',
      descripcion: 'Acceso completo al sistema de gestión',
      icono: 'pi pi-cog',
      color: '#e30614'
    },
    {
      label: 'Control de Acceso',
      value: 'control_acceso', 
      descripcion: 'Puede validar QR y gestionar asistencia',
      icono: 'pi pi-qrcode',
      color: '#10b981'
    }
  ];

  // Opciones para dropdowns
  opcionesEstados: any[] = [
    { label: 'Activo', value: 'activo' },
    { label: 'Inactivo', value: 'inactivo' },
    { label: 'Bloqueado', value: 'bloqueado' }
  ];

  // Permisos disponibles
  permisosDisponibles: any[] = [
    { label: 'Ver Cartelera', value: 'ver_cartelera' },
    { label: 'Realizar Reservas', value: 'realizar_reservas' },
    { label: 'Ver Historial', value: 'ver_historial' },
    { label: 'Gestionar Usuarios', value: 'gestion_usuarios' },
    { label: 'Gestionar Películas', value: 'gestion_peliculas' },
    { label: 'Gestionar Funciones', value: 'gestion_funciones' },
    { label: 'Validar QR', value: 'validar_qr' },
    { label: 'Gestionar Asistencia', value: 'gestionar_asistencia' },
    { label: 'Ver Reportes', value: 'ver_reportes' },
    { label: 'Ver Reportes Asistencia', value: 'ver_reportes_asistencia' },
    { label: 'Configuración Sistema', value: 'configuracion_sistema' }
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  /**
   * Carga la lista de usuarios desde el servicio
   */
  cargarUsuarios() {
    this.cargando = true;
    
    // Simulación de datos - en producción vendrían de un servicio
    setTimeout(() => {
      this.listaUsuarios = [
        {
          id: '1',
          nombre: 'María González',
          email: 'maria.gonzalez@uleam.edu.ec',
          rol: 'estudiante',
          estado: 'activo',
          fechaRegistro: new Date('2024-01-10'),
          ultimoAcceso: new Date('2024-01-15'),
          reservasRealizadas: 12,
          telefono: '0987654321',
          carrera: 'Ingeniería en Sistemas'
        },
        {
          id: '2',
          nombre: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@uleam.edu.ec',
          rol: 'administrador',
          estado: 'activo',
          fechaRegistro: new Date('2024-01-05'),
          ultimoAcceso: new Date('2024-01-15'),
          reservasRealizadas: 0,
          telefono: '0991234567'
        },
        {
          id: '3',
          nombre: 'Ana Martínez',
          email: 'ana.martinez@uleam.edu.ec',
          rol: 'control_acceso',
          estado: 'activo',
          fechaRegistro: new Date('2024-01-08'),
          ultimoAcceso: new Date('2024-01-14'),
          reservasRealizadas: 0
        }
      ];
      this.cargando = false;
    }, 1000);
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
   * Obtiene las opciones de menú para cambiar roles
   */
  obtenerOpcionesRoles(usuario: Usuario): MenuItem[] {
    return this.rolesSistema
      .filter(rol => rol.value !== usuario.rol)
      .map(rol => ({
        label: rol.label,
        icon: rol.icono,
        command: () => this.asignarRol(usuario, rol.value)
      }));
  }

  /**
   * Abre el diálogo para crear un nuevo usuario
   */
  abrirDialogoNuevoUsuario() {
    this.usuarioSeleccionado = this.crearUsuarioVacio();
    this.esEdicion = false;
    this.mostrarDialogoEdicion = true;
    this.submitted = false;
  }

  /**
   * Abre el diálogo para editar un usuario existente
   */
  abrirDialogoEditarUsuario(usuario: Usuario) {
    this.usuarioSeleccionado = { ...usuario };
    this.esEdicion = true;
    this.mostrarDialogoEdicion = true;
    this.submitted = false;
  }

  /**
   * Guarda el usuario (crear o actualizar)
   */
  guardarUsuario() {
    this.submitted = true;

    // Validación básica
    if (!this.validarUsuario()) {
      return;
    }

    // Simular guardado
    if (this.esEdicion) {
      // Actualizar usuario existente
      const index = this.listaUsuarios.findIndex(u => u.id === this.usuarioSeleccionado.id);
      if (index !== -1) {
        this.listaUsuarios[index] = { 
          ...this.usuarioSeleccionado
        };
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario actualizado correctamente'
      });
    } else {
      // Crear nuevo usuario
      const nuevoUsuario: Usuario = {
        ...this.usuarioSeleccionado,
        id: (this.listaUsuarios.length + 1).toString(),
        fechaRegistro: new Date(),
        reservasRealizadas: 0,
        estado: 'activo'
      };
      this.listaUsuarios.push(nuevoUsuario);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario creado correctamente'
      });
    }

    this.mostrarDialogoEdicion = false;
    this.usuarioSeleccionado = this.crearUsuarioVacio();
  }

  /**
   * Valida los datos del usuario
   */
  validarUsuario(): boolean {
    return !!this.usuarioSeleccionado.nombre &&
           !!this.usuarioSeleccionado.email &&
           !!this.usuarioSeleccionado.rol;
  }

  /**
   * Confirma la eliminación de un usuario
   */
  confirmarEliminacion(usuario: Usuario) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar al usuario "${usuario.nombre}" (${usuario.email})?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => this.eliminarUsuario(usuario.id!)
    });
  }

  /**
   * Elimina un usuario
   */
  eliminarUsuario(id: string) {
    this.listaUsuarios = this.listaUsuarios.filter(u => u.id !== id);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Usuario eliminado correctamente'
    });
  }

  /**
   * Cambia el estado de un usuario
   */
  cambiarEstadoUsuario(usuario: Usuario, nuevoEstado: 'activo' | 'inactivo' | 'bloqueado') {
    usuario.estado = nuevoEstado;
    
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `Usuario ${this.obtenerTextoEstado(nuevoEstado)}`
    });
  }

  /**
   * Asigna un rol a un usuario
   */
  asignarRol(usuario: Usuario, nuevoRol: 'estudiante' | 'administrador' | 'control_acceso') {
    const rolAnterior = usuario.rol;
    usuario.rol = nuevoRol;
    
    this.messageService.add({
      severity: 'success',
      summary: 'Rol Actualizado',
      detail: `Usuario ${usuario.nombre} ahora tiene rol: ${this.obtenerNombreRol(nuevoRol)}`
    });
  }

  /**
   * Crea un usuario vacío para formularios nuevos
   */
  crearUsuarioVacio(): Usuario {
    return {
      nombre: '',
      email: '',
      rol: 'estudiante',
      estado: 'activo',
      fechaRegistro: new Date(),
      reservasRealizadas: 0
    };
  }

  /**
   * Obtiene la severidad para el tag de estado
   */
  obtenerSeveridadEstado(estado: string): any {
    switch (estado) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'warning';
      case 'bloqueado':
        return 'danger';
      default:
        return 'info';
    }
  }

  /**
   * Obtiene la severidad para el tag de rol
   */
  obtenerSeveridadRol(rol: string): any {
    switch (rol) {
      case 'administrador':
        return 'danger';
      case 'control_acceso':
        return 'success';
      case 'estudiante':
        return 'info';
      default:
        return 'secondary';
    }
  }

  /**
   * Obtiene el texto descriptivo del estado
   */
  obtenerTextoEstado(estado: string): string {
    switch (estado) {
      case 'activo':
        return 'activado';
      case 'inactivo':
        return 'desactivado';
      case 'bloqueado':
        return 'bloqueado';
      default:
        return 'actualizado';
    }
  }

  /**
   * Obtiene el nombre del rol
   */
  obtenerNombreRol(rol: string): string {
    const rolEncontrado = this.rolesSistema.find(r => r.value === rol);
    return rolEncontrado ? rolEncontrado.label : rol;
  }

  /**
   * Obtiene la información completa del rol
   */
  obtenerInfoRol(rol: string): any {
    return this.rolesSistema.find(r => r.value === rol) || this.rolesSistema[0];
  }

  /**
   * Obtiene el texto del permiso
   */
  obtenerTextoPermiso(permiso: string): string {
    const permisoEncontrado = this.permisosDisponibles.find(p => p.value === permiso);
    return permisoEncontrado ? permisoEncontrado.label : permiso;
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
   * Filtra los usuarios según los criterios
   */
  get usuariosFiltrados(): Usuario[] {
    return this.listaUsuarios.filter(usuario => {
      const coincideBusqueda = !this.terminoBusqueda || 
        usuario.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        usuario.email.toLowerCase().includes(this.terminoBusqueda.toLowerCase());
      
      const coincideRol = !this.filtroRol || usuario.rol === this.filtroRol;
      const coincideEstado = !this.filtroEstado || usuario.estado === this.filtroEstado;
      
      return coincideBusqueda && coincideRol && coincideEstado;
    });
  }

  /**
   * Obtiene estadísticas de usuarios
   */
  get estadisticasUsuarios() {
    const total = this.listaUsuarios.length;
    const activos = this.listaUsuarios.filter(u => u.estado === 'activo').length;
    const estudiantes = this.listaUsuarios.filter(u => u.rol === 'estudiante').length;
    const administradores = this.listaUsuarios.filter(u => u.rol === 'administrador').length;
    
    return {
      total,
      activos,
      estudiantes,
      administradores,
      porcentajeActivos: total > 0 ? (activos / total * 100) : 0
    };
  }

  /**
   * Cancela el formulario y cierra el diálogo
   */
  cancelarFormulario() {
    this.mostrarDialogoEdicion = false;
    this.mostrarDialogoPermisos = false;
    this.submitted = false;
    this.usuarioSeleccionado = this.crearUsuarioVacio();
  }

  /**
   * Maneja el cierre del diálogo
   */
  onHideDialog() {
    this.submitted = false;
    this.usuarioSeleccionado = this.crearUsuarioVacio();
  }
}