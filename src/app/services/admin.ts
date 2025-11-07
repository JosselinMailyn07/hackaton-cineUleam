import { Injectable } from '@angular/core';
import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class Admin {
  constructor(private readonly supabaseService: Supabase) { }

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

  async crearPelicula(peliculaData: any) {
    // peliculaData debe ser un objeto como:
    // { nombre: '...', duracion: 120, estado: 'estreno', ... }
    const { data, error } = await this.supabaseService.supabase
      .from('peliculas')
      .insert(peliculaData)
      .select() // .select() para que te devuelva el objeto creado
      .single();

    if (error) {
      console.error('Error creando película:', error);
      throw error;
    }
    return data;
  }

  async actualizarPelicula(id: number, peliculaData: any) {
    const { data, error } = await this.supabaseService.supabase
      .from('peliculas')
      .update(peliculaData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error actualizando película ${id}:`, error);
      throw error;
    }
    return data;
  }

  async eliminarPelicula(id: number) {
    const { error } = await this.supabaseService.supabase
      .from('peliculas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error eliminando película ${id}:`, error);
      throw error;
    }
    return true; // Éxito
  }
}
