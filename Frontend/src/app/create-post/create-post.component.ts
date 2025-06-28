import { EventEmitter,Component, OnInit, Output } from '@angular/core';
import {FormGroup,FormBuilder} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  code: string | null = '';
  currentForm: 'message' | 'fichier' = 'message';
  messageForm: FormGroup;
  fileForm: FormGroup;
  today: string = new Date().toISOString().split('T')[0];
  selectedFile: File | null = null;
   maintenant = new Date();
   dateHeure = this.maintenant.toLocaleString();

  constructor(
    private postservice: PostService,
    private lien: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router) {
    this.messageForm = this.fb.group({
      titre: [''],
      message: [''],
      addFile: [0],
      date_limit: [''],
      date_heure: [this.dateHeure]
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
  if (event.target.files.length > 0) {
    this.selectedFile = event.target.files[0];
  }
}

  submitMessageForm() {
  const codeUe = this.lien.snapshot.paramMap.get('codeUe') ?? '';

  // Créer le FormData
  const formMessage = new FormData();
  formMessage.append('titre', this.messageForm.value.titre);
  formMessage.append('libelle', this.messageForm.value.message);
  formMessage.append('date_limit', this.messageForm.value.date_limit);
  formMessage.append('codeUE', codeUe);

  // Ajouter le type_post si nécessaire
  if (this.messageForm.value.addFile == 1) {
    formMessage.append('type_post', 'devoir');
  }else {
    formMessage.append('type_post', 'message');
  }

  // Envoyer la requête via le service
  this.postservice.createPost(formMessage).subscribe({
    next: res => {
      console.log('Message créé', res);
      this.close.emit();
    },
    error: err => console.error('Erreur création du message', err)
  });
}


  submitFileForm() {
    const codeUe = this.lien.snapshot.paramMap.get('codeUe') ?? '';
    const formData = new FormData();
    formData.append('titre', this.fileForm.value.fileTitle);
    formData.append('libelle', this.fileForm.value.commentaire);
    formData.append('fichiers_attaches', this.selectedFile!);
    formData.append('codeUE', codeUe);
    formData.append('type_post', 'fichier');

    console.log('Fichier envoyé', formData);
    // Envoyer la requête via le service
  this.postservice.createFilePost(formData).subscribe({
    next: res => {
      console.log('fichier posté', res);
      this.close.emit();
    },
    error: err => console.error('Erreur création du fichier', err)
  });
  }

  cancel() {
    this.router.navigate(['/mesCours']);
  }

  valide() {
    this.router.navigate(['/']);
  }
}
