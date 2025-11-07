import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.html',
  styleUrls: ['./loader.scss'],
  imports: [CommonModule],
  standalone: true
})
export class LoaderComponent {
  @Input() visible: boolean = true;
}
