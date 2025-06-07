import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Ue} from "../models/ue.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UeService} from "../services/ue.service";

@Component({
  selector: 'app-ue-modal',
  templateUrl: './ue-modal.component.html',
  styleUrls: ['./ue-modal.component.css']
})
export class UeModalComponent implements OnInit {

  @Input() show = false;
  @Input() editUe: Ue | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  ueform: FormGroup;
  selectedImage: File | null = null;

  constructor(private fb: FormBuilder, private ueService: UeService) {
    this.ueform = this.fb.group({
      codeUe: [''],
      nomUe: [''],
      libelleUe: [''],
      image: [null],
    });
  }

  ngOnInit(): void {
        throw new Error('Method not implemented.');
    }



  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  submitForm() {
    const formData = new FormData();
    formData.append('codeUe', this.ueform.value.codeUe);
    formData.append('nomUe', this.ueform.value.nomUe);
    formData.append('libelleUe', this.ueform.value.libelleUe);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    const action = this.editUe

  }

}
