import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() show: boolean = false;
  // @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<FormData>();
  selectedFile: File | null = null;
  userForm!: FormGroup;
  selectedRoles: string[] = [];


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
              ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      date_naissance: [''],
      service_prof: [''],
      bureau_prof: [''],
      dernier_acces: [''],
      roles: [[], Validators.required]
    });

    this.userForm.get('roles')?.valueChanges.subscribe((roles: string[]) => {
      this.selectedRoles = roles;
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const user = this.userForm.value;
    this.userService.createUser(user).subscribe({
      next: res => {
        console.log('Utilisateur créé avec succès', res);
        this.close.emit();
      },
      error: err => {
        console.error('Erreur lors de la création', err);
      }
    });

    console.log("User à enregistrer :", user);

    this.close.emit(); // ferme le modal après enregistrement
  }

}
