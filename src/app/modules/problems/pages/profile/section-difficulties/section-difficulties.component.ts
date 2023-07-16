import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { fadeInUpOnEnterAnimation } from 'angular-animations';
import { ProblemsStatisticsService } from '../../../../problems/problems-statistics.service';
import { SwiperOptions } from 'swiper';

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
  animations: [fadeInUpOnEnterAnimation({ duration: 3000 })]
})
export class SectionDifficultiesComponent implements OnInit {

  @Input() username: string;

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
  }

  public chartOptions: any;

  public swiperConfig: SwiperOptions = {
    direction: "vertical",
    slidesPerView: 3,
    spaceBetween: 10,
  };

  constructor(
    public statisticsService: ProblemsStatisticsService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    let translations = this.translateService.translations[this.translateService.currentLang];

    this.statisticsService.getByDifficulty(this.username).subscribe(
      (difficulties: Difficulties) => {
        this.difficulties = difficulties;
        this.chartOptions = {
          series: [100 * difficulties.totalSolved / difficulties.totalProblems],
          chart: {
            height: '200px',
            type: "radialBar",
            toolbar: {
              show: false,
            }
          },
          plotOptions: {
            radialBar: {
              startAngle: -135,
              endAngle: 225,
              hollow: {
                margin: 0,
                size: "70%",
                image: undefined,
                position: "front",
                dropShadow: {
                  enabled: true,
                  top: 3,
                  left: 0,
                  blur: 4,
                  opacity: 0.24
                }
              },
              track: {
                strokeWidth: "67%",
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
                  color: "#888",
                  fontSize: "17px"
                },
                value: {
                  formatter: function(val) {
                    return parseInt(val.toString(), 10).toString();
                  },
                  color: "#111",
                  fontSize: "36px",
                  show: true
                }
              }
            }
          },
          fill: {
            type: "gradient",
            gradient: {
              shade: "dark",
              type: "horizontal",
              shadeIntensity: 0.5,
              gradientToColors: ["#ABE5A1"],
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100]
            }
          },
          stroke: {
            lineCap: "round"
          },
          labels: [translations['Percent']]
        };
      }
    )
  }

}