import { Component, OnInit } from '@angular/core';
import {Ue} from "../models/ue.model";
import {UeService} from "../services/ue.service";
import {User} from "../models/user.model";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  searchTerm:string='';
  users:User[]=[];
  selectedUser:User|null=null;

  constructor(
    private userService:UserService,
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
  }

  onSaveUser($event: FormData) {

  }
  filteredUsers() {
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(user =>
      `${user.nom} ${user.prenom} ${user.email}`.toLowerCase().includes(term)
    );
  }

  openEditModal(user: User) {
    this.selectedUser = user;
    this.showModal = true;
  }

  deleteUser(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter(u => u.id !== id);
      });
    }
  }


}
