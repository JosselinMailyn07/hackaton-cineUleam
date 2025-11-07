import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-perfil',
  imports: [],
  template: `<p>perfil works!</p>`,
  styleUrl: './perfil.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Perfil { }
