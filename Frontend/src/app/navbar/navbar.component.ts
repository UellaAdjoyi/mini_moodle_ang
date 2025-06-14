import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userRole: string | null = null;

  // Ajout des infos utilisateur
  user: { nom?: string; prenom?: string; photoUrl?: string } = {};

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || null;
    this.user.nom = currentUser?.nom || '';
    this.user.prenom = currentUser?.prenom || '';

    if (currentUser?.photoBase64) {
      this.user.photoUrl = `data:image/png;base64,${currentUser.photoBase64}`;
    } else {
      this.user.photoUrl = currentUser?.photoUrl || '';
    }

    console.log('Role:', this.userRole);
    console.log('User:', this.user);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.userRole = null;
    this.user = {};
  }

}
