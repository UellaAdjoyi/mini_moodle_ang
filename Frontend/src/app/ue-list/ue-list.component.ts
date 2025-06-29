import { Component, OnInit } from '@angular/core';
import {Ue} from "../models/ue.model";
import {UeService} from "../services/ue.service";
import {ConfirmDialogComponent} from "../utils/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

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
  showDetailsModal = false;


  constructor(
    private ueService: UeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,

  ) { }

  ngOnInit(): void {
   this.loadUes();
  }

  loadUes() {
    this.ueService.getAllUes().subscribe({
      next: (data) => {
        // console.log('UEs reçues:', data);
        this.ues = data;
      },
      error: (err) => console.error('Erreur lors du chargement des UEs', err)
    });
  }


  onSaveUe(formData: FormData) {
    if (this.selectedUe) {
      // une modification
      this.ueService.updateUe(this.selectedUe._id, formData).subscribe({
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


  deleteUe(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer cette Ue?',
        message: 'Cette action est irréversible.'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ueService.deleteUe(id).subscribe({
          next: () => {
            this.snackBar.open('Utilisateur supprimé avec succès.', 'Fermer', {duration: 3000});
            this.loadUes();
          },
          error: (err: any) => {
            this.snackBar.open('Erreur lors de la suppression.', 'Fermer', {duration: 3000});
            console.error(err);
          }
        });
      }
    });
  }


  getImageUrl(imageName: string): string {
    return `http://localhost:3000/uploads/ues/${imageName}`;
  }

  openUeDetails(ue: Ue) {
    this.selectedUe = ue;
    this.showDetailsModal = true;
  }


}
