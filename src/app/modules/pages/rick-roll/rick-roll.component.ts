import { Component, inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BaseComponent } from '@app/common';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-rick-roll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rick-roll.component.html',
  styleUrl: './rick-roll.component.scss'
})
export class RickRollComponent extends BaseComponent implements OnInit {
  private location = inject(Location);

  public timer = 0;
  public rickroll = false;

  ngOnInit() {
    Swal.fire({
      title: 'Congratulations',
      text: '1000 🟡',
      icon: 'success',
    }).finally(
      () => {
        this.currentUser.kepcoin += 1000;
        this.timer = 5;
        interval(1000).pipe(take(5)).subscribe(
          () => {
            this.timer -= 1;
            if (this.timer === 0) {
              this.rickroll = true;
              this.currentUser.kepcoin -= 1000;
              this.location.replaceState('/you-get-rickrolled');
            }
          }
        );
      }
    );
  }
}
