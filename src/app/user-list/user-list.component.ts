import { Component, OnInit } from '@angular/core';
import {Ue} from "../models/ue.model";
import {UeService} from "../services/ue.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  ngOnInit(): void {
      throw new Error('Method not implemented.');
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

}
