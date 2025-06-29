import {Component, Input, OnChanges, OnInit,SimpleChanges,EventEmitter,Output} from '@angular/core';
import {FormGroup,FormBuilder} from '@angular/forms';
import { Post } from 'src/app/models/post';
import {PostService} from "../../services/post.service";
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit,OnChanges {
  codeUE: string | null = null;
  devoirForm: FormGroup;
  devoirDuUser: any | undefined;
  userRole: string | null = null;
  devoirPath: string | null = null;
  @Input() post: Post | null = null;
  posts: Post[] = [];
  selectedFile: File | null = null;
  @Input() isProf: boolean = false;
  @Input() codeUe!: string;

  @Output() deleted = new EventEmitter<string>();
  @Output() updated = new EventEmitter<Post>();


  postToEdit: Post | null = null;

  constructor(private postService: PostService, private authService : AuthService, private fb: FormBuilder) {
    this.devoirForm = this.fb.group({
       postId: [''],
    });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || null;

    const userIdRecherche = this.authService.getCurrentUserId() ?? '';;
    this.devoirDuUser = this.post?.devoirs_remis?.find(devoir =>devoir.user_id === userIdRecherche);

  }

  loadPosts() {
    this.postService.getPostsByUe(this.codeUe).subscribe({
      next: (posts) => this.posts = posts,
      error: (err) => console.error('Erreur chargement posts', err)
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Fichier sélectionné :', file);
      this.selectedFile = file;
    }
  }

  submitDevoirForm(){
  const userId = this.authService.getCurrentUserId() ?? '';
  const userEmail = this.authService.getCurrentUserEmail() ?? '';
  const postId =this.post?._id?? '';
  console.log('Submit form appelé !', postId);
    const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('email', userEmail);
      formData.append('fichiers', this.selectedFile!);  


      this.postService.addDevoir(postId, formData).subscribe({
        next: res => {
          console.log('Devoir ajouté avec succès :', res);

         // Créer le log après réception du post créé
          const userId = this.authService.getCurrentUserId()?? '';
          const formLog = new FormData();
          formLog.append('user_id', userId);
          formLog.append('action', 'depot_devoir');
          formLog.append('cible_type', 'Post');
          formLog.append('cible_id', res._id); // on récupère l'ID du post créé

          // Envoyer la requête de création du log
          this.postService.createLog(formLog).subscribe({
            next: logRes => {
              console.log('log créé', logRes);
              console.log('log terminé');
            },
            error: logErr => {
              console.error('Erreur création du log', logErr);
            }
          });

        },
        error: err => {
          console.error('Erreur création du devoir :', err);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['post']) {
    }
  }

 
  isFichierOrDevoir(): boolean {
    if (!this.post || !this.post.type_post) return false;
    const result = ['fichier'].includes(this.post.type_post.trim().toLowerCase());
    // console.log(`isFichierOrDevoir for type_post "${this.post.type_post}":`, result);
    return result;
  }

  isMessagerOrDevoir(): boolean {
    if (!this.post || !this.post.type_post) return false;
    const result = ['devoir', 'message'].includes(this.post.type_post.trim().toLowerCase());
    // console.log(`isFichierOrDevoir for type_post "${this.post.type_post}":`, result);
    return result;
  }

deletePost(postId: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.deleted.emit(postId);
        window.location.reload();
      },
      error: err => {
        console.error('Erreur suppression :', err);
        alert('Erreur lors de la suppression.');
      }
    });
  }
}



  openEditModal(post: Post) {
    this.postToEdit = { ...post };
  }

  saveEdit() {
    if (!this.postToEdit || !this.postToEdit._id) return;

    const formData = new FormData();
    formData.append('titre', this.postToEdit.titre);
    formData.append('libelle', this.postToEdit.libelle);

    this.postService.updatePost(this.postToEdit._id, formData).subscribe({
      next: (updatedPost) => {
        this.updated.emit(updatedPost);
        this.postToEdit = null;
        window.location.reload();
      },
      error: err => {
        console.error('Erreur modification :', err);
        alert('Erreur lors de la modification.');
      }
    });
  }
}
