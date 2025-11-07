import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '@shared/header/header';
import { FooterComponent } from '@shared/footer/footer';

// Interfaz para estadísticas
interface EstadisticaDashboard {
  titulo: string;
  valor: number;
  icono: string;
  color: string;
  variacion?: number;
  descripcion: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ChartModule, ButtonModule, HeaderComponent,FooterComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  
  // Estadísticas principales del dashboard
  estadisticasPrincipales: EstadisticaDashboard[] = [];
  
  // Datos para gráficos
  datosGraficoReservas: any;
  datosGraficoIngresos: any;
  opcionesGrafico: any;

  // Películas recientes (ejemplo)
  peliculasRecientes = [
    {
      titulo: 'Avatar: The Way of Water',
      estado: 'activa',
      fechaEstreno: '2023-12-15',
      imagen: 'assets/peliculas/avatar.jpg'
    },
    {
      titulo: 'The Batman',
      estado: 'activa', 
      fechaEstreno: '2023-11-10',
      imagen: 'assets/peliculas/batman.jpg'
    }
  ];

  ngOnInit() {
    this.inicializarEstadisticas();
    this.configurarGraficos();
  }

  /**
   * Inicializa las estadísticas principales del dashboard
   */
  private inicializarEstadisticas() {
    this.estadisticasPrincipales = [
      {
        titulo: 'Películas Activas',
        valor: 24,
        icono: 'pi pi-film',
        color: '#e30614',
        variacion: 12,
        descripcion: 'En cartelera'
      },
      {
        titulo: 'Reservas Hoy',
        valor: 156,
        icono: 'pi pi-ticket',
        color: '#10b981', 
        variacion: 8,
        descripcion: 'Reservas del día'
      },
    
      {
        titulo: 'Usuarios Activos',
        valor: 2347,
        icono: 'pi pi-users',
        color: '#3b82f6',
        variacion: 5,
        descripcion: 'Este mes'
      }
    ];
  }

  /**
   * Configura los gráficos del dashboard
   */
  private configurarGraficos() {
    // Gráfico de reservas semanales
    this.datosGraficoReservas = {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Reservas',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: true,
          borderColor: '#e30614',
          backgroundColor: 'rgba(227, 6, 20, 0.1)',
          tension: 0.4
        }
      ]
    };

    // Gráfico de ingresos mensuales
    this.datosGraficoIngresos = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Ingresos ($)',
          data: [28000, 32000, 29000, 35000, 42000, 38000],
          fill: true,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        }
      ]
    };

    // Opciones comunes para gráficos
    this.opcionesGrafico = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    };
  }

  /**
   * Obtiene la clase CSS para el badge de estado
   */
  obtenerClaseEstado(estado: string): string {
    return `estadoBadge estado-${estado}`;
  }
}