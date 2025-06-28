import {Component, OnInit, Input, OnChanges,SimpleChanges} from '@angular/core';
import { Post } from 'src/app/models/post';
import {ActivatedRoute} from "@angular/router";
import {PostService} from "../../services/post.service";


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnChanges {
  @Input() codeUe!: string;
  isProf = false;
  isLoading = true;
  posts: Post[] = [];

  constructor(
    private postService: PostService,
     private route: ActivatedRoute,
              ) {}

  ngOnInit() {
    // this.codeUe = this.route.snapshot.paramMap.get('code');
    // this.nomUe = this.route.snapshot.paramMap.get('nom');
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

}
