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
  @Input() role!: string;
  @Output() openDetails = new EventEmitter<Ue>();

  onOpenDetails() {
    this.openDetails.emit(this.ue);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/ue.png'; // image par défaut
  }

}
