import { Component, inject, Input, OnInit } from '@angular/core';
import { AppStateService, ThemeMode } from '@core/services/app-state.service';

@Component({
  selector: 'logo',
  imports: [],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent implements OnInit {
  @Input() size = 32;

  public themeMode: ThemeMode;

  protected appStateService = inject(AppStateService);

  ngOnInit() {
    this.appStateService.state$.subscribe(
      (state) => {
        this.themeMode = state.themeMode;
      }
    )
  }
}
