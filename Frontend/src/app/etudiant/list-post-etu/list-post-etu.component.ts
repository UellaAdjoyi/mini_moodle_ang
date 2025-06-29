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
  codeUe!: string;
  posts: Post[] = [];

  constructor(private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupérer le paramètre 'code' depuis la route parente
    this.route.parent?.paramMap.subscribe(params => {
      const code = params.get('code');
      if (code) {
        this.codeUe = code;
        this.loadPosts();
      }
    });
  }

  loadPosts() {
    console.log('Chargement posts pour UE:', this.codeUe);
    this.postService.getPostsByUe(this.codeUe).subscribe({
      next: (posts) => {
        console.log('Posts reçus:', posts);
        this.posts = posts;
      },
      error: (err) => console.error('Erreur chargement posts', err)
    });
  }
}
