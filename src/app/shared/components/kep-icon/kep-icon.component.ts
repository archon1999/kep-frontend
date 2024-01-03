import { Component, HostBinding, Input, OnInit } from '@angular/core';
import icons from './icons.json';
import { CommonModule } from '@angular/common';
import { keenIcons } from '@app/keen-icons';

@Component({
  standalone: true,
  selector: 'kep-icon',
  templateUrl: './kep-icon.component.html',
  styleUrls: ['./kep-icon.component.scss'],
  imports: [CommonModule]
})
export class KepIconComponent implements OnInit {
  @Input() name: keyof typeof keenIcons | string;
  @Input() class = 'mr-25 font-medium-3';
  @Input() type: 'outline' | 'solid' | 'duotone' = 'outline';
  @Input() color: 'primary' | 'success' | 'info' | 'danger' | 'dark' | 'secondary';
  @Input() size: 'small-3' | 'small-4' | 'medium-1' | 'medium-2' | 'medium-3' | 'medium-4' | 'medium-5' | 'large-1';

  pathsNumber = 0;

  @HostBinding('style.display')
  get styleDisplay() {
    return 'contents';
  }

  ngOnInit() {
    if (this.size) {
      this.class = this.class.replace('font-', '');
    }

    this.name = keenIcons[this.name] || this.name;
    if (this.type === 'duotone') {
      this.pathsNumber = icons[this.type + '-paths'][this.name] ?? 0;
    }
  }
}
