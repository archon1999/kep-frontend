import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { TitleService } from 'app/shared/services/title.service';
import { StudyPlan } from '../../models/problems.models';
import { ProblemsApiService } from '../../services/problems-api.service';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { CoreCommonModule } from '@core/common.module';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProblemsPipesModule } from '@problems/pipes/problems-pipes.module';
import { KepcoinSpendSwalModule } from '../../../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { StudyPlanCardModule } from '@problems/components/study-plan-card/study-plan-card.module';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';

@Component({
  selector: 'app-study-plan',
  templateUrl: './study-plan.component.html',
  styleUrls: ['./study-plan.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    SwiperComponent,
    NgbProgressbarModule,
    ProblemsPipesModule,
    NgbTooltipModule,
    KepcoinSpendSwalModule,
    StudyPlanCardModule,
    ApexChartModule,
  ]
})
export class StudyPlanComponent implements OnInit {

  public studyPlan: StudyPlan;

  public difficulties: any;
  public chartOptions: any;
  public swiperConfig: SwiperOptions = {
    autoHeight: false,
    direction: 'vertical',
    slidesPerView: 3,
    spaceBetween: 10,
  };

  constructor(
    public route: ActivatedRoute,
    public service: ProblemsApiService,
    public translateService: TranslateService,
    public titleService: TitleService,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({studyPlan}) => {
      this.studyPlan = studyPlan;
      this.difficulties = studyPlan.statistics;
      this.titleService.updateTitle(this.route, {studyPlanTitle: studyPlan.title});

      this.chartOptions = {
        series: [100 * this.difficulties.totalSolved / this.studyPlan.problemsCount],
        chart: {
          height: '200px',
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 225,
            hollow: {
              margin: 0,
              size: '70%',
              image: undefined,
              position: 'front',
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
              margin: 0, // margin is in pixels
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
                formatter: function (val) {
                  return parseInt(val.toString(), 10).toString();
                },
                color: '#111',
                fontSize: '36px',
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
        stroke: {
          lineCap: 'round'
        },
        labels: [this.translateService.instant('Percent')]
      };
    });
  }

  purchaseSuccess() {
    setTimeout(() => {
      this.service.getStudyPlan(this.studyPlan.id).subscribe(
        (studyPlan: StudyPlan) => {
          this.studyPlan = studyPlan;
        }
      );
    }, 1000);
  }

}
