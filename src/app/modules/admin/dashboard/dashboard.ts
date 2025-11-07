import { Component } from '@angular/core';
import { FooterComponent } from '@modules/shared/footer/footer';
import { HeaderComponent } from '@modules/shared/header/header';
@Component({
  selector: 'app-dashboard',
  imports: [FooterComponent, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
