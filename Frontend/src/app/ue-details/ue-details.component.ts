import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Ue} from "../models/ue.model";

@Component({
  selector: 'app-ue-details',
  templateUrl: './ue-details.component.html',
  styleUrls: ['./ue-details.component.css']
})
export class UeDetailsComponent implements OnInit {
  @Input() ue: Ue | null = null;
  @Output() close = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
