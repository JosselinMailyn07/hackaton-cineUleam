import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Supabase } from '@app/services/supabase';
import { HeaderAdminComponent } from '../header-admin/header-admin';
import { FooterComponent } from '@shared/footer/footer';

// ✅ PRIME NG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ChartModule,
    HeaderAdminComponent,
    FooterComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  
  constructor(private supabaseService: Supabase) {}

  estadisticasPrincipales: any[] = [];
  peliculasRecientes: any[] = [];
  datosGraficoReservas: any;
  opcionesGrafico: any;

  ngOnInit(): void {
    this.inicializarDashboard();
  }

  private async inicializarDashboard() {
    this.inicializarEstadisticas();
    this.configurarGraficos();
    await this.obtenerPeliculasRecientes();
  }

  inicializarEstadisticas() {
    this.estadisticasPrincipales = [
      {
        titulo: "Películas Activas",
        valor: 12,
        descripcion: "Películas disponibles actualmente",
        icono: "pi pi-video",
        variacion: 5,
        color: "#007bff"
      },
      {
        titulo: "Usuarios Registrados",
        valor: 320,
        descripcion: "Usuarios activos en el sistema",
        icono: "pi pi-users",
        variacion: 3,
        color: "#28a745"
      }
    ];
  }

  configurarGraficos() {
    this.datosGraficoReservas = {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Reservas',
          data: [12, 19, 7, 15, 8, 11, 16],
          tension: 0.4,
          fill: false
        }
      ]
    };

    this.opcionesGrafico = {
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  private async obtenerPeliculasRecientes() {
    try {
      const data = await this.supabaseService.getPeliculaReciente(6);

      this.peliculasRecientes = data.map((p: any) => ({
        titulo: p.nombre,
        imagen: p.imagen,
        fechaEstreno: p.fecha_estreno,
        estado: p.estado,
        categorias: p.categorias_rel?.map((c: any) => c.nombre).join(', ') ?? 'Sin categoría',
      }));

    } catch (error) {
      console.error('❌ Error cargando películas:', error);
    }
  }

}
