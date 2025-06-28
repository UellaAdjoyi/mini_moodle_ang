import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../models/user.model";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  profilForm!: FormGroup;
  photoFile!: File | null;
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.profilForm = this.fb.group({
      nom: [''],
      prenom: [''],
      dtnaiss: [''],
      password: ['']
    });

    // données du profil
    this.userService.getProfile().subscribe(user => {
      this.profilForm.patchValue({
        nom: user.nom,
        prenom: user.prenom,
        date_naissance: user.date_naissance?.substring(0, 10),
      });
      this.photoPreview = user.photo;
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.photoFile = file;

      // Aperçu image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('nom', this.profilForm.value.nom);
    formData.append('prenom', this.profilForm.value.prenom);
    formData.append('dtnaiss', this.profilForm.value.dtnaiss);
    if (this.profilForm.value.password) {
      formData.append('password', this.profilForm.value.password);
    }
    if (this.photoFile) {
      formData.append('photo', this.photoFile);
    }

    this.userService.updateProfile(formData).subscribe({
      next: () => alert('Profil mis à jour !'),
      error: err => alert('Erreur lors de la mise à jour : ' + err.message)
    });
  }

}
