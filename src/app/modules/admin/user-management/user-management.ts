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
import { Supabase } from '@services/supabase';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
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
    FooterComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.scss']
})
export class UserManagementComponent implements OnInit {

  listaUsuarios: any[] = [];
  usuarioSeleccionado: any = this.crearUsuarioVacio();
  mostrarDialogoEdicion: boolean = false;
  esEdicion: boolean = false;
  cargando: boolean = true;
  submitted: boolean = false;

  filtroRol: string = '';
  filtroEstado: string = '';
  terminoBusqueda: string = '';

  rolesSistema: any[] = [];
  opcionesEstados: any[] = [
    { label: 'Activo', value: 'activo' },
    { label: 'Inactivo', value: 'inactivo' }
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private supabase: Supabase
  ) { }

  async ngOnInit() {
    await this.cargarDatosIniciales();
  }

  async cargarDatosIniciales() {
    try {
      this.cargando = true;
      await this.cargarRoles();
      await this.cargarUsuarios();
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar los datos iniciales'
      });
    } finally {
      this.cargando = false;
    }
  }

  async cargarRoles() {
    try {
      const roles = await this.supabase.getRoles();
      this.rolesSistema = roles.map((rol: any) => ({
        label: this.formatearNombreRol(rol.nombre),
        value: rol.nombre,
        descripcion: this.obtenerDescripcionRol(rol.nombre),
        icono: this.obtenerIconoRol(rol.nombre),
        color: this.obtenerColorRol(rol.nombre),
        id: rol.id
      }));
    } catch (error) {
      console.error('Error cargando roles:', error);
      throw error;
    }
  }

  async cargarUsuarios() {
    try {
      const [perfiles, reservasCount] = await Promise.all([
        this.supabase.getPerfiles(),
        this.supabase.getReservasCountPorUsuario()
      ]);

      this.listaUsuarios = perfiles.map((perfil: any) => {
        // Obtener el rol principal (puede no tener rol asignado)
        const rolPrincipal = perfil.usuarios_roles?.[0]?.roles?.nombre || 'sin_rol';

        return {
          id: perfil.id,
          nombre: `${perfil.nombres || ''} ${perfil.apellidos || ''}`.trim() || 'Usuario sin nombre',
          email: perfil.email || 'No disponible',
          rol: rolPrincipal,
          estado: perfil.estado || 'activo',
          ultimoAcceso: perfil.ultimo_acceso ? new Date(perfil.ultimo_acceso) : null,
          reservasRealizadas: reservasCount[perfil.id] || 0,
          telefono: perfil.telefono,
          carrera: perfil.carrera,
          profileData: perfil
        };
      });

    } catch (error) {
      console.error('Error cargando usuarios:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar los usuarios'
      });
    }
  }

  obtenerIniciales(nombre: string): string {
    if (!nombre || nombre === 'Usuario sin nombre') return '?';

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

  obtenerOpcionesRoles(usuario: any): MenuItem[] {
    // Incluir opción para quitar rol si tiene uno asignado
    const opciones = this.rolesSistema
      .filter(rol => rol.value !== usuario.rol)
      .map(rol => ({
        label: rol.label,
        icon: rol.icono,
        command: () => this.asignarRol(usuario, rol.value, rol.id)
      }));

    // Agregar opción para quitar rol si el usuario tiene uno asignado
    if (usuario.rol !== 'sin_rol') {
      opciones.unshift({
        label: 'Quitar rol',
        icon: 'pi pi-times',
        command: () => this.quitarRol(usuario)
      });
    }

    return opciones;
  }

  abrirDialogoNuevoUsuario() {
    this.usuarioSeleccionado = this.crearUsuarioVacio();
    this.esEdicion = false;
    this.mostrarDialogoEdicion = true;
    this.submitted = false;
  }

  abrirDialogoEditarUsuario(usuario: any) {
    this.usuarioSeleccionado = {
      ...usuario,
      nombres: usuario.profileData?.nombres || '',
      apellidos: usuario.profileData?.apellidos || '',
      email: usuario.email // Mantener el email para mostrar
    };
    this.esEdicion = true;
    this.mostrarDialogoEdicion = true;
    this.submitted = false;
  }

  async guardarUsuario() {
    this.submitted = true;

    if (!this.validarUsuario()) {
      return;
    }

    try {
      if (this.esEdicion) {
        await this.actualizarUsuario();
      } else {
        await this.crearUsuario();
      }

      this.mostrarDialogoEdicion = false;
      this.usuarioSeleccionado = this.crearUsuarioVacio();
      await this.cargarUsuarios();

    } catch (error: any) {
      console.error('Error guardando usuario:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Error al guardar el usuario'
      });
    }
  }

  async actualizarUsuario() {
    const updateData = {
      nombres: this.usuarioSeleccionado.nombres,
      apellidos: this.usuarioSeleccionado.apellidos,
      telefono: this.usuarioSeleccionado.telefono,
      estado: this.usuarioSeleccionado.estado,
      carrera: this.usuarioSeleccionado.carrera
    };

    await this.supabase.updateUserProfile({
      userId: this.usuarioSeleccionado.id,
      updateData: updateData
    });

    // Actualizar rol si cambió (solo si no es "sin_rol")
    const rolActual = this.usuarioSeleccionado.profileData?.usuarios_roles?.[0]?.roles?.nombre || 'sin_rol';
    if (this.usuarioSeleccionado.rol !== rolActual) {
      if (this.usuarioSeleccionado.rol === 'sin_rol') {
        // Quitar todos los roles
        await this.supabase.updateUserRoles({
          userId: this.usuarioSeleccionado.id,
          newRoles: []
        });
      } else {
        // Asignar nuevo rol
        const nuevoRol = this.rolesSistema.find(r => r.value === this.usuarioSeleccionado.rol);
        if (nuevoRol) {
          await this.supabase.updateUserRoles({
            userId: this.usuarioSeleccionado.id,
            newRoles: [nuevoRol.id]
          });
        }
      }
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Usuario actualizado correctamente'
    });
  }

  async crearUsuario() {
    // Para crear usuario necesitamos email y password
    if (!this.usuarioSeleccionado.email) {
      throw new Error('El email es requerido para crear un usuario');
    }

    const datosRegistro = {
      email: this.usuarioSeleccionado.email,
      password: 'TempPassword123!', // Contraseña temporal
      options: {
        data: {
          email: this.usuarioSeleccionado.email
        }
      }
    };

    // PASO 1: Registrar en auth.users
    const { user, error } = await this.supabase.registrar(datosRegistro);

    if (error) throw error;
    if (!user) throw new Error('No se pudo crear el usuario');

    // PASO 2: Crear perfil
    const profileData = {
      userId: user.id,
      profileData: {
        nombres: this.usuarioSeleccionado.nombres,
        apellidos: this.usuarioSeleccionado.apellidos,
        email: this.usuarioSeleccionado.email,
        telefono: this.usuarioSeleccionado.telefono,
        estado: this.usuarioSeleccionado.estado,
        carrera: this.usuarioSeleccionado.carrera
      }
    };

    await this.supabase.crearPerfil(profileData);

    // PASO 3: Asignar rol (solo si no es "sin_rol")
    if (this.usuarioSeleccionado.rol !== 'sin_rol') {
      const rolSeleccionado = this.rolesSistema.find(r => r.value === this.usuarioSeleccionado.rol);
      if (rolSeleccionado) {
        await this.supabase.asignarRolInicial({
          userId: user.id,
          rolId: rolSeleccionado.id
        });
      }
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Usuario creado correctamente'
    });
  }

  validarUsuario(): boolean {
    return !!this.usuarioSeleccionado.nombres || !!this.usuarioSeleccionado.apellidos || !!this.usuarioSeleccionado.email;
  }

  confirmarEliminacion(usuario: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar al usuario "${usuario.nombre}" (${usuario.email})?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => this.eliminarUsuario(usuario)
    });
  }

  async eliminarUsuario(usuario: any) {
    try {
      await this.supabase.deleteProfile({
        userId: usuario.id
      });

      this.listaUsuarios = this.listaUsuarios.filter(u => u.id !== usuario.id);

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario eliminado correctamente'
      });
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al eliminar el usuario'
      });
    }
  }

  async cambiarEstadoUsuario(usuario: any, nuevoEstado: string) {
    try {
      await this.supabase.updateUserProfile({
        userId: usuario.id,
        updateData: { estado: nuevoEstado }
      });

      usuario.estado = nuevoEstado;

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: `Usuario ${this.obtenerTextoEstado(nuevoEstado)}`
      });
    } catch (error) {
      console.error('Error cambiando estado:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cambiar el estado del usuario'
      });
    }
  }

  async asignarRol(usuario: any, nuevoRol: string, rolId: number) {
    try {
      await this.supabase.updateUserRoles({
        userId: usuario.id,
        newRoles: [rolId]
      });

      usuario.rol = nuevoRol;

      this.messageService.add({
        severity: 'success',
        summary: 'Rol Actualizado',
        detail: `Usuario ${usuario.nombre} ahora tiene rol: ${this.obtenerNombreRol(nuevoRol)}`
      });
    } catch (error) {
      console.error('Error asignando rol:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cambiar el rol del usuario'
      });
    }
  }

  async quitarRol(usuario: any) {
    try {
      await this.supabase.updateUserRoles({
        userId: usuario.id,
        newRoles: []
      });

      usuario.rol = 'sin_rol';

      this.messageService.add({
        severity: 'success',
        summary: 'Rol Quitado',
        detail: `Se ha quitado el rol del usuario ${usuario.nombre}`
      });
    } catch (error) {
      console.error('Error quitando rol:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al quitar el rol del usuario'
      });
    }
  }

  crearUsuarioVacio(): any {
    return {
      nombres: '',
      apellidos: '',
      email: '',
      rol: 'sin_rol',
      estado: 'activo',
      telefono: '',
      carrera: ''
    };
  }

  obtenerSeveridadEstado(estado: string): any {
    switch (estado) {
      case 'activo': return 'success';
      case 'inactivo': return 'warning';
      default: return 'info';
    }
  }

  obtenerSeveridadRol(rol: string): any {
    switch (rol) {
      case 'admin': return 'danger';
      case 'access': return 'success';
      case 'user': return 'info';
      case 'sin_rol': return 'secondary';
      default: return 'secondary';
    }
  }

  obtenerTextoEstado(estado: string): string {
    switch (estado) {
      case 'activo': return 'activado';
      case 'inactivo': return 'desactivado';
      default: return 'actualizado';
    }
  }

  obtenerNombreRol(rol: string): string {
    if (rol === 'sin_rol') return 'Sin rol asignado';
    return this.formatearNombreRol(rol);
  }

  obtenerInfoRol(rol: string): any {
    if (rol === 'sin_rol') {
      return {
        label: 'Sin rol asignado',
        descripcion: 'Usuario sin permisos específicos',
        icono: 'pi pi-user',
        color: '#6b7280'
      };
    }
    return this.rolesSistema.find(r => r.value === rol) || this.rolesSistema[0];
  }

  formatearFecha(fecha: Date): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  formatearFechaHora(fecha: Date): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleString('es-ES');
  }

  get usuariosFiltrados(): any[] {
    return this.listaUsuarios.filter(usuario => {
      const coincideBusqueda = !this.terminoBusqueda ||
        usuario.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        usuario.email.toLowerCase().includes(this.terminoBusqueda.toLowerCase());

      const coincideRol = !this.filtroRol || usuario.rol === this.filtroRol;
      const coincideEstado = !this.filtroEstado || usuario.estado === this.filtroEstado;

      return coincideBusqueda && coincideRol && coincideEstado;
    });
  }

  get estadisticasUsuarios() {
    const total = this.listaUsuarios.length;
    const activos = this.listaUsuarios.filter(u => u.estado === 'activo').length;
    const estudiantes = this.listaUsuarios.filter(u => u.rol === 'user').length;
    const administradores = this.listaUsuarios.filter(u => u.rol === 'admin').length;
    const sinRol = this.listaUsuarios.filter(u => u.rol === 'sin_rol').length;

    return {
      total,
      activos,
      estudiantes,
      administradores,
      sinRol,
      porcentajeActivos: total > 0 ? (activos / total * 100) : 0
    };
  }

  cancelarFormulario() {
    this.mostrarDialogoEdicion = false;
    this.submitted = false;
    this.usuarioSeleccionado = this.crearUsuarioVacio();
  }

  onHideDialog() {
    this.submitted = false;
    this.usuarioSeleccionado = this.crearUsuarioVacio();
  }

  // Métodos auxiliares
  private formatearNombreRol(rol: string): string {
    switch (rol) {
      case 'user': return 'Estudiante';
      case 'admin': return 'Administrador';
      case 'access': return 'Control de Acceso';
      default: return rol;
    }
  }

  private obtenerDescripcionRol(rol: string): string {
    switch (rol) {
      case 'user': return 'Puede ver cartelera y realizar reservas';
      case 'admin': return 'Acceso completo al sistema de gestión';
      case 'access': return 'Puede validar QR y gestionar asistencia';
      default: return 'Rol del sistema';
    }
  }

  private obtenerIconoRol(rol: string): string {
    switch (rol) {
      case 'user': return 'pi pi-user';
      case 'admin': return 'pi pi-cog';
      case 'access': return 'pi pi-qrcode';
      default: return 'pi pi-user';
    }
  }

  private obtenerColorRol(rol: string): string {
    switch (rol) {
      case 'user': return '#3b82f6';
      case 'admin': return '#e30614';
      case 'access': return '#10b981';
      default: return '#6b7280';
    }
  }
}