import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Ue} from "../models/ue.model";

@Component({
  selector: 'app-ue-card',
  templateUrl: './ue-card.component.html',
  styleUrls: ['./ue-card.component.css']
})
export class UeCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() ue!: Ue;
  @Input() role!: string; // étudiant ou professeur
  @Output() openDetails = new EventEmitter<Ue>();

  onOpenDetails() {
    this.openDetails.emit(this.ue);
  }

}
