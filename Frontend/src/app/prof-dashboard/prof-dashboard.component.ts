import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UeService} from "../services/ue.service";
import {Ue} from "../models/ue.model";
declare var Chart: any;
declare var jspdf: any;

@Component({
  selector: 'app-prof-dashboard',
  templateUrl: './prof-dashboard.component.html',
  styleUrls: ['./prof-dashboard.component.css']
})
export class ProfDashboardComponent implements OnInit,AfterViewInit {
  public mesCours: any[] = [];
  public stats: any = {};

  constructor(private ueService: UeService) {}

  ngOnInit() {
    this.ueService.getMesCours().subscribe(cours => {
      this.mesCours = cours;
      this.ngAfterViewInit();
      this.ueService.getStats().subscribe(stats => {
        this.stats = stats;
      });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.mesCours.forEach(ue => this.createChartForUE(ue));
    }, 200);
  }

  createChartForUE(ue: any) {
    const ctx = document.getElementById(`chart-${ue._id}`) as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Participants'],
        datasets: [{
          label: ue.nom,
          data: [ue.participants.length],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  downloadPDF(ue: any) {
    const doc = new jspdf.jsPDF();
    doc.text(`Participants de l'UE ${ue.nom}`, 10, 10);

    const rows = ue.participants.map((p: any, i: number) => [
      i + 1,
      `${p.prenom} ${p.nom}`,
      p.email
    ]);

    (doc as any).autoTable({
      head: [['#', 'Nom complet', 'Email']],
      body: rows,
      startY: 20
    });

    doc.save(`participants-${ue.code}.pdf`);
  }

}
