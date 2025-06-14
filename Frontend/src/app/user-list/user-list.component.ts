import { Component, OnInit } from '@angular/core';
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
  selectedUser: User | null = null;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => console.error('Erreur lors du chargement des utilisateurs', err)
    });
  }


  showModal = false;

  openAddModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
    this.loadUsers(); // rafraîchir
  }


  onSaveUser($event: FormData) {

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


}
