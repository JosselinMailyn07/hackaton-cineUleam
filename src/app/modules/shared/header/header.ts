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
    
    // Cerrar búsqueda si se cambia a móvil pequeña
    if (this.esMovilPequena && this.buscadorExpandido) {
      this.contraerBuscador();
    }
  }

  verificarViewport() {
    const width = window.innerWidth;
    
    this.esMovilPequena = width < 480;  // Móviles pequeños
    this.esMovil = width < 768;         // Todos los móviles
    this.esTablet = width >= 768 && width < 1024; // Tablets
    this.esDesktop = width >= 1024;     // Desktop

    console.log('Viewport detectado:', {
      movilPequena: this.esMovilPequena,
      movil: this.esMovil,
      tablet: this.esTablet,
      desktop: this.esDesktop,
      width: width
    });
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
        routerLink: '/perfil',
        command: () => this.cerrarMenuUsuario()
      },
      {
        label: 'Mis Reservas',
        icon: 'pi pi-ticket',
        routerLink: '/user/historial-reservas',
        command: () => this.cerrarMenuUsuario()
      },
      {
        label: 'Historial',
        icon: 'pi pi-history',
        routerLink: '/historial',
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

  // Métodos para móvil pequeña
  expandirBuscador() {
    this.buscadorExpandido = true;
    this.mostrarSugerencias = true;
    
    // En móvil pequeña, mostrar overlay completo
    if (this.esMovilPequena) {
      document.body.style.overflow = 'hidden';
    }
    
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
    
    // Restaurar scroll en móvil pequeña
    if (this.esMovilPequena) {
      document.body.style.overflow = '';
    }
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
    // En móvil pequeña, no cerrar inmediatamente para permitir selección
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
    ).slice(0, this.esMovilPequena ? 3 : 5); // Menos sugerencias en móvil pequeña
  }

  seleccionarSugerencia(sugerencia: string) {
    this.terminoBusqueda = sugerencia;
    this.realizarBusqueda();
  }

  realizarBusqueda() {
    if (this.terminoBusqueda.trim()) {
      console.log('Buscando:', this.terminoBusqueda);
      // Aquí iría la navegación a resultados de búsqueda
      this.contraerBuscador();
      
      // En móvil pequeña, mostrar feedback táctil
      if (this.esMovilPequena) {
        this.mostrarFeedbackBusqueda();
      }
    }
  }

  mostrarFeedbackBusqueda() {
    // Feedback visual para móviles pequeños
    const button = document.querySelector('.botonBuscarCompacto');
    if (button) {
      button.classList.add('busquedaRealizada');
      setTimeout(() => {
        button.classList.remove('busquedaRealizada');
      }, 1000);
    }
  }

  // Métodos del menú usuario
  onMenuToggle(event: any) {
    this.menuAbierto = !this.menuAbierto;
    
    // En móvil pequeña, ajustar posición del menú
    if (this.esMovilPequena) {
      setTimeout(() => this.ajustarMenuMovil(), 0);
    }
  }

  ajustarMenuMovil() {
    const menuOverlay = document.querySelector('.p-menu-overlay');
    if (menuOverlay) {
      const rect = menuOverlay.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Asegurar que el menú no se salga de la pantalla
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

  cerrarMenuMovil() {
    // Cerrar menú móvil
    this.menuAbierto = false;
  }

  alternarMenu() {
    this.menuAlternado.emit();
  }

  alternarNotificaciones() {
    this.mostrarPanelNotificaciones = !this.mostrarPanelNotificaciones;
    if (this.mostrarPanelNotificaciones) {
      this.notificacionesNoLeidas = 0;
      
      // En móvil pequeña, ajustar panel de notificaciones
      if (this.esMovilPequena) {
        setTimeout(() => this.ajustarPanelNotificaciones(), 0);
      }
    }
  }

  ajustarPanelNotificaciones() {
    const panel = document.querySelector('.panelNotificacionesMovil');
    if (panel) {
      const panelElement = panel as HTMLElement;
      panelElement.style.height = 'calc(100vh - 60px)'; // Ajustar altura
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
    
    // Feedback visual para móvil pequeña
    if (this.esMovilPequena) {
      this.mostrarFeedbackCerrarSesion();
    }
  }

  mostrarFeedbackCerrarSesion() {
    // Podrías mostrar un toast o mensaje de confirmación
    console.log('Sesión cerrada - Redirigiendo...');
  }

  trackBySugerencia(index: number, sugerencia: string): string {
    return sugerencia;
  }

  // Método para obtener el tipo de dispositivo (útil para debugging)
  getTipoDispositivo(): string {
    if (this.esMovilPequena) return 'Móvil Pequeño';
    if (this.esMovil) return 'Móvil';
    if (this.esTablet) return 'Tablet';
    return 'Desktop';
  }
}