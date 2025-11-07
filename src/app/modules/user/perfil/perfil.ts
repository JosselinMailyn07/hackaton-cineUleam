import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FooterComponent } from '@shared/footer/footer';
import { HeaderComponent } from '@shared/header/header';
import { CardModule } from 'primeng/card'

interface PerfilUsuario {
  id: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  avatarUrl: string;
}
@Component({
  selector: 'app-perfil',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    CardModule
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {
  @Input() perfil: PerfilUsuario = {
    id: '1',
    nombres: 'Maria',
    apellidos: 'Sanchez',
    telefono: '+593 98 765 4321',
    avatarUrl: 'https://images.vexels.com/media/users/3/137047/isolated/svg/5831a17a290077c646a48c4db78a81bb.svg'
  };

}
