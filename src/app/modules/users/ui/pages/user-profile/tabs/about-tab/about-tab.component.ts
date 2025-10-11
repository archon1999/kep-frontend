import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAboutComponent } from '../../widgets/user-about/user-about.component';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-user-about-tab',
  standalone: true,
  imports: [CommonModule, UserAboutComponent],
  templateUrl: './about-tab.component.html',
  styleUrl: './about-tab.component.scss'
})
export class UserAboutTabComponent implements OnInit {
  public username: string;
  protected route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.username = this.route.parent.snapshot.paramMap.get('username')!;
  }
}
