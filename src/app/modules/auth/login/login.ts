import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Auth } from '@services/auth';
import { Eventos } from '@services/eventos';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from '@modules/shared/loader/loader';
import { environment } from '@env/environments';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    ToastModule,
    ReactiveFormsModule,
    LoaderComponent,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [],
})
export class Login {
  bloquear_pantalla: boolean = false;

  loginForm!: FormGroup;
  cargar: boolean = false;

  constructor(
    private authService: Auth,
    private eventos: Eventos,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.loginForm = this.fb.group({
      usuario: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    // const token = localStorage.getItem(this.eventos._AUTH_TOKEN)
    // if (token && !this.eventos['jwtHelper'].isTokenExpired(token)) {
    //     this.router.navigate(['/auth/login']);
    // }
  }

  // obtener_url_logo(url: any): string {
  //     if (!url) return this.isDarkTheme() ? 'assets/images/omega_oscuro.png' : 'assets/images/omega_claro.png';
  //     const path = atob(url);
  //     return environment.url_ficheros + path;
  // }

  async iniciarSesion() {
    if (!this.loginForm.valid) {
      this.messageService.add({
        key: 'toast1',
        severity: 'error',
        summary: 'Campos faltantes o inválidos',
        detail: 'Completar los campos correctamente por favor',
      });
      Object.values(this.loginForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    // this.cargar = true;
    // this.authService.autenticar({
    //     usuario: this.loginForm.value.usuario,
    //     password: this.loginForm.value.password
    // }).subscribe((resp: any) => {
    //     if (resp.p_status) {
    //         // Guardar principales datos
    //         localStorage.setItem(this.eventos._AUTH_TOKEN, resp.p_data.p_datos_inicio_sesion.p_token);
    //         this.eventos.usuario = resp.p_data.p_datos_inicio_sesion;
    //         this.eventos.datos_personales = resp.p_data.p_datos_personales;

    //         // Bloquear pantalla
    //         this.bloquear_pantalla = true;
    //         this.messageService.add({ key: 'toast1', severity: 'success', summary: 'Éxito', detail: 'Sesión Iniciada correctamente' });

    //         // Arrancar el watcher de sesión
    //         // this.eventos.startSessionWatcher();

    //         // Enviar a página principal
    //         // setTimeout(() => {
    //         //     this.eventos.set_rol_activo(resp.p_data.p_datos_inicio_sesion.p_rol_defecto_descripcion)
    //         // }, 2000);

    //     }
    //     this.cargar = false;
    // },
    //     (error:any) => {
    //         this.messageService.add({ key: 'toast1', severity: 'error', summary: 'Error', detail: error.message });
    //         this.cargar = false;

    //     }
    // );
  }
}
