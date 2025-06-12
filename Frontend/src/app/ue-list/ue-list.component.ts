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
    private ueService: UeService,

  ) { }

  ngOnInit(): void {
    this.loadUes();
  }

  loadUes() {
    this.ueService.getAllUes().subscribe({
      next: (data) => this.ues = data,
      error: (err) => console.error('Erreur lors du chargement des UEs', err)
    });
  }

  onSaveUe(formData: FormData) {
    if (this.selectedUe) {
      // une modification
      this.ueService.updateUe(this.selectedUe.code, formData).subscribe({
        next: () => {
          this.loadUes();
          this.closeModal();
        },
        error: err => console.error('Erreur lors de la mise à jour', err)
      });
    } else {
      // C'est une création
      this.ueService.createUe(formData).subscribe({
        next: () => {
          this.loadUes();
          this.closeModal();
        },
        error: err => console.error('Erreur lors de la création', err)
      });
    }
  }



  filteredUes() {
    return this.ues.filter(ue => ue.nom.toLowerCase().includes(this.searchTerm.toLowerCase()));
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

  deleteUe(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette UE ?')) {
      this.ueService.deleteUe(id).subscribe(() => {
        this.ues = this.ues.filter(u => u.code!== id);
      });
    }
  }


}
