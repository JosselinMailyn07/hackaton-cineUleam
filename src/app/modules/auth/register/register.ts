import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from '@modules/shared/loader/loader';

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
        LoaderComponent
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

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private messageService: MessageService
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

    registrarUsuario() {
        if (this.registroForm.valid) {
            this.cargar = true;
            
            // Simular registro (reemplazar con llamada real al backend)
            setTimeout(() => {
                this.cargar = false;
                this.messageService.add({ 
                    key: 'toast1', 
                    severity: 'success', 
                    summary: 'Éxito', 
                    detail: 'Usuario registrado correctamente' 
                });
                
                // Redirigir al login después de registro exitoso
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 2000);
                
            }, 1500);
            
            // Llamada real al servicio (comentada por ahora)
            /*
            this.authService.registrar(this.registroForm.value).subscribe({
                next: (resp: any) => {
                    this.cargar = false;
                    if (resp.success) {
                        this.messageService.add({ 
                            key: 'toast1', 
                            severity: 'success', 
                            summary: 'Éxito', 
                            detail: 'Usuario registrado correctamente' 
                        });
                        this.router.navigate(['/auth/login']);
                    } else {
                        this.messageService.add({ 
                            key: 'toast1', 
                            severity: 'error', 
                            summary: 'Error', 
                            detail: resp.message 
                        });
                    }
                },
                error: (error: any) => {
                    this.cargar = false;
                    this.messageService.add({ 
                        key: 'toast1', 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: error.message 
                    });
                }
            });
            */
        } else {
            this.messageService.add({ 
                key: 'toast1', 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Por favor complete todos los campos correctamente' 
            });
        }
    }
}