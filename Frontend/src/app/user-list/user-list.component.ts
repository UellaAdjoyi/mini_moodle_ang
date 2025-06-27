import {Component, NgIterable, OnInit} from '@angular/core';
import {Ue} from "../models/ue.model";
import {UeService} from "../services/ue.service";
import {User} from "../models/user.model";
import {UserService} from "../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmDialogComponent} from "../utils/confirm-dialog/confirm-dialog.component";


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  searchTerm: string = '';
  users: User[] = [];
  ues: Ue[] = [];
  selectedUser: User | null = null;
  showModal = false;
  protected readonly Ue = Ue;
  showAssignModal = false;


  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ueService: UeService,
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadUes()
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => console.error('Erreur lors du chargement des utilisateurs', err)
    });
  }

  loadUes() {
    this.ueService.getAllUes().subscribe({
      next: (data) => {
        console.log('UEs reçues:', data);
        this.ues = data;
      },
      error: (err) => console.error('Erreur lors du chargement des UEs', err)
    });
  }

  openAddModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
    this.loadUsers();
    this.loadUes()
  }

  onSaveUser(event: any) {
    console.log('Utilisateur enregistré :', event);
  }


  filteredUsers() {
    const result = this.users.filter(u => {
      const match = u.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      return match;
    });

    return result;
  }


  openEditModal(user: User) {
    this.selectedUser = user;
    this.showModal = true;
  }


  deleteUser(userId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer cet utilisateur ?',
        message: 'Cette action est irréversible.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            this.snackBar.open('Utilisateur supprimé avec succès.', 'Fermer', { duration: 3000 });
            this.loadUsers();
          },
          error: err => {
            this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
            console.error(err);
          }
        });
      }
    });
  }

  assignUeToUser(event: { userId: string; ueId: string; role: string }) {
    const { userId, ueId, role } = event;

    this.userService.assignUeToUser(userId, ueId, role).subscribe(() => {
      this.loadUsers();
      this.showAssignModal = false;
    });
  }



  removeUeFromUser(userId: string, ueId: string) {
    this.userService.removeUeFromUser(userId, ueId).subscribe({
      next: () => {
        this.snackBar.open('Utilisateur retiré de l’UE', 'Fermer', { duration: 3000 });
        this.loadUsers();
      },
      error: (err) => {
        this.snackBar.open('Erreur lors du retrait', 'Fermer', { duration: 3000 });
        console.error(err);
      }
    });
  }


  openAssignModal(user: any) {
    this.selectedUser = user;
    this.showAssignModal = true;
  }

  apiUrl = 'http://localhost:3000';

  getUserPhoto(user: User): string {
    if (user.photo) {
      return `${this.apiUrl}${user.photo}`;
    } else {
      return 'assets/images/avatar.png';
    }
  }


}
