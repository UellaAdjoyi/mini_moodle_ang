import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  activeTab:'ue'|'user' = 'ue';
  setTab(tab: 'ue'|'user') {
    this.activeTab = tab;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
