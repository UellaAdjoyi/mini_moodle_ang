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
  codeUe!: string;
  nomUe!: string;
  ueId!: string;
  isOnPostAll = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isOnPostAll = this.router.url.includes('post-all');
      });
  }

  ngOnInit(): void {
    // Récupère code, nom et ue_id du parent
    const params = this.route.snapshot.paramMap;
    this.codeUe = params.get('code')!;
    this.nomUe = params.get('nom')!;
    this.ueId   = params.get('ue_id')!;  // <-- on lit maintenant ue_id
  }

  setTab(tab: 'post' | 'forum' | 'participant') {
    this.isOnPostAll = (tab === 'post');
    let routeSegment: string;
    if (tab === 'post') {
      routeSegment = 'post-all';
    } else if (tab === 'forum') {
      routeSegment = 'forum-ue';
    } else {
      routeSegment = 'participants-ue';
    }

    this.router.navigate([routeSegment], { relativeTo: this.route });

  }
}
