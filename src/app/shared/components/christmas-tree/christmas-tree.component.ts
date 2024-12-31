import { Component, inject, OnInit } from '@angular/core';
import { LocalStorageService } from '@shared/services/storages/local-storage.service';

@Component({
  selector: 'christmas-tree',
  standalone: true,
  imports: [],
  templateUrl: './christmas-tree.component.html',
  styleUrl: './christmas-tree.component.scss'
})
export class ChristmasTreeComponent implements OnInit {
  public newYearEffects: boolean;
  protected localStorageService = inject(LocalStorageService);

  ngOnInit() {
    this.newYearEffects = this.localStorageService.get('newYearEffects', true);
  }
}
