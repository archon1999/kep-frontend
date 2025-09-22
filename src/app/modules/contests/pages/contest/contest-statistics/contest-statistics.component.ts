import { Component, OnInit } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import { ContestClassesPipe } from '@contests/pipes/contest-classes.pipe';
import { ContestsService } from '@contests/contests.service';
import { Contest } from '@contests/models/contest';
import { BaseLoadComponent } from '@core/common';
import { ApexChartModule } from '@shared/third-part-modules/apex-chart/apex-chart.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ChartOptions } from '@shared/third-part-modules/apex-chart/chart-options.type';
import {
  ContestStatisticAttemptsRecord,
  ContestStatisticBadge,
  ContestStatisticSolveRecord,
  ContestStatistics,
} from '@contests/models';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';

interface SummaryCard {
  key: string;
  labelKey: string;
  value: number;
  suffix?: string;
  numberFormat?: string;
  icon: string;
  iconClass: string;
}

interface ProblemSummaryRow {
  symbol: string;
  attempts: number;
  accepted: number;
}

interface BadgeEntry {
  key: string;
  labelKey: string;
  badge: ContestStatisticBadge;
}

interface FirstSolveEntry {
  problem: string;
  record: ContestStatisticSolveRecord;
}

@Component({
  selector: 'app-contest-statistics',
  standalone: true,
  templateUrl: './contest-statistics.component.html',
  styleUrls: ['./contest-statistics.component.scss'],
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestTabComponent,
    ContestClassesPipe,
    ApexChartModule,
    KepCardComponent,
    UserPopoverModule,
  ],
})
export class ContestStatisticsComponent extends BaseLoadComponent<ContestStatistics> implements OnInit {
  public contest: Contest;
  public statistics: ContestStatistics | null = null;

  public summaryCards: SummaryCard[] = [];
  public problemSummary: ProblemSummaryRow[] = [];
  public badgeEntries: BadgeEntry[] = [];
  public firstSolves: FirstSolveEntry[] = [];
  public lastAccepted: (ContestStatisticSolveRecord & { problem: string }) | null = null;
  public mostAttempts: ContestStatisticAttemptsRecord | null = null;

  public timelineChart: ChartOptions | any;
  public verdictChart: ChartOptions | any;
  public problemsChart: ChartOptions | any;

