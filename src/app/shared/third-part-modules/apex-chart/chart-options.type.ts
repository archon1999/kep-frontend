import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels, ApexFill,
  ApexGrid, ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle, ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors?: Array<string>;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  fill?: ApexFill;
  dataLabels?: ApexDataLabels;
  grid?: ApexGrid;
  stroke?: ApexStroke;
  title?: ApexTitleSubtitle;
  tooltip?: ApexTooltip;
  plotOptions?: ApexPlotOptions;
  labels?: string[];
}
