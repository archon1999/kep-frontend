import { Component, HostBinding, Input, OnInit } from '@angular/core';
import icons from './icons.json';
import { CommonModule } from '@angular/common';
import { keenIcons } from '../../../keen-icons';

@Component({
  standalone: true,
  selector: 'keenicon',
  templateUrl: './keenicon.component.html',
  styleUrls: ['./keenicon.component.scss'],
  imports: [CommonModule]
})
export class KeeniconComponent implements OnInit {
  @Input() name: string;
  @Input() kepName: string;
  @Input() class: string;
  @Input() type: 'outline' | 'solid' | 'duotone' = 'outline';

  pathsNumber = 0;

  @HostBinding('style.display')
  get styleDisplay() {
    return 'contents';
  }

  ngOnInit() {
    if (this.kepName) {
      this.name = keenIcons[this.kepName] || this.kepName;
    }
    console.log(this.name);

    if (this.type === 'duotone') {
      this.pathsNumber = icons[this.type + '-paths'][this.name] ?? 0;
    }
  }
}
