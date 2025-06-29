import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ForumService} from "../services/forum.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  ueId!: string;
  ueNom!: string;
  forums: any[] = [];
  newForumTitle = '';
  newForumDescription = '';
  isProf = false;
  loading = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService,
    private authService: AuthService,
    private router:Router
  ) { }

  // ngOnInit() {
  //   this.route.parent!.paramMap.subscribe(params => {
  //     const ueId = params.get('ue_id');
  //     const ueNom = params.get('nom');    // ← on lit aussi 'nom'
  //     if (!ueId || !ueNom) {
  //       console.error("Paramètres UE manquants dans l'URL");
  //       return;
  //     }
  //     this.ueId = ueId;
  //     this.ueNom = ueNom;
  //     this.isProf = this.authService.getUserRole() === 'ROLE_PROF';
  //     this.loadForums(this.ueId);
  //   });
  // }
  ngOnInit() {
    this.route.parent!.paramMap.subscribe(params => {
      const ueId = params.get('ue_id'), ueNom = params.get('nom');
      this.ueId = ueId!;
      this.ueNom = ueNom!;
      console.log('ForumComponent: role récupéré =', this.authService.getUserRoles());
      this.isProf = this.authService.getUserRoles().includes('ROLE_PROF');
      console.log('ForumComponent: isProf ?', this.isProf);

      this.loadForums(this.ueId);
    });
  }


  loadForums(ueId: string) {
    this.loading = true;
    this.forumService.getForumsByUE(ueId).subscribe({
      next: (forums) => {
        this.forums = forums;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Erreur lors du chargement des forums.';
        this.loading = false;
      }
    });
  }

  createForum() {
    if (!this.newForumTitle.trim()) {
      this.errorMsg = 'Le titre est obligatoire';
      return;
    }
    const forumData = {
      ue_id: this.ueId,
      titre: this.newForumTitle,
      description: this.newForumDescription
    };
    this.forumService.createForum(forumData).subscribe({
      next: (createdForum) => {
        this.forums.push(createdForum);
        this.newForumTitle = '';
        this.newForumDescription = '';
        this.errorMsg = '';
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Erreur lors de la création du forum.';
      }
    });
  }

  goToForum(forumId: string) {
    this.router.navigate(['../forum-ue', forumId], { relativeTo: this.route });
  }
}
