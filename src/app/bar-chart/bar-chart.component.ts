import { Component, OnInit } from '@angular/core';

const SAMPLE_BARCHART_DATA: any[] = [
  {data: [65,59,88,81,56,54,30], label: 'Q3 Sales'},
  {data: [20,25,30,31,45,56,60], label: 'Q4 Sales'}
]

const SAMPLE_BARCHART_LABELS: string[] = ['W1','W2', 'W3', 'W4', 'W5', 'W6', 'W7']

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  constructor() { }

  public barChartData: any[] = SAMPLE_BARCHART_DATA;
  public barChartLabels: string[] = SAMPLE_BARCHART_LABELS;
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartOptions: any = {
    scaleShowVerticalkLines: false,
    responsive: true
  };

  ngOnInit(): void {
  }

}
