import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.css']
})
export class ShowPostComponent implements OnInit {
  codeUe: string | null = '';
    nomUe: string | null = '';
    activeTab:'post'|'forum'|'participant' = 'post';
    setTab(tab: 'post'|'forum' |'participant') {
      this.activeTab = tab;
    }
    isOnPostAll = false;

  constructor(private router: Router, private lien: ActivatedRoute) {
     this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Vérifie si l'URL contient 'post-all'
      this.isOnPostAll = this.router.url.includes('post-all');
    })
   }

  ngOnInit(): void {
    this.codeUe = this.lien.snapshot.paramMap.get('code');
    this.nomUe = this.lien.snapshot.paramMap.get('nom');
  }

}
