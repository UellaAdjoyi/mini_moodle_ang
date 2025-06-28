import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Post } from 'src/app/models/post'; // Adapte ce chemin si besoin
import { PostService } from 'src/app/services/post.service'; // Adapte ce chemin si besoin
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.css']
})
export class ShowPostComponent implements OnInit {

  codeUe: string | null = null;
  nomUe: string | null = null;

  activeTab: 'post' | 'forum' | 'participant' = 'post';

  isOnPostAll = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isOnPostAll = this.router.url.includes('post-all');
    });
  }

  setTab(tab: 'post' | 'forum' | 'participant') {
    this.activeTab = tab;
  }

  ngOnInit(): void {
    this.codeUe = this.route.snapshot.paramMap.get('code');
    this.nomUe = this.route.snapshot.paramMap.get('nom');
  }
}
