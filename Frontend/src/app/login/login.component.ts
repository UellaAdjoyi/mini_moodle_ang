import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {LogService} from "../services/log.service";

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
    private logService: LogService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('user_id', '');
    formData.append('action','Connexion' );



    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (user) => {
        console.log('Utilisateur connecté:', user);
        this.logService.createLog({
          user_id: user._id,
          action: 'Connexion',
        }).subscribe(
          () => console.log('Log créé'),
          (err) => console.error('Erreur lors de la création du log', err)
        );


        if (user.role.includes ('ROLE_ETUDIANT')) {
          this.router.navigate(['/mesCours']);
        } else if (user.role.includes ('ROLE_PROF')) {
          this.router.navigate(['/mesCours']);
        } else if (user.role.includes('ROLE_ADMIN')) {
          this.router.navigate(['/catalogue']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: err => {
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Identifiants incorrects ou erreur serveur.';
        }
        console.error(err);
      }

    });
  }

}
