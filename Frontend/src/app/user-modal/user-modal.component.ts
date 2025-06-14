import {Component, EventEmitter, Input, OnInit, Output,OnChanges,SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit, OnChanges{
  @Output() close = new EventEmitter<void>();
  @Input() show: boolean = false;
  @Output() save = new EventEmitter<FormData>();

  selectedFile: File | null = null;
  userForm!: FormGroup;
  selectedRoles: string[] = [];
  @Input() userToEdit: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.patchUser();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userToEdit'] && !changes['userToEdit'].isFirstChange()) {
      this.patchUser();
    }
  }

  initForm() {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      date_naissance: [''],
      service_prof: [''],
      bureau_prof: [''],
      dernier_acces: [''],
      roles: ['', Validators.required]  // simple string, pas tableau ici
    });

    this.userForm.get('roles')?.valueChanges.subscribe((roles: string[]) => {
      this.selectedRoles = Array.isArray(roles) ? roles : [roles];
    });
  }

  patchUser() {
    if (this.userForm && this.userToEdit) {
      this.userForm.patchValue({
        nom: this.userToEdit.nom,
        prenom: this.userToEdit.prenom,
        email: this.userToEdit.email,
        date_naissance: this.userToEdit.date_naissance,
        service_prof: this.userToEdit.service_prof,
        bureau_prof: this.userToEdit.bureau_prof,
        dernier_acces: this.userToEdit.dernier_acces,
        roles: this.userToEdit.role  // string simple
      });
      this.selectedRoles = [this.userToEdit.role];
    }
    else if (this.userForm && !this.userToEdit) {
      this.userForm.reset();
      this.selectedRoles = [];
    }
  }


  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.userForm.value.nom);
    formData.append('prenom', this.userForm.value.prenom);
    formData.append('email', this.userForm.value.email);
    formData.append('date_naissance', this.userForm.value.date_naissance || '');
    formData.append('serviceProf', this.userForm.value.service_prof || '');
    formData.append('bureauProf', this.userForm.value.bureau_prof || '');
    formData.append('dernier_acces', this.userForm.value.dernier_acces || '');
    if (this.selectedRoles.length > 0) {
      formData.append('role', this.selectedRoles[0]);
    } else {
      formData.append('role', '');
    }

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    if (this.userToEdit && this.userToEdit._id) {
      this.userService.updateUser(this.userToEdit._id, formData).subscribe({
        next: res => {
          console.log('Utilisateur mis à jour', res);
          this.close.emit();
        },
        error: err => console.error('Erreur de modification', err)
      });
    } else {
      this.userService.createUser(formData).subscribe({
        next: res => {
          console.log('Utilisateur créé', res);
          this.close.emit();
        },
        error: err => console.error('Erreur création', err)
      });
    }
  }


}
