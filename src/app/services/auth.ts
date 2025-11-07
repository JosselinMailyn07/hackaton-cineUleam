import { Injectable } from '@angular/core';
import { Supabase } from './supabase';
import { BehaviorSubject } from 'rxjs';
import { Session, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // 1. Un BehaviorSubject para mantener el perfil y los roles del usuario.
  private currentUserProfile = new BehaviorSubject<any | null>(null);

  // 2. Un Observable público para que los componentes se suscriban.
  public currentUserProfile$ = this.currentUserProfile.asObservable();

  constructor(private readonly supabaseService: Supabase) { }

  /**
   * Inicia sesión, obtiene el perfil/roles y actualiza el BehaviorSubject.
   */
  async autenticar(datos: any): Promise<any> {
    // PASO 1: Iniciar sesión
    const { data: authData, error: authError } =
      await this.supabaseService.supabase.auth.signInWithPassword(datos);

    if (authError) {
      this.currentUserProfile.next(null);
      throw authError;
    }

    if (!authData.user) {
      throw new Error("No se encontró el usuario en la sesión.");
    }

    // PASO 2: Obtener el perfil Y los roles en una sola consulta
    const { data: profileData, error: profileError } = await this.supabaseService.supabase
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
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error("Error obteniendo el perfil:", profileError);
      this.currentUserProfile.next(null);
      throw profileError;
    }

    // PASO 3: Actualizar el BehaviorSubject
    this.currentUserProfile.next(profileData);

    return profileData;
  }

  /**
   * Cierra la sesión y limpia el BehaviorSubject.
   */
  async logout() {
    const { error } = await this.supabaseService.supabase.auth.signOut();
    // ¡CORRECCIÓN AÑADIDA AQUÍ!
    this.currentUserProfile.next(null); 
    if (error) {
      // Sigue lanzando el error si es necesario
      throw error;
    }
  }

  // --- FLUJO DE REGISTRO ---

  /**
   * PASO 1: Registra al usuario en auth.users (solo email/password).
   */
  async registrar(datos: any): Promise<any> {
    const { data, error } = await this.supabaseService.supabase.auth.signUp(datos);
    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * PASO 1.5: Establece la sesión para que RLS funcione.
   */
  async setSession(session: any): Promise<any> {
    const { data, error } = await this.supabaseService.supabase.auth.setSession(session);
    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * PASO 2: Crea el perfil en public.profiles.
   */
  async crearPerfil(datos: any): Promise<any> {
    const { data, error } = await this.supabaseService.supabase
      .from('profiles')
      .insert({
        id: datos.userId,
        nombres: datos.profileData.nombres,
        apellidos: datos.profileData.apellidos,
        telefono: datos.profileData.telefono
      });

    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * PASO 3: Asigna el rol inicial en public.usuarios_roles.
   */
  async asignarRolInicial(datos: any): Promise<any> {
    const { data, error } = await this.supabaseService.supabase
      .from('usuarios_roles')
      .insert({
        id_usuario: datos.userId, // El UUID
        id_rol: 1 // Rol 1 = 'user' ('estudiante' por defecto)
      });
    if (error) {
      throw error;
    }
    return data;
  }
}