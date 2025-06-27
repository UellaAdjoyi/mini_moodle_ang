import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {UserService} from "../services/user.service";
import {AdminService, AdminStats} from "../services/admin.service";
declare var Chart: any;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements AfterViewInit,OnInit {
  stats: any;
  loading = false;
  error = '';

  @ViewChild('usersChart') usersChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('uesChart') uesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('forumsChart') forumsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('devoirsChart') devoirsChartRef!: ElementRef<HTMLCanvasElement>;

  usersChart: any;
  uesChart: any;
  forumsChart: any;
  devoirsChart: any;
  private viewInitialized = false;

  constructor(private adminService: AdminService) {}



  ngOnInit() {
    this.loading = true;
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        if (this.viewInitialized) {
          this.initAllCharts();
        }
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des statistiques';
        this.loading = false;
        console.error(err);
      }
    });
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
    if (this.stats) {
      this.initAllCharts();
    }
  }

  getRoleLabel(roleId: string) {
    const map: any = {
      ROLE_ADMIN: 'Admin',
      ROLE_PROF: 'Professeur',
      ROLE_ETUDIANT: 'Étudiant'
    };
    return map[roleId] || roleId;
  }

  initAllCharts() {
    setTimeout(() => {
      this.initUsersChart();
      this.initUesChart();
      this.initForumsChart();
      this.initDevoirsChart();
    });
  }


  updateAllCharts() {
    this.usersChart.data.datasets[0].data = this.stats.usersByRole.map((r: any) => r.count);
    this.usersChart.update();

    this.uesChart.data.datasets[0].data = [
      this.stats.totalUEs,
      this.stats.ueWithParticipants,
      this.stats.ueWithEnseignants
    ];
    this.uesChart.update();

    this.forumsChart.data.datasets[0].data = [
      this.stats.totalForums,
      this.stats.totalPosts,
      this.stats.totalMessages
    ];
    this.forumsChart.update();

    this.devoirsChart.data.datasets[0].data = [this.stats.totalDevoirsRemis];
    this.devoirsChart.update();
  }

  initUsersChart() {
    const ctx = this.usersChartRef.nativeElement.getContext('2d');
    this.usersChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.stats.usersByRole.map((r: any) => this.getRoleLabel(r._id)),
        datasets: [{
          data: this.stats.usersByRole.map((r: any) => r.count),
          backgroundColor: ['#0d6efd', '#198754', '#dc3545']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { enabled: true }
        }
      }
    });
  }

  initUesChart() {
    const ctx = this.uesChartRef.nativeElement.getContext('2d');
    this.uesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total UEs', 'UEs avec participants', 'UEs avec enseignants'],
        datasets: [{
          label: 'Unités d’enseignement',
          data: [
            this.stats.totalUEs,
            this.stats.ueWithParticipants,
            this.stats.ueWithEnseignants
          ],
          backgroundColor: ['#198754', '#20c997', '#0dcaf0']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  initForumsChart() {
    const ctx = this.forumsChartRef.nativeElement.getContext('2d');
    this.forumsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Forums', 'Posts', 'Messages'],
        datasets: [{
          label: 'Forums & Posts',
          data: [
            this.stats.totalForums,
            this.stats.totalPosts,
            this.stats.totalMessages
          ],
          backgroundColor: ['#ffc107', '#fd7e14', '#dc3545']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  initDevoirsChart() {
    const ctx = this.devoirsChartRef.nativeElement.getContext('2d');
    this.devoirsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Devoirs remis', 'Manquants'],
        datasets: [{
          data: [this.stats.totalDevoirsRemis, Math.max(0, this.stats.totalUsers - this.stats.totalDevoirsRemis)],
          backgroundColor: ['#dc3545', '#6c757d']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

}
