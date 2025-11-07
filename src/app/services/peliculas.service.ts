// src/app/services/peliculas.service.ts
import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '@app/services/supabase';
import { MovieManagementComponent } from '@app/modules/admin/movie-management/movie-management';
@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  private supabase: SupabaseClient;

  constructor(private supabaseService: Supabase) {
    this.supabase = this.supabaseService.supabase;
  }

  // GET - obtener películas
  async obtenerPeliculas() {
    return await this.supabase.from('peliculas').select('*').order('create_at', { ascending: false });
  }

  // POST - crear película
  async crearPelicula(data: any) { // Cambiado de 'Pelicula' a 'any' para evitar el error de tipo.
    return await this.supabase.from('peliculas').insert([data]);
  }

  // PUT - actualizar película
  async actualizarPelicula(id: string, data: any) {
    return await this.supabase.from('peliculas').update(data).eq('id', id);
  }

  // DELETE - eliminar película
  async eliminarPelicula(id: string) {
    return await this.supabase.from('peliculas').delete().eq('id', id);
  }
}
