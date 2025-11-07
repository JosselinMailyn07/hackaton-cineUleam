import { Component, Input, Output, EventEmitter, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MenuModule,
    ButtonModule,
    InputTextModule,
    TooltipModule
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  @Input() mostrarBotonMenu: boolean = false;
  @Input() mostrarBuscador: boolean = true;
  @Output() menuAlternado = new EventEmitter<void>();
  
  // Estados reactivos
  terminoBusqueda: string = '';
  buscadorExpandido: boolean = false;
  mostrarSugerencias: boolean = false;
  mostrarPanelNotificaciones: boolean = false;
  modoOscuro: boolean = false;
  esMovil: boolean = false;
  preventClose: boolean = false;
  
  @ViewChild('buscadorInput') buscadorInput!: ElementRef<HTMLInputElement>;
  
  // Datos de usuario
  usuarioLogueado: any = null;
  
  // Datos de ejemplo
  itemsNavegacion = [
    { texto: 'Cartelera', icono: 'pi pi-play', ruta: '/cartelera' },
    { texto: 'Estrenos', icono: 'pi pi-star', ruta: '/estrenos' },
    { texto: 'Próximamente', icono: 'pi pi-calendar', ruta: '/proximamente' },
    // { texto: 'Promociones', icono: 'pi pi-tag', ruta: '/promociones' }
  ];

  sugerencias = [
    'Avengers: Endgame',
    'The Batman',
    'Spider-Man: No Way Home',
    'Dune: Part Two',
    'Acción',
    'Comedia',
    'Drama'
  ];

  contadores = {
    peliculas: 24,
    estrenos: 3
  };

  notificaciones = [
    {
      titulo: 'Tu reserva para The Batman fue confirmada',
      tiempo: 'Hace 2 horas',
      icono: 'pi pi-check-circle'
    },
    {
      titulo: 'Nuevo estreno: Dune: Part Two',
      tiempo: 'Hace 1 día',
      icono: 'pi pi-star'
    },
    {
      titulo: 'Promoción especial para estudiantes',
      tiempo: 'Hace 2 días',
      icono: 'pi pi-tag'
    }
  ];

  notificacionesNoLeidas = 2;

  itemsMenu: MenuItem[] = [];
  itemsMenuMovil: MenuItem[] = [];

  ngOnInit() {
    this.verificarViewport();
    this.inicializarUsuario();
    this.configurarMenus();
  }

  @HostListener('window:resize')
  onResize() {
    this.verificarViewport();
  }

  verificarViewport() {
    this.esMovil = window.innerWidth < 768;
  }

  inicializarUsuario() {
    // Simular usuario logueado
    this.usuarioLogueado = {
      nombre: 'María González',
      rol: 'Estudiante',
      email: 'maria.gonzalez@uleam.edu.ec'
    };
  }

  configurarMenus() {
    // Menú de usuario desktop
    this.itemsMenu = [
      {
        label: 'Mi Perfil',
        icon: 'pi pi-user',
        routerLink: '/perfil'
      },
      {
        label: 'Mis Reservas',
        icon: 'pi pi-ticket',
        routerLink: '/reservas'
      },
      {
        label: 'Historial',
        icon: 'pi pi-history',
        routerLink: '/historial'
      },
      {
        label: 'Configuración',
        icon: 'pi pi-cog',
        routerLink: '/configuracion'
      },
      { separator: true },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => this.cerrarSesion(),
        styleClass: 'text-red-500'
      }
    ];

    // Menú móvil
    this.itemsMenuMovil = [
      ...this.itemsNavegacion.map(item => ({
        label: item.texto,
        icon: item.icono,
        routerLink: item.ruta
      })),
      { separator: true },
      ...this.itemsMenu
    ];
  }

  // Métodos interactivos
  alternarMenu() {
    this.menuAlternado.emit();
  }

 // Métodos para la búsqueda
expandirBuscador() {
  this.buscadorExpandido = true;
  this.mostrarSugerencias = true;
  
  // Enfocar el input después de la animación
  setTimeout(() => {
    if (this.buscadorInput) {
      this.buscadorInput.nativeElement.focus();
    }
  }, 150);
}
contraerBuscador() {
  this.buscadorExpandido = false;
  this.mostrarSugerencias = false;
  this.terminoBusqueda = '';
}
onBuscarInput() {
  // Filtrar sugerencias basado en el término de búsqueda
  if (this.terminoBusqueda.trim().length > 0) {
    this.filtrarSugerencias();
  } else {
    this.sugerencias = [];
  }
}

onBuscarBlur() {
  // Pequeño delay para permitir clicks en sugerencias
  setTimeout(() => {
    if (!this.preventClose) {
      this.contraerBuscador();
    }
  }, 200);
}
prevenirBlur(event: MouseEvent) {
  event.preventDefault();
  this.preventClose = true;
  
  setTimeout(() => {
    this.preventClose = false;
  }, 300);
}

filtrarSugerencias() {
  const term = this.terminoBusqueda.toLowerCase();
  const todasSugerencias = [
    'Avengers: Endgame',
    'The Batman', 
    'Spider-Man: No Way Home',
    'Dune: Part Two',
    'Acción',
    'Comedia',
    'Drama',
    'Terror',
    'Ciencia Ficción'
  ];
  
  this.sugerencias = todasSugerencias.filter(sugerencia =>
    sugerencia.toLowerCase().includes(term)
  ).slice(0, 5); // Limitar a 5 sugerencias
}
alternarNotificaciones() {
  this.mostrarPanelNotificaciones = !this.mostrarPanelNotificaciones;
  if (this.mostrarPanelNotificaciones) {
    this.notificacionesNoLeidas = 0;
  }
}

cerrarNotificaciones() {
  this.mostrarPanelNotificaciones = false;
}

seleccionarSugerencia(sugerencia: string) {
  this.terminoBusqueda = sugerencia;
  this.realizarBusqueda();
}

obtenerIniciales(nombre: string): string {
  return nombre
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
}
trackBySugerencia(index: number, sugerencia: string): string {
  return sugerencia;
}

realizarBusqueda() {
  if (this.terminoBusqueda.trim()) {
    console.log('Buscando:', this.terminoBusqueda);
    // Navegar a página de resultados
    this.contraerBuscador();
  }
}
cerrarSesion() {
  // Lógica para cerrar sesión
  console.log('Cerrando sesión...');
  this.usuarioLogueado = null;
  // Aquí se podría llamar a un servicio de autenticación
  // Ejemplo: this.authService.logout();
}
}