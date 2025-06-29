import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Post } from 'src/app/models/post';
import {PostService} from "../../services/post.service";
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-show-devoir',
  templateUrl: './show-devoir.component.html',
  styleUrls: ['./show-devoir.component.css']
})
export class ShowDevoirComponent implements OnInit {
  post: Post  | null = null;
  posts: Post[] = [];
  devoirPost: Post | undefined;
  mesDevoirs: any | undefined;
  correctionForm!: FormGroup;
  devoirSelectionne: any;
  codeUe: string | null = null;
  idPost: string | null = null;
  isLoading = true;

  constructor(private fb: FormBuilder, private postService: PostService,  private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {

    this.codeUe = this.route.snapshot.paramMap.get('codeUe') ?? "";
    this.idPost = this.route.snapshot.paramMap.get('idPost') ?? "";

        // this.loadPosts(this.codeUe);
        this.isLoading = true;
        this.postService.getPostsByUe(this.codeUe).subscribe(
          data => {
            console.log('Posts reçus:', data);
            this.posts = data;
            this.isLoading = false;
            this.devoirPost = this.posts.find(posted => posted._id === this.idPost);
            // console.log(this.devoirPost?.devoirs_remis?.[0]?._id);
            this.mesDevoirs=this.devoirPost?.devoirs_remis
          },
          error => {
            console.error('Erreur API:', error);
            this.posts = [];
            this.isLoading = false;
          }
        );

    
  }

  loadPosts(code: string) {
    this.isLoading = true;
    this.postService.getPostsByUe(code).subscribe(
      data => {
        console.log('Posts reçus:', data);
        this.posts = data;
        this.isLoading = false;
        this.devoirPost = this.posts.find(posted => posted._id === this.idPost);
        console.log(this.devoirPost);
      },
      error => {
        console.error('Erreur API:', error);
        this.posts = [];
        this.isLoading = false;
      }
    );
    
  }
  devoirEnCours: any = null;

  ouvrirCorrectionModal(devoir: any) {
  this.devoirEnCours = { ...devoir, note: devoir.note ?? '',
    commentaire_prof: devoir.commentaire_prof ?? '' };
   console.log(this.devoirEnCours);
}
  fermerCorrectionModal() {
    this.post = null;
  }

 saveEdit() {
  this.idPost = this.route.snapshot.paramMap.get('idPost') ?? "";
  if (!this.devoirEnCours) return;
  // console.log(this.devoirEnCours.note, this.devoirEnCours.commentaire_prof);

    const formData = new FormData();
    formData.append('note', this.mesDevoirs.fichiers.note);
    formData.append('commentaire', this.mesDevoirs.fichiers.commentaire);

    this.postService.corriger(this.idPost, this.mesDevoirs._id,formData).subscribe({
        next: res => {
          console.log('note et commenatire ajouté avec succès :', res);

         // Créer le log après réception du post créé
          const userId = this.authService.getCurrentUserId()?? '';
          const formLog = new FormData();
          formLog.append('user_id', userId);
          formLog.append('action', 'notation_devoir');
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

          this.fermerCorrectionModal()
        }
        
      });

    // this.postService.updatePost(this.postToEdit._id, formData).subscribe({
    //   next: (updatedPost) => {
    //     this.updated.emit(updatedPost);
    //     this.postToEdit = null;
    //     window.location.reload();
    //   },
    //   error: err => {
    //     console.error('Erreur modification :', err);
    //     alert('Erreur lors de la modification.');
    //   }
    // });
  }

}
