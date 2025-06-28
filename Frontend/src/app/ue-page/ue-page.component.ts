import { Component, OnInit } from '@angular/core';
import {Ue} from "../models/ue.model";
import {UeService} from "../services/ue.service";

@Component({
  selector: 'app-ue-page',
  templateUrl: './ue-page.component.html',
  styleUrls: ['./ue-page.component.css']
})
export class UePageComponent implements OnInit {

  ues:Ue[]=[];
  searchTerm:string='';

  constructor(
    private ueService: UeService,

  ) { }

  ngOnInit(): void {
    this.loadUes();
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


  filteredUes() {
    return this.ues.filter(ue => ue.nom.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

}
