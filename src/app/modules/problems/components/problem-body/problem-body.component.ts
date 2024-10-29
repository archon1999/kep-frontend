import { AfterContentChecked, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Problem } from '../../models/problems.models';
import { Problem1615Component } from '@problems/components/problem-body/problem1615/problem1615.component';
import { Problem1623Component } from '@problems/components/problem-body/problem1623/problem1623.component';
import { Problem1624Component } from '@problems/components/problem-body/problem1624/problem1624.component';
import { Problem1628Component } from '@problems/components/problem-body/problem1628/problem1628.component';
import { Problem1630Component } from '@problems/components/problem-body/problem1630/problem1630.component';
import { Problem1631Component } from '@problems/components/problem-body/problem1631/problem1631.component';
import { Problem1633Component } from '@problems/components/problem-body/problem1633/problem1633.component';
import { Problem1634Component } from '@problems/components/problem-body/problem1634/problem1634.component';
import { Problem1635Component } from '@problems/components/problem-body/problem1635/problem1635.component';
import { Problem1637Component } from '@problems/components/problem-body/problem1637/problem1637.component';
import { Problem1638Component } from '@problems/components/problem-body/problem1638/problem1638.component';
import { Problem1639Component } from '@problems/components/problem-body/problem1639/problem1639.component';
import { Problem1703Component } from '@problems/components/problem-body/problem1703/problem1703.component';
import { Problem1733Component } from '@problems/components/problem-body/problem1733/problem1733.component';
import { Problem1734Component } from '@problems/components/problem-body/problem1734/problem1734.component';
import { Problem1735Component } from '@problems/components/problem-body/problem1735/problem1735.component';
import { Problem1736Component } from '@problems/components/problem-body/problem1736/problem1736.component';
import { Problem1737Component } from '@problems/components/problem-body/problem1737/problem1737.component';
import { Problem1739Component } from '@problems/components/problem-body/problem1739/problem1739.component';
import { Problem1740Component } from '@problems/components/problem-body/problem1740/problem1740.component';
import { Problem1741Component } from '@problems/components/problem-body/problem1741/problem1741.component';
import { Problem1742Component } from '@problems/components/problem-body/problem1742/problem1742.component';
import { Problem1743Component } from '@problems/components/problem-body/problem1743/problem1743.component';
import { Problem1744Component } from '@problems/components/problem-body/problem1744/problem1744.component';
import { Problem1840Component } from '@problems/components/problem-body/problem1840/problem1840.component';
import { Problem1841Component } from '@problems/components/problem-body/problem1841/problem1841.component';
import { Problem1842Component } from '@problems/components/problem-body/problem1842/problem1842.component';
import { Problem1843Component } from '@problems/components/problem-body/problem1843/problem1843.component';
import { Problem1870Component } from '@problems/components/problem-body/problem1870/problem1870.component';
import { Problem1903Component } from '@problems/components/problem-body/problem1903/problem1903.component';
import { MathjaxModule } from '@shared/third-part-modules/mathjax/mathjax.module';
import { ClipboardModule } from '@shared/components/clipboard/clipboard.module';
import { CoreCommonModule } from '@core/common.module';
import { Problem1869Component } from '@problems/components/problem-body/problem1869/problem1869.component';
import Swal from 'sweetalert2';
import { Problem1905Component } from '@problems/components/problem-body/problem1905/problem1905.component';
import { Problem1954Component } from '@problems/components/problem-body/problem1954/problem1954.component';
import { Problem1953Component } from '@problems/components/problem-body/problem1953/problem1953.component';
import { Problem1966Component } from '@problems/components/problem-body/problem1966/problem1966.component';

@Component({
  selector: 'problem-body',
  templateUrl: './problem-body.component.html',
  styleUrls: ['./problem-body.component.scss'],
  standalone: true,
  imports: [
    Problem1615Component,
    Problem1623Component,
    Problem1624Component,
    Problem1628Component,
    Problem1630Component,
    Problem1631Component,
    Problem1633Component,
    Problem1634Component,
    Problem1635Component,
    Problem1637Component,
    Problem1638Component,
    Problem1639Component,
    Problem1703Component,
    Problem1733Component,
    Problem1734Component,
    Problem1735Component,
    Problem1736Component,
    Problem1737Component,
    Problem1739Component,
    Problem1740Component,
    Problem1741Component,
    Problem1742Component,
    Problem1743Component,
    Problem1744Component,
    Problem1840Component,
    Problem1841Component,
    Problem1842Component,
    Problem1843Component,
    Problem1870Component,
    Problem1903Component,
    Problem1905Component,
    MathjaxModule,
    ClipboardModule,
    CoreCommonModule,
    Problem1869Component,
    Problem1954Component,
    Problem1953Component,
    Problem1966Component,
  ]
})
export class ProblemBodyComponent implements OnInit, OnDestroy, AfterContentChecked {
  @Input() problem: Problem;

  private _intervalId: any;

  ngOnInit() {
    if (this.problem.id === 1869) {
      let show = false;
      this._intervalId = setInterval(() => {
        let sum = 0;
        let prevTile: any;
        let ok = true;
        if (!window['tiles']) { return; }
        for (const el of window['tiles']) {
          if (prevTile && prevTile.y !== el.tile.y) {
            if (sum !== 12) {
              ok = false;
            }
            sum = 0;
          }
          prevTile = el.tile;
          sum += el.tile.colspan;
        }
        if (ok && !show) {
          show = true;
          const html = 'An' + 'swer' + 'is ' + ' 20' + '23' + '2' + '912';
          Swal.fire({
            title: 'Success',
            icon: 'success',
            html: html,
          });
        }
      }, 5000);
    }

    if (this.problem.id === 1905) {
      let show = false;
      this._intervalId = setInterval(() => {
        let sumL = 0;
        let sumX = 0;
        let prevTile: any;
        let ok = true;
        if (!window['tiles']) { return; }
        for (const el of window['tiles']) {
          if (prevTile && prevTile.y !== el.tile.y) {
            if (sumL !== 12 || sumX !== 12) {
              ok = false;
            }
            sumL = 0;
            sumX = 0;
          }
          prevTile = el.tile;
          sumL += el.tile.colspan;
          sumX += el.tile.w;
        }
        if (ok && !show) {
          show = true;
          const html = 'An' + 'swer' + 'is ' + ' ' + '23' + '2' + '912';
          Swal.fire({
            title: 'Success',
            icon: 'success',
            html: html,
          });
        }
      }, 5000);
    }
  }

  ngAfterContentChecked() {
    const tables = document.querySelectorAll('.problem-description table');
    for (let i = 0; i < tables.length; i++) {
      tables[i].classList.add('table', 'table-bordered');
      tables[i].parentElement.classList.add('table-responsive', 'beautiful-table');
      const theads = tables[i].getElementsByTagName('thead');
      for (let j = 0; j < theads.length; j++) {
        theads[j].getElementsByTagName('tr')[0]?.classList.add('bg-light-primary');
      }
    }
  }

  ngOnDestroy() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
  }
}
