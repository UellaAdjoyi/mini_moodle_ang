import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  message: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.resetForm.invalid) return;

    const { email } = this.resetForm.value;

    this.userService.resetPassword(email!).subscribe({
      next: res => {
        this.message = res.message;
        this.errorMessage = '';
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Erreur serveur.';
        this.message = '';
      }
    });
  }

}
