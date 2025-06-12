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

  constructor(
    private authService: AuthService,
    private router: Router,
    ) {}

  ngOnInit() {
    this.loadUserRole();
  }

  loadUserRole() {
    const user = this.authService.getCurrentUser();
    this.userRole = user?.role || null;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.userRole = null;

  }

}
