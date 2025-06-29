import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Post} from "../../models/post";
import {PostService} from "../../services/post.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-list-post-etu',
  templateUrl: './list-post-etu.component.html',
  styleUrls: ['./list-post-etu.component.css']
})
export class ListPostEtuComponent implements OnInit {
  @Input() codeUe!: string;
  isProf = false;
  isLoading = true;
  posts: Post[] = [];

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isProf = currentUser.role && currentUser.role.includes('professeur');

    this.route.parent?.paramMap.subscribe(params => {
      const code = params.get('code');
      if (code) {
        this.loadPosts(code);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['codeUe'] && changes['codeUe'].currentValue) {
      this.loadPosts(changes['codeUe'].currentValue);
    }
  }

  loadPosts(codeUe: string) {
    this.isLoading = true;
    this.postService.getPostsByUe(codeUe).subscribe(
      data => {
        console.log('Posts reçus:', data);
        this.posts = data;
        this.isLoading = false;
      },
      error => {
        console.error('Erreur API:', error);
        this.posts = [];
        this.isLoading = false;
      }
    );
  }
  onPostDeleted(postId: string) {
    console.log('Post supprimé', postId);
    // this.loadPosts(this.codeUe);
  }

  onPostUpdated(updatedPost: Post) {
    console.log('Post modifié', updatedPost);
    // this.loadPosts(this.codeUe);
  }

}
