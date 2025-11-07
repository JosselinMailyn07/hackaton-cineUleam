import { Component, Input } from '@angular/core';
import { Supabase } from '@services/supabase';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-qrdisplay',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './qrdisplay.html',
  styleUrls: ['./qrdisplay.scss'],
})
export class Qrdisplay {
  @Input() idFuncion: number = 1;

  valor: string = '';
  ancho: number = 256;
  nivel: 'L' | 'M' | 'Q' | 'H' = 'H';

  constructor(private supabaseService: Supabase) {}

  async ngOnInit() {
    try {
      const { data: { user } } = await this.supabaseService.supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado.');

      const reservas = await this.supabaseService.obtenerDataFuncion(this.idFuncion);

      const dataQr = [
        {
          id_usuario: user.id,
          id_funcion: this.idFuncion,
          asientos: reservas[0]?.asientos || {},
        },
      ];

      this.valor = JSON.stringify(dataQr);
    } catch (err) {
      console.error('Error generando QR:', err);
    }
  }
}
