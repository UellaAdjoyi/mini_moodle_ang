import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-etudiant-post',
  templateUrl: './etudiant-post.component.html',
  styleUrls: ['./etudiant-post.component.css']
})
export class EtudiantPostComponent implements OnInit {

  codeUe: string | null = null;
  nomUe: string | null = null;

  activeTab: 'post' | 'forum' = 'post';
  isOnPost = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isOnPost = this.router.url.includes('post');
    });
  }

  setTab(tab: 'post' | 'forum') {
    this.activeTab = tab;
  }

  ngOnInit(): void {
    this.codeUe = this.route.snapshot.paramMap.get('code');
    this.nomUe = this.route.snapshot.paramMap.get('nom');
  }
}
