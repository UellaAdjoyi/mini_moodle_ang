import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Ue} from "../models/ue.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UeService} from "../services/ue.service";

@Component({
  selector: 'app-ue-modal',
  templateUrl: './ue-modal.component.html',
  styleUrls: ['./ue-modal.component.css']
})
export class UeModalComponent implements OnInit {

  @Input() show: boolean = false;
  @Input() editUe: Ue | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  ueform!: FormGroup;
  selectedFile?: File;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.ueform = this.fb.group({
      code: [this.editUe?.code|| '', Validators.required],
      nom: [this.editUe?.nom || '', Validators.required],
      libelle: [this.editUe?.libelle || '']
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  submitForm() {
    if (this.ueform.invalid) return;

    const ueData = {
      nom: this.ueform.get('nomUe')?.value,
      code: this.ueform.get('codeUe')?.value,
      description: this.ueform.get('libelleUe')?.value,
      image: null
    };

    this.save.emit(ueData);
    this.close.emit();
  }

}
