import { Component, OnInit,Input } from '@angular/core';
import {Ue} from "../models/ue.model";
import {UeService} from "../services/ue.service";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-mes-cours',
  templateUrl: './mes-cours.component.html',
  styleUrls: ['./mes-cours.component.css']
})
export class MesCoursComponent implements OnInit {
  ues: Ue[] = [];
  loading = false;
  error = '';
  role = '';
  userId!: string;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && currentUser._id) {
      this.userId = currentUser._id;
      this.role = currentUser.role[0]; // "ROLE_ETUDIANT" ou "ROLE_PROF"
      this.loadUserUes();
    } else {
      this.error = 'Utilisateur non défini';
    }
  }

  loadUserUes() {
    this.loading = true;
    this.userService.getUesByUser(this.userId).subscribe({
      next: (ues: Ue[]) => {
        this.ues = ues;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les UEs';
        this.loading = false;
      }
    });
  }

  handleOpenDetails(ue: Ue) {
    console.log('Détails UE :', ue);
  }
}
