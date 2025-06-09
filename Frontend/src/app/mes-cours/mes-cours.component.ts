import { Component, OnInit } from '@angular/core';
import {Ue} from "../models/ue.model";

@Component({
  selector: 'app-mes-cours',
  templateUrl: './mes-cours.component.html',
  styleUrls: ['./mes-cours.component.css']
})
export class MesCoursComponent implements OnInit {

  role: string = '';
  ues: Ue[] = [];
  private ueService: any;

  constructor() { }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.loadUserUes();
  }

  loadUserUes() {
    if (this.role === 'etudiant') {
      this.ueService.getUesSuivies().subscribe((data: Ue[]) => this.ues = data);
    } else if (this.role === 'professeur') {
      this.ueService.getUesEnseignees().subscribe((data: Ue[]) => this.ues = data);
    }
  }

  handleOpenDetails(ue: Ue) {
    console.log('Détails UE :', ue);
    // ou navigation, ou modal, etc.
  }


}
