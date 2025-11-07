import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '@app/services/supabase';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  private supabase: SupabaseClient;

  constructor(private supabaseService: Supabase) {
    this.supabase = this.supabaseService.supabase;
  }

  // GET - obtener funciones
  async obtenerFunciones() {
    return await this.supabase
      .from('funciones')
      .select('*')
      .order('fecha_hora_inicio', { ascending: true });
  }

  // POST - crear función
  async crearFuncion(data: any) {
    return await this.supabase
      .from('funciones')
      .insert([data])
      .select();
  }

  // PUT - actualizar función
  async actualizarFuncion(id: string, data: any) {
    return await this.supabase
      .from('funciones')
      .update(data)
      .eq('id', id)
      .select();
  }

  // DELETE - eliminar función
  async eliminarFuncion(id: string) {
    return await this.supabase
      .from('funciones')
      .delete()
      .eq('id', id);
  }
}