import {Component, Input, OnChanges, OnInit,SimpleChanges,EventEmitter,Output} from '@angular/core';
import { Post } from 'src/app/models/post';
import {PostService} from "../../services/post.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit,OnChanges {
  @Input() post: Post | null = null;
  posts: Post[] = [];
  @Input() isProf: boolean = false;
  @Input() codeUe!: string;

  @Output() deleted = new EventEmitter<string>();
  @Output() updated = new EventEmitter<Post>();

  postToEdit: Post | null = null;

  constructor(private postService: PostService) {}

  ngOnInit() {
  }

  loadPosts() {
    this.postService.getPostsByUe(this.codeUe).subscribe({
      next: (posts) => this.posts = posts,
      error: (err) => console.error('Erreur chargement posts', err)
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['post']) {
    }
  }


  isFichierOrDevoir(): boolean {
    if (!this.post || !this.post.type_post) return false;
    const result = ['fichier', 'devoir'].includes(this.post.type_post.trim().toLowerCase());
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
