import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ForumService} from "../services/forum.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-forum-details',
  templateUrl: './forum-details.component.html',
  styleUrls: ['./forum-details.component.css']
})
export class ForumDetailsComponent implements OnInit {

  forumId!: string;
  forum: any;
  newMessageContent = '';
  loading = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.forumId = this.route.snapshot.paramMap.get('forumId')
      || this.route.snapshot.paramMap.get('id')!;

    if (!this.forumId) {
      this.errorMsg = 'Forum ID manquant dans l\'URL.';
      return;
    }

    this.loadForum();
  }


  loadForum() {
    this.loading = true;
    this.forumService.getForumById(this.forumId).subscribe({
      next: (forum) => {
        this.forum = forum;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Erreur lors du chargement du forum.';
        this.loading = false;
      }
    });
  }

  addMessage() {
    if (!this.newMessageContent.trim()) {
      this.errorMsg = 'Le contenu est obligatoire.';
      return;
    }

    const user = this.authService.getCurrentUser();
    console.log('User:', user);

    if (!user || !user._id) {
      this.errorMsg = 'Utilisateur non authentifié.';
      return;
    }

    const auteur = {
      user_id: user._id,
      nom: user.nom,
      prenom: user.prenom
    };

    this.forumService.addMessageToForum(this.forumId, {
      contenu: this.newMessageContent,
      auteur
    }).subscribe({
      next: (updatedForum) => {
        this.forum = updatedForum;
        this.newMessageContent = '';
        this.errorMsg = '';
      },
      error: () => {
        this.errorMsg = 'Erreur lors de l\'ajout du message.';
      }
    });
  }

}
