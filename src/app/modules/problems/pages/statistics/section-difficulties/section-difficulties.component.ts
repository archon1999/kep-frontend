import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { CoreCommonModule } from '@core/common.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ProblemsPipesModule } from '@problems/pipes/problems-pipes.module';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { TranslateModule } from '@ngx-translate/core';

export interface Difficulties {
  beginner: number;
  allBeginner: number;
  basic: number;
  allBasic: number;
  normal: number;
  allNormal: number;
  medium: number;
  allMedium: number;
  advanced: number;
  allAdvanced: number;
  hard: number;
  allHard: number;
  extremal: number;
  allExtremal: number;
  totalSolved: number;
  totalProblems: number;
}

@Component({
  selector: 'section-difficulties',
  templateUrl: './section-difficulties.component.html',
  styleUrls: ['./section-difficulties.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ApexChartModule,
    SwiperComponent,
    NgbProgressbarModule,
    ProblemsPipesModule,
    KepCardComponent,
    TranslateModule,
  ]
})
export class SectionDifficultiesComponent implements OnChanges {

  @Input() data: Difficulties;

  public difficulties: Difficulties = {
    beginner: 0,
    allBeginner: 1,
    basic: 0,
    allBasic: 1,
    normal: 0,
    allNormal: 1,
    medium: 0,
    allMedium: 1,
    advanced: 0,
    allAdvanced: 1,
    hard: 0,
    allHard: 1,
    extremal: 0,
    allExtremal: 1,
    totalSolved: 0,
    totalProblems: 1,
  };

  public chartOptions: ChartOptions | any;

  public swiperConfig: SwiperOptions = {
    direction: 'vertical',
    slidesPerView: 3,
    spaceBetween: 10,
    autoHeight: false,
  };

  constructor(
    public translateService: TranslateService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.difficulties = this.data;
      this.buildChart();
    }
  }

  private buildChart() {
    const diff = this.difficulties;
    if (!diff || !diff.totalProblems) {
      this.chartOptions = null;
      return;
    }

    this.chartOptions = {
      series: [100 * diff.totalSolved / diff.totalProblems],
      chart: {
        height: '220px',
        type: 'radialBar',
        toolbar: { show: false }
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: '70%',
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24
            }
          },
          track: {
            strokeWidth: '67%',
            margin: 0,
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35
            }
          },
          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: '#888',
              fontSize: '17px'
            },
            value: {
              formatter: (val: number) => parseInt(val.toString(), 10).toString(),
              color: '#111',
              fontSize: '34px',
              show: true
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#ABE5A1'],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: { lineCap: 'round' },
      labels: [this.translateService.instant('Percent')]
    };
  }
}
