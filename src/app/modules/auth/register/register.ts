import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog'; // 1. Importar DialogModule
import { LoaderComponent } from '@modules/shared/loader/loader';
import { Auth } from '@services/auth';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        InputTextModule,
        ButtonModule,
        PasswordModule,
        ToastModule,
        ReactiveFormsModule,
        LoaderComponent,
        DialogModule // 2. Añadir DialogModule a los imports
    ],
    templateUrl: './register.html',
    styleUrls: ['./register.scss']
})
export class Register {
    @ViewChild('fileInput') fileInput!: ElementRef;

    registroForm!: FormGroup;
    cargar: boolean = false;
    bloquear_pantalla: boolean = false;
    fotoPerfil: string | ArrayBuffer | null = null;
    mostrarDialogoConfirmacion: boolean = false; // 3. Variable para el diálogo

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        private authService: Auth
    ) {
        this.registroForm = this.fb.group({
            nombres: ['', [Validators.required, Validators.minLength(2)]],
            apellidos: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmarPassword: ['', [Validators.required]]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    passwordMatchValidator(formGroup: FormGroup) {
        const password = formGroup.get('password')?.value;
        const confirmarPassword = formGroup.get('confirmarPassword')?.value;
        return password === confirmarPassword ? null : { passwordMismatch: true };
    }

    // ... (tus métodos de foto de perfil) ...
    seleccionarFoto() {
        this.fileInput.nativeElement.click();
    }
    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.fotoPerfil = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }
    // --- FIN MÉTODOS DE FOTO ---


    async registrarUsuario() {
        // 1. Validar formulario
        if (!this.registroForm.valid) {
            this.messageService.add({
                key: 'toast1',
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor complete todos los campos correctamente'
            });
            Object.values(this.registroForm.controls).forEach(control => {
                control.markAsDirty();
                control.updateValueAndValidity({ onlySelf: true });
            });
            return;
        }

        // 2. Iniciar loader
        this.cargar = true;
        let userId: string | null = null;

        try {
            const formValues = this.registroForm.value;

            // --- PASO 1: Registrar en auth.users ---
            const authData = await this.authService.registrar({
                email: formValues.email,
                password: formValues.password
            });

            if (!authData.user || !authData.session) throw new Error('No se pudo crear el usuario o la sesión');
            
            userId = authData.user.id; // ¡Obtenemos el UUID!

            // --- PASO 1.5: Establecer sesión para que RLS funcione ---
            await this.authService.setSession(authData.session);

            // --- PASO 2: Insertar en public.profiles ---
            await this.authService.crearPerfil({
                userId: userId,
                profileData: {
                    nombres: formValues.nombres,
                    apellidos: formValues.apellidos,
                    telefono: formValues.telefono
                }
            });

            // --- PASO 3: Asignar rol inicial ---
            await this.authService.asignarRolInicial({ userId: userId });

            console.log('Usuario, perfil y rol creados:', authData.user);

            // 4. Mostrar diálogo de éxito
            this.mostrarDialogoConfirmacion = true;

        } catch (error: any) {
            // 5. Manejar cualquier error de los 3 pasos
            this.messageService.add({
                key: 'toast1',
                severity: 'error',
                summary: 'Error en el registro',
                detail: error.message || 'Error desconocido'
            });
            console.error('Error de registro:', error);

        } finally {
            // 6. Detener el loader
            this.cargar = false;
        }
    }

    /**
     * Cierra el diálogo de confirmación y redirige al login.
     */
    cerrarDialogoYRedirigir() {
        this.mostrarDialogoConfirmacion = false;
        this.router.navigate(['/auth/login']);
    }
}