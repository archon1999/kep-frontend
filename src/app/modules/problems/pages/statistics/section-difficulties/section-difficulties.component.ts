import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ProblemsPipesModule } from '@problems/pipes/problems-pipes.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { Difficulties } from '@problems/models/statistics.models';

interface DifficultyItem {
  label: string;
  solved: number;
  total: number;
  progress: number;
  level: number;
}

@Component({
  selector: 'section-difficulties',
  templateUrl: './section-difficulties.component.html',
  styleUrls: ['./section-difficulties.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
    NgbProgressbarModule,
    ProblemsPipesModule,
    KepCardComponent,
  ]
})
export class SectionDifficultiesComponent implements OnChanges {

  @Input() difficulties: Difficulties | null = null;

  public chartOptions: ChartOptions | null = null;
  public completionRate = 0;
  public difficultyItems: DifficultyItem[] = [];

  constructor(
    private translateService: TranslateService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['difficulties']) {
      this.buildView();
    }
  }

  private buildView() {
    if (!this.difficulties) {
      this.chartOptions = null;
      this.completionRate = 0;
      this.difficultyItems = [];
      return;
    }

    const diff = this.difficulties;
    this.completionRate = diff.totalProblems
      ? Math.round((diff.totalSolved / diff.totalProblems) * 100)
      : 0;

    this.chartOptions = {
      series: [this.completionRate],
      chart: {
        height: 250,
        type: 'radialBar',
        toolbar: { show: false },
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: '75%',
            dropShadow: {
              enabled: true,
              top: 3,
              blur: 4,
              opacity: 0.2,
            },
          },
          track: {
            strokeWidth: '67%',
            dropShadow: {
              enabled: true,
              top: -3,
              blur: 4,
              opacity: 0.1,
            },
          },
          dataLabels: {
            name: {
              show: true,
              color: '#6E6B7B',
              fontSize: '0.85rem',
              offsetY: -10,
              formatter: () => this.translateService.instant('Completion'),
            },
            value: {
              formatter: (val: number) => `${Math.round(val)}%`,
              color: '#11142D',
              fontSize: '2.4rem',
              show: true,
            },
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.4,
          gradientToColors: ['#28c76f'],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: 'round',
      },
      labels: [this.translateService.instant('Completion')],
    };

    this.difficultyItems = [
      { label: 'Beginner', solved: diff.beginner, total: diff.allBeginner, level: 1, progress: this.getProgress(diff.beginner, diff.allBeginner) },
      { label: 'Basic', solved: diff.basic, total: diff.allBasic, level: 2, progress: this.getProgress(diff.basic, diff.allBasic) },
      { label: 'Normal', solved: diff.normal, total: diff.allNormal, level: 3, progress: this.getProgress(diff.normal, diff.allNormal) },
      { label: 'Medium', solved: diff.medium, total: diff.allMedium, level: 4, progress: this.getProgress(diff.medium, diff.allMedium) },
      { label: 'Advanced', solved: diff.advanced, total: diff.allAdvanced, level: 5, progress: this.getProgress(diff.advanced, diff.allAdvanced) },
      { label: 'Hard', solved: diff.hard, total: diff.allHard, level: 6, progress: this.getProgress(diff.hard, diff.allHard) },
      { label: 'Extremal', solved: diff.extremal, total: diff.allExtremal, level: 7, progress: this.getProgress(diff.extremal, diff.allExtremal) },
    ];
  }

  private getProgress(solved: number, total: number): number {
    if (!total) {
      return 0;
    }
    return Math.round((solved / total) * 100);
  }
}
