import { Component, Input, OnInit } from '@angular/core';
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
    MathjaxModule,
    ClipboardModule,
    CoreCommonModule,
  ]
})
export class ProblemBodyComponent {
  @Input() problem: Problem;
}
