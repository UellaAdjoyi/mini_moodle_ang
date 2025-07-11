import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from '@angular/router';
import { PostService } from '../services/post.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userRole: string | null = null;

  // Ajout des infos utilisateur
  user: { nom?: string; prenom?: string; photoUrl?: string } = {};

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router,
  
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  // loadUser() {
  //   const currentUser = this.authService.getCurrentUser();
  //
  //   this.userRole = currentUser?.role || null;
  //   this.user.nom = currentUser?.nom || '';
  //   this.user.prenom = currentUser?.prenom || '';
  //
  //   if (currentUser?.photo?.startsWith('data:image')) {
  //     this.user.photoUrl = currentUser.photo;
  //   } else if (currentUser?.photo?.startsWith('/uploads')) {
  //     this.user.photoUrl = `http://localhost:3000${currentUser.photo}`;
  //     console.log('Photo Utilisateur:', this.user.photoUrl);
  //
  //   } else {
  //     // Pas de photo
  //     this.user.photoUrl = '';
  //   }
  //
  //   console.log('User:', this.user);
  // }

  loadUser() {
    const currentUser = this.authService.getCurrentUser();
    // console.log('currentUser:', currentUser);

    this.userRole = currentUser?.role || null;
    this.user.nom = currentUser?.nom || '';
    this.user.prenom = currentUser?.prenom || '';

    //

    if (currentUser?.photo?.startsWith('data:image')) {
      //
      this.user.photoUrl = currentUser.photo;
    } else if (currentUser?.photo?.startsWith('/uploads')) {
      this.user.photoUrl = `http://localhost:3000${currentUser.photo}`;
    } else {
      this.user.photoUrl = '';
    }

  }


  logout() {
    const userId = this.authService.getCurrentUserId()?? '';
      const formLog = new FormData();
      formLog.append('user_id', userId);
      formLog.append('action', 'deconnexion');


      // Envoyer la requête de création du log
      this.postService.createLog(formLog).subscribe({
        next: logRes => {
          console.log('log créé', logRes);
          console.log('log terminé');
        },
        error: logErr => {
          console.error('Erreur création du log', logErr);
        }
      });
    this.authService.logout();

    this.router.navigate(['/']);
    this.userRole = null;
    this.user = {};

  }

}
