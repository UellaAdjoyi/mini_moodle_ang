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
  @Output() save = new EventEmitter<FormData>();

  ueform!: FormGroup;
  selectedFile?: File;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.ueform = this.fb.group({
      codeUe: [this.editUe?.codeUe || '', Validators.required],
      nomUe: [this.editUe?.nomUe || '', Validators.required],
      libelleUe: [this.editUe?.libelleUe || '']
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  submitForm() {
    if (this.ueform.invalid) return;

    const formData = new FormData();
    formData.append('codeUe', this.ueform.get('codeUe')?.value);
    formData.append('nomUe', this.ueform.get('nomUe')?.value);
    formData.append('libelleUe', this.ueform.get('libelleUe')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.save.emit(formData);
    this.close.emit();
  }

}
