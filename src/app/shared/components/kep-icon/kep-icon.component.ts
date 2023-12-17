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

  pathsNumber = 0;

  @HostBinding('style.display')
  get styleDisplay() {
    return 'contents';
  }

  ngOnInit() {
    this.name = keenIcons[this.name] || this.name;
    if (this.type === 'duotone') {
      this.pathsNumber = icons[this.type + '-paths'][this.name] ?? 0;
    }
  }
}
