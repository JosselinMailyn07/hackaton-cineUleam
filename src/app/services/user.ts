import { Injectable } from '@angular/core';
import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class User {
  constructor(private readonly supabaseService: Supabase) { }

  async obtenerCategorias() {
    const { data, error } = await this.supabaseService.supabase.from('vista_categorias').select('*');

    if (error) throw error;
    return data;
  }

  async getPeliculas() {
    const { data, error } = await this.supabaseService.supabase
      .from('peliculas')
      .select('*');

    if (error) {
      throw error;
    }
    return data;
  }

  async getCategorias() {
    const { data, error } = await this.supabaseService.supabase
      .from('categorias')
      .select('id, nombre') // Solo traemos id y nombre
      .eq('estado', 'activo'); // Opcional: solo traer categorías activas

    if (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }
    return data;
  }

  async getPeliculaById(id: number) {
    const { data, error } = await this.supabaseService.supabase
      .from('peliculas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error obteniendo película ${id}:`, error);
      throw error;
    }
    return data;
  }
}
