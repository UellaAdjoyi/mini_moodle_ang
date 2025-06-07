import { Component, OnInit } from '@angular/core';
import {Ue} from "../models/ue.model";
import {UeService} from "../services/ue.service";

@Component({
  selector: 'app-ue-list',
  templateUrl: './ue-list.component.html',
  styleUrls: ['./ue-list.component.css']
})
export class UeListComponent implements OnInit {

  ues:Ue[]=[];
  searchTerm:string='';
  showModal:boolean=false;
  selectedUe:Ue|null=null;
  constructor(
    private ueService: UeService
  ) { }

  ngOnInit(): void {
    this.loadUes();
  }

  loadUes() {

  }

  filteredUes() {
    return this.ues.filter(ue => ue.nomUe.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  openAddModal() {
    this.selectedUe = null;
    this.showModal = true;
  }

  openEditModal(ue: Ue) {
    this.selectedUe = ue;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}
