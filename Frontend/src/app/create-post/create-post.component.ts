import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  code: string | null = '';
  currentForm: 'message' | 'fichier' = 'message';
  messageForm: FormGroup;
  fileForm: FormGroup;
  today: string = new Date().toISOString().split('T')[0];
  selectedFile: File | null = null;
   maintenant = new Date();
   dateHeure = this.maintenant.toLocaleString();

  constructor(
    private lien: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router) {
    this.messageForm = this.fb.group({
      titre: [''],
      message: [''],
      addFile: [0],
      date_limit: [''],
      date_heure: this.dateHeure
    });

    this.fileForm = this.fb.group({
      fileTitle: [''],
      commentaire: ['']
    });
  }

  ngOnInit(): void {
    this.code = this.lien.snapshot.paramMap.get('codeUe');
  }

  toggleForm(form: 'message' | 'fichier') {
    this.currentForm = form;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submitMessageForm() {
    this.code = this.lien.snapshot.paramMap.get('codeUe');
    const data = {
      ...this.messageForm.value,
      // idProf: 1,
      codeUe: this.code 
    };
    console.log('Message envoyé', data);
  }

  submitFileForm() {
    const formData = new FormData();
    formData.append('fileTitle', this.fileForm.value.fileTitle);
    formData.append('commentaire', this.fileForm.value.commentaire);
    formData.append('fileUpload', this.selectedFile!);
    formData.append('idProf', '1');
    formData.append('codeUe', 'UE01');

    console.log('Fichier envoyé', formData);
  }

  cancel() {
    this.router.navigate(['/mesCours']);
  }
}