  constructor(public service: ContestsService) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ contest }) => {
      this.contest = Contest.fromJSON(contest);
      this.titleService.updateTitle(this.route, { contestTitle: contest.title });
      this.loadContentHeader();
      this.loadData();
    });
  }

  protected getContentHeader() {
    if (!this.contest) {
      return null;
    }

    return {
      headerTitle: 'Contests.Statistics',
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Contests.Contests',
            isLink: true,
            link: '../../..',
          },
          {
            name: this.contest.id + '',
            isLink: true,
            link: '..',
          },
          {
            name: 'Contests.Statistics',
            isLink: true,
            link: '.',
          },
        ],
      },
    };
  }

  getData() {
    return this.service.getContestStatistics(this.contest.id);
  }

  override afterLoadData(data: ContestStatistics) {
    this.statistics = data;
    this.prepareSummaryCards();
    this.prepareTimelineChart();
    this.prepareProblemsChart();
    this.prepareVerdictChart();
    this.prepareRecords();
    this.prepareBadges();
  }

  private prepareSummaryCards() {
    if (!this.statistics?.general) {
      this.summaryCards = [];
      return;
    }

    const general = this.statistics.general;

    this.summaryCards = [
      {
        key: 'participants',
        labelKey: 'Contests.Participants',
        value: general.participants,
        icon: 'users',
        iconClass: 'bg-primary-transparent text-primary',
      },
      {
        key: 'attempts',
        labelKey: 'Contests.TotalAttempts',
        value: general.attempts.total,
        icon: 'attempt',
        iconClass: 'bg-warning-transparent text-warning',
      },
      {
        key: 'accepted',
        labelKey: 'Contests.TotalAccepted',
        value: general.accepted.total,
        icon: 'check',
        iconClass: 'bg-success-transparent text-success',
      },
      {
        key: 'acceptanceRate',
        labelKey: 'Contests.AcceptanceRate',
        value: general.acceptanceRate,
        suffix: '%',
        numberFormat: '1.0-2',
        icon: 'chart-line-up-2',
        iconClass: 'bg-info-transparent text-info',
      },
    ];
  }

  private prepareTimelineChart() {
    const timeline = this.statistics?.timeline || [];

    this.timelineChart = {
      series: [
        {
          name: this.translateService.instant('Attempts'),
          data: timeline.map((point) => point.attempts),
        },
      ],
      chart: {
        type: 'area',
        height: 300,
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        categories: timeline.map((point) => point.range),
        labels: {
          rotate: -45,
        },
      },
      colors: ['var(--primary)'],
    };
  }

  private prepareProblemsChart() {
    if (!this.statistics?.general) {
      this.problemsChart = null;
      this.problemSummary = [];
      return;
    }

    const attempts = this.statistics.general.attempts.byProblem || {};
    const accepted = this.statistics.general.accepted.byProblem || {};
    const symbols = Array.from(new Set([
      ...Object.keys(attempts),
      ...Object.keys(accepted),
    ])).sort((a, b) => a.localeCompare(b));

    this.problemSummary = symbols.map((symbol) => ({
      symbol,
      attempts: attempts[symbol] ?? 0,
      accepted: accepted[symbol] ?? 0,
    }));

    this.problemsChart = {
      series: [
        {
          name: this.translateService.instant('Attempts'),
          data: this.problemSummary.map((item) => item.attempts),
        },
        {
          name: this.translateService.instant('Contests.Accepted'),
          data: this.problemSummary.map((item) => item.accepted),
        },
      ],
      chart: {
        type: 'bar',
        height: 320,
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '40%',
          borderRadius: 6,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: this.problemSummary.map((item) => item.symbol),
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },
      colors: ['var(--primary)', '#28c76f'],
    };
  }

  private prepareVerdictChart() {
    if (!this.statistics?.verdicts) {
      this.verdictChart = null;
      return;
    }

    const verdicts = this.statistics.verdicts;
    const series = [
      verdicts.accepted,
      verdicts.wrongAnswer,
      verdicts.timeLimitExceeded,
      verdicts.other,
    ];
    const total = series.reduce((sum, value) => sum + value, 0);

    this.verdictChart = {
      series,
      labels: [
        this.translateService.instant('Contests.VerdictAccepted'),
        this.translateService.instant('Contests.VerdictWrongAnswer'),
        this.translateService.instant('Contests.VerdictTimeLimitExceeded'),
        this.translateService.instant('Contests.VerdictOther'),
      ],
      chart: {
        type: 'donut',
        height: 320,
      },
      legend: {
        position: 'bottom',
      },
      colors: ['#28c76f', '#ea5455', '#ff9f43', '#7367f0'],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: this.translateService.instant('Contests.Total'),
                formatter: () => total.toString(),
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
      },
    };
  }

  private prepareRecords() {
    const records = this.statistics?.records;

    this.firstSolves = records
      ? Object.entries(records.firstSolves || {})
        .map(([problem, record]) => ({ problem, record }))
        .sort((a, b) => a.problem.localeCompare(b.problem))
      : [];

    this.lastAccepted = records?.lastAccepted ?? null;
    this.mostAttempts = records?.mostAttemptsContestant ?? null;
  }

  private prepareBadges() {
    const badges = this.statistics?.badges || {};

    this.badgeEntries = Object.entries(badges)
      .filter(([, badge]) => !!badge)
      .map(([key, badge]) => ({
        key,
        labelKey: this.getBadgeLabelKey(key),
        badge: badge!,
      }));
  }

  private getBadgeLabelKey(key: string): string {
    const map: Record<string, string> = {
      sniper: 'Contests.Badges.Sniper',
      grinder: 'Contests.Badges.Grinder',
      optimizer: 'Contests.Badges.Optimizer',
      neverGiveUp: 'Contests.Badges.NeverGiveUp',
    };

    return map[key] || key;
  }

}
