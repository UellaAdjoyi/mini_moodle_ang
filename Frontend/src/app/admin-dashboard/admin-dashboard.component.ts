import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
declare var Chart: any;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements AfterViewInit {

  constructor(
    private userService: UserService,
  ) {}

  ngAfterViewInit(): void {
    this.userService.getStats().subscribe(data => {
      this.initBarChart(data.activeUsersByMonth);
      this.initLineChart(data.coursesByWeek);
    });
  }

  initBarChart(data: any[]) {
    const labels = data.map(d => `Mois ${d._id}`);
    const values = data.map(d => d.count);

    const ctx = (document.getElementById('barChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Utilisateurs actifs',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  initLineChart(data: any[]) {
    const labels = data.map(d => `Semaine ${d._id}`);
    const values = data.map(d => d.count);

    const ctx = (document.getElementById('lineChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nouveaux cours créés',
          data: values,
          borderColor: 'rgba(255, 99, 132, 0.8)',
          fill: false,
          tension: 0.4
        }]
      },
      options: {
        responsive: true
      }
    });
  }

}
