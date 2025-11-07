import { Injectable } from '@angular/core';
import { environment } from '@env/environments';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  public readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // --- Peliculas ---
  async getPeliculas() {
    const { data, error } = await this.supabase.from('peliculas').select('*');
    if (error) throw error;
    return data;
  }

  /**
   * Obtiene películas con límite y ordenadas por estreno.
   */
  async getPeliculasRecientes(datos: any) {
    // Asumo datos = { limit: 5 }
    const { data, error } = await this.supabase
      .from('peliculas')
      .select('*')
      .order('fecha_estreno', { ascending: false }) // Más nuevas primero
      .limit(datos.limit);
    if (error) throw error;
    return data;
  }

  async getPeliculaById(datos: any) {
    const { data, error } = await this.supabase
      .from('peliculas')
      .select('*')
      .eq('id', datos.id) // Asumo { id: 5 }
      .single();
    if (error) throw error;
    return data;
  }

  // --- Categorias ---
  async getCategorias() {
    const { data, error } = await this.supabase
      .from('categorias')
      .select('id, nombre')
      .eq('estado', 'activo');
    if (error) throw error;
    return data;
  }

  // --- Funciones ---
  async getFunciones() {
    const { data, error } = await this.supabase
      .from('funciones')
      .select(`*, salas ( id, codigo, ubicacion ), peliculas ( id, nombre, imagen, duracion )`);
    if (error) throw error;
    return data;
  }

  /**
   * Obtiene funciones con límite y ordenadas por inicio.
   */
  async getFuncionesRecientes(datos: any) {
    // Asumo datos = { limit: 10 }
    const { data, error } = await this.supabase
      .from('funciones')
      .select(`*, salas ( id, codigo ), peliculas ( id, nombre )`)
      .order('fecha_hora_inicio', { ascending: true }) // Las más próximas a empezar
      .limit(datos.limit);
    if (error) throw error;
    return data;
  }


  async getFuncionesPorPelicula(datos: any) {
    const { data, error } = await this.supabase
      .from('funciones')
      .select(`*, salas ( id, codigo, ubicacion )`)
      .eq('id_peli', datos.peliculaId); // Asumo { peliculaId: 5 }
    if (error) throw error;
    return data;
  }

  // --- Salas ---
  async getSalas() {
    const { data, error } = await this.supabase.from('salas').select('*');
    if (error) throw error;
    return data;
  }

  // ===============================================
  // === MÉTODOS DE ACCIÓN (Usuario Logueado) ===
  // ===============================================

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
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const { data, error } = await this.supabase
      .from('reservas')
      .select(`*, funciones ( fecha_hora_inicio, peliculas ( nombre, imagen ) )`)
      .eq('id_usuario', user.id);

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
      .select(`*`)
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

  // --- Admin: Lectura de Tablas de Sistema ---
  async getRoles() {
    const { data, error } = await this.supabase.from('roles').select('*');
    if (error) throw error;
    return data;
  }

  async getPerfiles() {
    const { data, error } = await this.supabase.from('profiles').select('*, usuarios_roles(roles(nombre))');
    if (error) throw error;
    return data;
  }

  async getModulos() {
    const { data, error } = await this.supabase.from('modulos').select('*');
    if (error) throw error;
    return data;
  }

  async getSubmodulos() {
    const { data, error } = await this.supabase.from('submodulos').select('*');
    if (error) throw error;
    return data;
  }
}