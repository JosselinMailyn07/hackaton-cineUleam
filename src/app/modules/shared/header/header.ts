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
  
  @ViewChild('buscadorInput') buscadorInput!: ElementRef;

  // Estados responsive
  terminoBusqueda: string = '';
  buscadorExpandido: boolean = false;
  mostrarPanelNotificaciones: boolean = false;
  mostrarSugerencias: boolean = false;
  preventClose: boolean = false;
  menuAbierto: boolean = false;
  mostrarMenuMovil: boolean = false;
  mostrarModalBusqueda: boolean = false;
  terminoBusquedaMovil: string = '';
  sugerenciasMovil: string[] = [];

  // Detección de viewport
  esMovil: boolean = false;
  esMovilPequena: boolean = false;
  esTablet: boolean = false;
  esDesktop: boolean = false;

  // Datos de usuario
  usuarioLogueado: any = null;

  // Datos de ejemplo
  itemsNavegacion = [
    { texto: 'Cartelera', icono: 'pi pi-play', ruta: '/user/cartelera' },
    { texto: 'Estrenos', icono: 'pi pi-star', ruta: '/estrenos' },
    { texto: 'Próximamente', icono: 'pi pi-calendar', ruta: '/proximamente' },
    { texto: 'Alquiler', icono: 'pi pi-calendar', ruta: '/user/alquiler' },
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
    
    // Cerrar menú móvil si se cambia a desktop
    if (!this.esMovil && this.mostrarMenuMovil) {
      this.cerrarMenuMovil();
    }
    
    // Cerrar modales si cambia el tamaño
    if (this.esMovil && this.buscadorExpandido) {
      this.contraerBuscador();
    }
    
    if (!this.esMovilPequena && this.mostrarModalBusqueda) {
      this.cerrarModalBusqueda();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.mostrarMenuMovil) {
      this.cerrarMenuMovil();
    }
    if (this.mostrarModalBusqueda) {
      this.cerrarModalBusqueda();
    }
    if (this.mostrarPanelNotificaciones) {
      this.cerrarNotificaciones();
    }
  }

  verificarViewport() {
    const width = window.innerWidth;
    
    this.esMovilPequena = width < 480;
    this.esMovil = width < 768;
    this.esTablet = width >= 768 && width < 1024;
    this.esDesktop = width >= 1024;
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
    // Menú de usuario principal
    this.itemsMenu = [
      {
        label: 'Mi Perfil',
        icon: 'pi pi-user',
        routerLink: '/user/perfil',
        command: () => this.cerrarMenuUsuario()
      },
      {
        label: 'Mis Reservas',
        icon: 'pi pi-ticket',
        routerLink: '/user/historial-reservas',
        command: () => this.cerrarMenuUsuario()
      },
      {
        label: 'Configuración',
        icon: 'pi pi-cog',
        routerLink: '/configuracion',
        command: () => this.cerrarMenuUsuario()
      },
      { 
        separator: true 
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this.cerrarMenuUsuario();
          this.cerrarSesion();
        }
      }
    ];

    // Menú móvil optimizado para pantallas pequeñas
    this.itemsMenuMovil = [
      {
        label: 'Cartelera',
        icon: 'pi pi-play',
        routerLink: '/cartelera',
        command: () => this.cerrarMenuMovil()
      },
      {
        label: 'Estrenos',
        icon: 'pi pi-star',
        routerLink: '/estrenos',
        command: () => this.cerrarMenuMovil()
      },
      {
        label: 'Próximamente',
        icon: 'pi pi-calendar',
        routerLink: '/proximamente',
        command: () => this.cerrarMenuMovil()
      },
      { separator: true },
      {
        label: 'Mi Perfil',
        icon: 'pi pi-user',
        routerLink: '/perfil',
        command: () => this.cerrarMenuMovil()
      },
      {
        label: 'Mis Reservas',
        icon: 'pi pi-ticket',
        routerLink: '/reservas',
        command: () => this.cerrarMenuMovil()
      },
      { separator: true },
      {
        label: 'Configuración',
        icon: 'pi pi-cog',
        routerLink: '/configuracion',
        command: () => this.cerrarMenuMovil()
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this.cerrarMenuMovil();
          this.cerrarSesion();
        }
      }
    ];
  }

  // Métodos para el menú móvil
  alternarMenuMovil() {
    this.mostrarMenuMovil = !this.mostrarMenuMovil;
    
    if (this.mostrarMenuMovil) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  cerrarMenuMovil() {
    this.mostrarMenuMovil = false;
    document.body.style.overflow = '';
  }

  // Métodos para búsqueda móvil
  activarBusquedaMovil() {
    this.mostrarModalBusqueda = true;
    this.terminoBusquedaMovil = '';
    this.sugerenciasMovil = [];
  }

  cerrarModalBusqueda() {
    this.mostrarModalBusqueda = false;
    this.terminoBusquedaMovil = '';
    this.sugerenciasMovil = [];
  }

  realizarBusquedaMovil() {
    if (this.terminoBusquedaMovil.trim()) {
      console.log('Buscando desde móvil:', this.terminoBusquedaMovil);
      this.cerrarModalBusqueda();
    }
  }

  seleccionarSugerenciaMovil(sugerencia: string) {
    this.terminoBusquedaMovil = sugerencia;
    this.realizarBusquedaMovil();
  }

  // Métodos existentes (mantener igual)
  expandirBuscador() {
    this.buscadorExpandido = true;
    this.mostrarSugerencias = true;
    
    if (this.esMovilPequena) {
      document.body.style.overflow = 'hidden';
    }
    
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
    
    if (this.esMovilPequena) {
      document.body.style.overflow = '';
    }
  }

  onBuscarInput() {
    if (this.terminoBusqueda.trim().length > 0) {
      this.filtrarSugerencias();
    } else {
      this.sugerencias = [];
    }
  }

  onBuscarBlur() {
    const delay = this.esMovilPequena ? 500 : 200;
    
    setTimeout(() => {
      if (!this.preventClose) {
        this.contraerBuscador();
      }
    }, delay);
  }

  prevenirBlur(event: MouseEvent) {
    event.preventDefault();
    this.preventClose = true;
    
    setTimeout(() => {
      this.preventClose = false;
    }, 400);
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
      'Ciencia Ficción',
      'Avatar',
      'Star Wars',
      'Harry Potter'
    ];
    
    this.sugerencias = todasSugerencias.filter(sugerencia =>
      sugerencia.toLowerCase().includes(term)
    ).slice(0, this.esMovilPequena ? 3 : 5);
  }

  seleccionarSugerencia(sugerencia: string) {
    this.terminoBusqueda = sugerencia;
    this.realizarBusqueda();
  }

  realizarBusqueda() {
    if (this.terminoBusqueda.trim()) {
      console.log('Buscando:', this.terminoBusqueda);
      this.contraerBuscador();
      
      if (this.esMovilPequena) {
        this.mostrarFeedbackBusqueda();
      }
    }
  }

  mostrarFeedbackBusqueda() {
    const button = document.querySelector('.botonBuscarCompacto');
    if (button) {
      button.classList.add('busquedaRealizada');
      setTimeout(() => {
        button.classList.remove('busquedaRealizada');
      }, 1000);
    }
  }

  onMenuToggle(event: any) {
    this.menuAbierto = !this.menuAbierto;
    
    if (this.esMovilPequena) {
      setTimeout(() => this.ajustarMenuMovil(), 0);
    }
  }

  ajustarMenuMovil() {
    const menuOverlay = document.querySelector('.p-menu-overlay');
    if (menuOverlay) {
      const rect = menuOverlay.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      if (rect.bottom > viewportHeight) {
        const menuElement = menuOverlay as HTMLElement;
        menuElement.style.top = 'auto';
        menuElement.style.bottom = '100%';
      }
    }
  }

  cerrarMenuUsuario() {
    this.menuAbierto = false;
  }

  alternarMenu() {
    if (this.esMovil) {
      this.alternarMenuMovil();
    } else {
      this.menuAlternado.emit();
    }
  }

  alternarNotificaciones() {
    this.mostrarPanelNotificaciones = !this.mostrarPanelNotificaciones;
    if (this.mostrarPanelNotificaciones) {
      this.notificacionesNoLeidas = 0;
      
      if (this.esMovilPequena) {
        setTimeout(() => this.ajustarPanelNotificaciones(), 0);
      }
    }
  }

  ajustarPanelNotificaciones() {
    const panel = document.querySelector('.panelNotificacionesMovil');
    if (panel) {
      const panelElement = panel as HTMLElement;
      panelElement.style.height = 'calc(100vh - 60px)';
    }
  }

  cerrarNotificaciones() {
    this.mostrarPanelNotificaciones = false;
  }

  obtenerIniciales(nombre: string): string {
    return nombre
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  cerrarSesion() {
    console.log('Cerrando sesión...');
    this.usuarioLogueado = null;
    
    if (this.esMovilPequena) {
      this.mostrarFeedbackCerrarSesion();
    }
  }

  mostrarFeedbackCerrarSesion() {
    console.log('Sesión cerrada - Redirigiendo...');
  }

  trackBySugerencia(index: number, sugerencia: string): string {
    return sugerencia;
  }

  getTipoDispositivo(): string {
    if (this.esMovilPequena) return 'Móvil Pequeño';
    if (this.esMovil) return 'Móvil';
    if (this.esTablet) return 'Tablet';
    return 'Desktop';
  }
}