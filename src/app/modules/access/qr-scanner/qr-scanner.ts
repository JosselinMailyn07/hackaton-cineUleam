import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { Supabase } from '@services/supabase'; // Asegúrate que esta ruta es correcta

@Component({
  selector: 'app-qr-verificador',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './qr-scanner.html',
  styleUrls: ['./qr-scanner.scss'],
})
export class QrLectorComponent {
  result: any = null;
  mensaje: string = '';
  loading: boolean = false;
  formats = [BarcodeFormat.QR_CODE];

  constructor(private supabaseService: Supabase) { }

  async onScanSuccess(event: string) {

    try {
      this.loading = true;
      this.mensaje = 'Verificando reserva...';

      const qrDataArray = JSON.parse(event);
      if (!Array.isArray(qrDataArray) || qrDataArray.length === 0) {
        throw new Error('El QR no contiene un array válido.');
      }

      const reserva = qrDataArray[0];
      const idUsuario = reserva.id_usuario;
      const idFuncion = reserva.id_funcion;
      const asientosObjeto = reserva.asientos;

      if (!idUsuario || !idFuncion || !asientosObjeto) {
        throw new Error('Faltan datos requeridos en el QR.');
      }

      const data = await this.supabaseService.verificacion.verificarReservaDetallada(
        idUsuario,
        idFuncion,
        asientosObjeto
      );

      if (data && data.length > 0 && data[0].valido) {
        this.result = data[0];
        this.mensaje = '✅ Reserva válida. Puede ingresar.';
      } else {
        this.result = null;
        this.mensaje = `❌ Reserva no encontrada o no coincide.`;
      }
    } catch (err: any) {
      console.error('Error al procesar el QR:', err);
      this.mensaje = `⚠️ ${err.message || 'Error al procesar el QR.'}`;
      this.result = null;
    } finally {
      this.loading = false;
    }
  }

  resetScanner() {
    this.result = null;
    this.mensaje = '';
    this.loading = false;
  }
}