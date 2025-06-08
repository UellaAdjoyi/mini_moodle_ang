import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm=new FormGroup({
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required)

  })
  errorMessage:string=''

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        const user = this.authService.getCurrentUser();

        // Redirection selon le rôle
        if (user.role === 'etudiant') {
          this.router.navigate(['/ueStudent']);
        } else if (user.role === 'prof') {
          this.router.navigate(['/profs/alertes']);
        } else if (user.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: err => {
        this.errorMessage = 'Identifiants incorrects ou erreur serveur.';
        console.error(err);
      }
    });
  }

}
