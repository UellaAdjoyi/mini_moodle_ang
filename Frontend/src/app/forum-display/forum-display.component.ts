import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ForumService } from '../services/forum.service';
import { AuthService } from '../services/auth.service';
import { Forum, Message } from '../models/forum.model';
import { User } from '../models/user.model'; // Modèle User existant
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forum-display',
  templateUrl: './forum-display.component.html',
  styleUrls: ['./forum-display.component.css']
})
export class ForumDisplayComponent implements OnInit, OnChanges {
  @Input() ueId!: string; // Reçu du composant parent (page de l'UE)
  
  forum: Forum | null = null;
  isLoading = true;
  error: string | null = null;
  currentUser: User | null = null;

  newMessageForm: FormGroup;

  constructor(
    private forumService: ForumService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.newMessageForm = this.fb.group({
      contenu: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    // this.loadForum(); // Déplacé vers ngOnChanges pour réagir aux changements de ueId
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ueId'] && this.ueId) {
      this.loadForum();
    }
  }

  loadForum(): void {
    if (!this.ueId) return;
    this.isLoading = true;
    this.error = null;
    this.forumService.getForumByUe(this.ueId).subscribe({
      next: (data) => {
        this.forum = data;
        this.isLoading = false;
      },
      error: (err) => {
        // Si le forum n'existe pas (404), on pourrait vouloir afficher un bouton de création pour le prof
        if (err.status === 404 && this.currentUser?.role === 'prof') {
            this.error = "Aucun forum n'existe pour cette UE. Vous pouvez en créer un.";
            this.forum = null; // S'assurer que le forum est null
        } else {
            this.error = err.message || 'Impossible de charger le forum.';
            this.forum = null;
        }
        this.isLoading = false;
      }
    });
  }

  onPostNewMessage(): void {
    if (this.newMessageForm.invalid || !this.forum) {
      return;
    }
    const messageData = { contenu: this.newMessageForm.value.contenu };
    this.forumService.addMessageToForum(this.forum._id, messageData).subscribe({
      next: (newMessage) => {
        // Idéalement, l'API renvoie le message complet avec l'auteur populé
        // Si ce n'est pas le cas, il faut reconstruire l'auteur à partir de currentUser
        if (!newMessage.auteur || !newMessage.auteur.user_id) { // Simple vérification
            newMessage.auteur = {
                user_id: this.currentUser!._id, // Assumer que currentUser est non null ici
                nom: this.currentUser!.nom,
                prenom: this.currentUser!.prenom,
                };
        }
        this.forum?.messages.push(newMessage); // Ajouter à la fin pour un ordre chronologique ascendant
        // Ou this.forum?.messages.unshift(newMessage) pour mettre au début (ordre descendant)
        this.newMessageForm.reset();
      },
      error: (err) => {
        this.error = err.message || 'Erreur lors de l_envoi du message.';
        // Peut-être un toast/snackbar pour l'erreur
      }
    });
  }

  // Optionnel : Méthode pour créer le forum si le prof clique sur un bouton
  createForum(): void {
    if (this.currentUser?.role !== 'prof' || !this.ueId) return;
    // Ouvrir un modal ou un formulaire simple pour titre/description
    const forumData = {
        titre: `Forum de discussion - UE ${this.ueId}`, // Titre par défaut
        description: `Discussions générales pour l'UE.`
    };
    this.forumService.createForumForUe(this.ueId, forumData).subscribe({
        next: (newForum) => {
            this.forum = newForum;
            this.error = null;
        },
        error: (err) => {
            this.error = err.message || "Erreur lors de la création du forum.";
        }
    });
  }

  // Helper pour afficher le nom de l'auteur
  getAuteurNom(message: Message): string {
    if (typeof message.auteur.user_id === 'object' && message.auteur.user_id !== null) {
      return `${message.auteur.user_id.prenom} ${message.auteur.user_id.nom}`;
    }
    // Fallback si user_id n'est pas populé, mais vous devriez viser à toujours l'avoir populé
    return `${message.auteur.prenom || ''} ${message.auteur.nom || 'Auteur inconnu'}`;
  }

   // Helper pour l'avatar
  getAuteurAvatar(message: Message): string {
    if (typeof message.auteur.user_id === 'object' && message.auteur.user_id !== null && message.auteur.user_id.photo) {
      // Préfixer avec l'URL du backend si ce sont des chemins relatifs et non des URL complètes
      // return `http://localhost:3000${message.auteur.user_id.photo}`;
      return message.auteur.user_id.photo; // Si c'est déjà une URL complète ou géré par un proxy
    }
    return 'assets/avatar.png'; // Image par défaut
  }
}