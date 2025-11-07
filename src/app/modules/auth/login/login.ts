import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Auth } from '@services/auth';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from '@modules/shared/loader/loader';

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
  loginForm!: FormGroup;
  bloquear_pantalla: boolean = false;

  cargar: boolean = false;

  constructor(
    private authService: Auth,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  async iniciarSesion() {
    // 1. Validar el formulario
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

    // 2. Iniciar el loader
    this.cargar = true;

    try {
      // 3. Llamar a tu servicio de Auth
      // ¡autenticar() ya hace el login Y guarda el perfil en el BehaviorSubject!
      const perfilCompleto = await this.authService.autenticar(this.loginForm.value);

      // 4. Manejar el éxito
      this.messageService.add({
        key: 'toast1',
        severity: 'success',
        summary: 'Éxito',
        detail: `Bienvenido, ${perfilCompleto.nombres}!`
      });

      console.log('Inicio de sesión exitoso, perfil cargado:', perfilCompleto);

      setTimeout(() => {
        this.router.navigate(['/user/cartelera']);
      }, 2000);
    } catch (error: any) {
      // 5. Manejar el error de Supabase
      this.messageService.add({
        key: 'toast1',
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Error desconocido al iniciar sesión'
      });
      console.error('Error de autenticación:', error);

    } finally {
      // 6. Detener el loader (siempre se ejecuta)
      this.cargar = false;
    }
  }
}