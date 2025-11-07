

import { Injectable } from '@angular/core';
import { environment } from '@env/environments';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  public readonly supabase: SupabaseClient;

  currentSession: BehaviorSubject<Session | null> = new BehaviorSubject<Session | null>(null);
  private currentUserProfile = new BehaviorSubject<any | null>(null);
  public currentUserProfile$ = this.currentUserProfile.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentSession.next(session);
      if (event === 'SIGNED_OUT') {
        this.currentUserProfile.next(null);
      } else if (event === 'SIGNED_IN' && session) {
        this.loadProfile(session.user.id);
      }
    });
  }

  async autenticar(datos: any): Promise<any> {
    const { data: authData, error: authError } =
      await this.supabase.auth.signInWithPassword(datos);

    if (authError) {
      this.currentUserProfile.next(null);
      throw authError;
    }
    if (!authData.user) throw new Error("No se encontró el usuario en la sesión.");

    return this.loadProfile(authData.user.id);
  }

  async loadProfile(userId: string) {
    try {
      // Obtener perfil básico
      const { data: profileData, error: profileError } = await this.supabase
        .from('profiles')
        .select(`
            *,
            usuarios_roles (
              roles (
                id,
                nombre
              )
            )
          `)
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error cargando perfil:', profileError);
        this.currentUserProfile.next(null);
        throw profileError;
      }

      // Obtener email desde auth.users
      const { data: { user }, error: userError } = await this.supabase.auth.getUser();

      if (userError) {
        console.error('Error obteniendo usuario auth:', userError);
      }

      // Combinar datos
      const completeProfile = {
        ...profileData,
        email: user?.email || profileData.email || 'No disponible'
      };

      this.currentUserProfile.next(completeProfile);
      return completeProfile;

    } catch (error) {
      console.error('Error en loadProfile:', error);
      this.currentUserProfile.next(null);
      throw error;
    }
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    this.currentUserProfile.next(null);
    if (error) {
      throw error;
    }
  }

  // --- FLUJO DE REGISTRO ---

  async registrar(datos: any): Promise<any> {
    const { data, error } = await this.supabase.auth.signUp(datos);
    if (error) {
      throw error;
    }
    return data;
  }

  async setSession(session: any): Promise<any> {
    const { data, error } = await this.supabase.auth.setSession(session);
    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * CORREGIDO: Crear perfil sin email (se obtiene de auth.users)
   */
  async crearPerfil(datos: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert({
        id: datos.userId,
        nombres: datos.profileData.nombres,
        apellidos: datos.profileData.apellidos,
        telefono: datos.profileData.telefono,
        estado: 'activo',
        carrera: datos.profileData.carrera
      })
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data;
  }

  async asignarRolInicial(datos: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('usuarios_roles')
      .insert({
        id_usuario: datos.userId,
        id_rol: datos.rolId || 1
      })
      .select();
    if (error) {
      throw error;
    }
    return data;
  }

  // --- Reservas ---
  async createReserva(datos: any) {
    // Asumo que 'datos' es { id_funcion: 10, asientos: {...}, id_usuario: 'UUID' }
    const { data, error } = await this.supabase
      .from('reservas')
      .insert(datos)
      .select();
    if (error) throw error;
    return data;
  }

  async getMisReservas() {
    const { data: userData, error: userError } = await this.supabase.auth.getUser();
    if (userError) throw userError;
    const userId = userData?.user?.id;

    const { data, error } = await this.supabase
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
    return data;
  }


  async cancelarReserva(datos: any) {
    const { data, error } = await this.supabase
      .from('reservas')
      .update({ estado: 'cancelada' })
      .eq('id', datos.reservaId) // Asumo { reservaId: 123 }
      .select();
    if (error) throw error;
    return data;
  }

  // ===============================================
  // === MÉTODOS DE ADMIN (Requieren ROL ADMIN) ===
  // ===============================================

  /**
   * (Admin): Obtiene las reservas más recientes de TODOS los usuarios.
   */
  async getReservasRecientes(datos: any) {
    // Asumo datos = { limit: 20 }
    const { data, error } = await this.supabase
      .from('reservas')
      .select(`
          *,
          profiles ( nombres, apellidos ),
          funciones ( peliculas ( nombre ) )
        `)
      .order('create_at', { ascending: false }) // Más nuevas primero
      .limit(datos.limit);
    if (error) throw error;
    return data;
  }

  // --- Admin: Peliculas (CRUD) ---
  async createPelicula(datos: any) {
    const { data, error } = await this.supabase.from('peliculas').insert(datos).select();
    if (error) throw error;
    return data;
  }

  async updatePelicula(datos: any) {
    // Asumo { id: 5, updateData: { ... } }
    const { data, error } = await this.supabase
      .from('peliculas')
      .update(datos.updateData)
      .eq('id', datos.id)
      .select();
    if (error) throw error;
    return data;
  }

  async deletePelicula(datos: any) {
    // Asumo { id: 5 }
    const { data, error } = await this.supabase
      .from('peliculas')
      .delete()
      .eq('id', datos.id);
    if (error) throw error;
    return data;
  }

  async getPeliculaReciente(datos: any) {
    // Asumo datos = { limit: 20 }
    const { data, error } = await this.supabase
      .from('peliculas')
      .select('*')
      .order('create_at', { ascending: false }) // Más nuevas primero
      .limit(datos.limit);
    if (error) throw error;
    return data;
  }

  // --- Admin: Funciones (CRUD) ---
  async createFuncion(datos: any) {
    const { data, error } = await this.supabase.from('funciones').insert(datos).select();
    if (error) throw error;
    return data;
  }

  async updateFuncion(datos: any) {
    // Asumo { id: 5, updateData: { ... } }
    const { data, error } = await this.supabase
      .from('funciones')
      .update(datos.updateData)
      .eq('id', datos.id)
      .select();
    if (error) throw error;
    return data;
  }

  // ===============================================
  // === MÉTODOS PARA GESTIÓN DE USUARIOS ===
  // ===============================================

  /**
   * CORREGIDO: Obtener perfiles con email desde auth.users
   */
  async getPerfiles() {
    try {
      // Obtener todos los perfiles con sus roles
      const { data: perfiles, error: perfilesError } = await this.supabase
        .from('profiles')
        .select(`
            *,
            usuarios_roles (
              roles (
                id,
                nombre
              )
            )
          `);

      if (perfilesError) throw perfilesError;

      // Obtener todos los usuarios de auth para obtener emails
      const { data: { users }, error: usersError } = await this.supabase.auth.admin.listUsers();

      if (usersError) {
        console.error('Error obteniendo usuarios auth:', usersError);
      }

      // Combinar datos: mapear perfiles con sus emails correspondientes
      const perfilesCompletos = perfiles.map(perfil => {
        const usuarioAuth = users?.find((user: any) => user.id === perfil.id);
        return {
          ...perfil,
          email: usuarioAuth?.email || 'No disponible',
          // Asegurar que siempre tenga un array de usuarios_roles
          usuarios_roles: perfil.usuarios_roles || []
        };
      });

      return perfilesCompletos;

    } catch (error) {
      console.error('Error en getPerfiles:', error);
      throw error;
    }
  }

  /**
   * NUEVO: Obtener conteo de reservas por usuario
   */
  async getReservasCountPorUsuario() {
    try {
      const { data, error } = await this.supabase
        .from('reservas')
        .select('id_usuario, estado');

      if (error) throw error;

      const counts: { [key: string]: number } = {};
      data?.forEach(reserva => {
        if (reserva.estado === 'pendiente' || reserva.estado === 'en curso') {
          counts[reserva.id_usuario] = (counts[reserva.id_usuario] || 0) + 1;
        }
      });

      return counts;
    } catch (error) {
      console.error('Error obteniendo conteo de reservas:', error);
      return {};
    }
  }

  async updateUserProfile(datos: any) {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(datos.updateData)
      .eq('id', datos.userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateUserRoles(datos: any) {
    // 1. Borrar roles antiguos
    const { error: deleteError } = await this.supabase
      .from('usuarios_roles')
      .delete()
      .eq('id_usuario', datos.userId);
    if (deleteError) throw deleteError;

    // 2. Insertar roles nuevos (solo si hay roles para asignar)
    if (datos.newRoles && datos.newRoles.length > 0) {
      const rolesToInsert = datos.newRoles.map((rolId: number) => ({
        id_usuario: datos.userId,
        id_rol: rolId
      }));

      const { data, error: insertError } = await this.supabase
        .from('usuarios_roles')
        .insert(rolesToInsert)
        .select();
      if (insertError) throw insertError;
      return data;
    }

    return [];
  }

  async deleteProfile(datos: any) {
    const { data, error } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', datos.userId);
    if (error) throw error;
    return data;
  }

  async getRoles() {
    const { data, error } = await this.supabase.from('roles').select('*');
    if (error) throw error;
    return data;
  }

  async getUserRoleLinks() {
    const { data, error } = await this.supabase
      .from('usuarios_roles')
      .select(`*`);
    if (error) throw error;
    return data;
  }

  async getPermisosRol() {
    const { data, error } = await this.supabase
      .from('permisosRol')
      .select(`*, roles(nombre), submodulos(nombre, url)`);
    if (error) throw error;
    return data;
  }
  verificacion = {
    verificarReservaDetallada: (
      idUsuario: string,
      idFuncion: number,
      asientos: any
    ) => this.verificarReservaDetallada(this.supabase, idUsuario, idFuncion, asientos),
  };

  async obtenerDataFuncion(idFuncion: number) {
    const { data, error } = await this.supabase
      .from('vista_reservas_detallada')
      .select('*')
      .eq('id_funcion', idFuncion);

    if (error) throw error;
    return data;
  }

  async verificarReservaDetallada(
    supabase: SupabaseClient,
    idUsuario: string,
    idFuncion: number,
    asientos: any
  ) {
    const { data, error } = await supabase.rpc('verificar_reserva_detallada', {
      p_id_usuario: idUsuario,
      p_id_funcion: idFuncion,
      p_asientos: asientos,
    });

    if (error) throw error;
    return data;
  }
  async getUsuarioActual() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }

async getFuncionesPorPelicula(idPelicula: number) {
  console.log(idPelicula)
  const { data, error } = await this.supabase
    .from('funciones')
    .select(`
      id,
      id_peli,
      fecha_hora_inicio,
      salas (codigo, asientos, ubicacion)
    `)
    .eq('id_peli', idPelicula)
    .gt('fecha_hora_inicio', new Date().toISOString())
    .order('fecha_hora_inicio', { ascending: true });

  if (error) throw error;
  return data;
}




}