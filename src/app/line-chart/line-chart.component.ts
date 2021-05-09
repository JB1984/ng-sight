import { Component,Input, OnInit } from '@angular/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { SalesDataService } from '../services/sales-data.service';
import { LINE_CHART_COLORS } from '../shared/chart.colors';
import { __values } from 'tslib';
import * as moment from 'moment';

//const LINE_CHART_SAMPLE_DATA: any[] = [
//  {data: [32,14,46,23,38,56], label: 'Sentiment Analysis'},
//  {data: [24,16,32,80,65,20], label: 'Image Recognition'},
//  {data: [18,24,9,7,17,25], label: 'Forecasting'},
//];

//const LINE_CHART_LABELS: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  constructor(private _salesDataService: SalesDataService) { }

  topCustomers: string[];
  allOrders: any[];

  @Input() inputData: any;

  lineChartData: any;
  lineChartLabels: any;
  lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };
  lineChartLegend: true;
  lineChartType = 'line';
  lineChartColors = LINE_CHART_COLORS;



  ngOnInit() {
    this._salesDataService.getOrders(1,100).subscribe(res => {
      this.allOrders = res['page']['data'];

      this.topCustomers = this.inputData.map(x => x['name']);

      const allChartData = this.topCustomers.reduce((result, i) => {
        result.push(this.getChartData(this.allOrders, i));
        return result;
      }, []);

      let dates = allChartData.map(x => x['data']).reduce((a, i) => {
        a.push(i.map(o => new Date(o[0])));
        return a;
      }, []); 

      //console.log(dates);
      dates = [].concat.apply([], dates);
      const r = this.getCustomerOrdersByDate(allChartData, dates)['data'];
      //console.log('r', r);
      this.lineChartLabels = r[0]['orders'].map(o => o['date']);

      this.lineChartData = [
        {'data': r[0]['orders'].map(x => x['total']), 'label': r[0]['customer']},
        {'data': r[1]['orders'].map(x => x['total']), 'label': r[1]['customer']},
        {'data': r[2]['orders'].map(x => x['total']), 'label': r[2]['customer']},
      ];
    });
  }

  getChartData(allOrders: any, name: string) {
    const customerOrders = allOrders.filter(o => o.customers.name == name);
    
    const formattedOrders = customerOrders.reduce((r,e) => {
      r.push([e.placed, e.total]);
      return r;
    }, []);
    //console.log(formattedOrders);

    const results = {customer: name, data: formattedOrders};
    //console.log(results);
    return results;
    
  }

  getCustomerOrdersByDate(orders: any, dates:any) {
    const customers = this.topCustomers;
    const prettyDates = dates.map(x => this.toFriendlyDate(x));
    const u = Array.from(new Set(prettyDates)).sort();

    const result = {};
    const dataSets = result['data'] = [];
    customers.reduce((x, y, i) => {
      //console.log('Reducing:', y, 'at index:', i);
      const customerOrders = [];
      dataSets[i] = {
        customer: y,
        orders: u.reduce((r, e, j) => {
          const obj = {};
          obj['date'] = e;
          obj['total'] = this.getCustomerDateTotal(e, y);
          customerOrders.push(obj);
          //console.log('Reducing:', e, 'at index:', j, 'customerOrders:', customerOrders);
          return customerOrders;
        })
      };
      return x;
    }, []);

    return result;
  }

  toFriendlyDate(date: Date) {
    return moment(date).endOf('day').format('YY-MM-DD');
  }

  getCustomerDateTotal(date: any, customer: string) {
    const r = this.allOrders.filter(o => o.customers.name === customer && this.toFriendlyDate(o.placed) === date);
    const result = r.reduce((a, b) => {
      return a + b.total;
    }, 0);

    return result;
  }

}
