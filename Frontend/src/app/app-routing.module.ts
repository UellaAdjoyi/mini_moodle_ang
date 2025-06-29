import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {CatalogueComponent} from "./catalogue/catalogue.component";
import {MesCoursComponent} from "./mes-cours/mes-cours.component";
import {CreatePostComponent} from "./create-post/create-post.component";
import {ForumComponent} from "./forum/forum.component";
import {ProfilComponent} from "./profil/profil.component";
import {PostComponent} from "./prof/post/post.component";
import { PostListComponent } from './prof/post-list/post-list.component';
import { ListPostEtuComponent } from './etudiant/list-post-etu/list-post-etu.component';
import {PageUeComponent} from "./prof/page-ue/page-ue.component";
import {UeDetailsComponent} from "./ue-details/ue-details.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {ProfDashboardComponent} from "./prof-dashboard/prof-dashboard.component";
import { ShowPostComponent } from './prof/show-post/show-post.component';
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {LogListComponent} from "./log-list/log-list.component";
import {EtudiantPostComponent} from "./etudiant/etudiant-post/etudiant-post.component";

import { ShowDevoirComponent } from './prof/show-devoir/show-devoir.component';

import {ForumDetailsComponent} from "./forum-details/forum-details.component";


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {path: 'catalogue', component: CatalogueComponent},
  {path:'mesCours',component:MesCoursComponent},
  {path:'createPost/:codeUe/:nomUe',component: CreatePostComponent},
  {path:'profil',component: ProfilComponent},
  {path:'resetPassword',component: ForgotPasswordComponent},
  {
    path: 'post-etu/:code/:nom/:ue_id',
    component: EtudiantPostComponent,
    children: [
      { path: '',      redirectTo: 'post', pathMatch: 'full' },
      { path: 'post',  component: ListPostEtuComponent },
      { path: 'forum', component: ForumComponent },
      { path: 'forum/:forumId', component: ForumDetailsComponent }

    ]
  },
  {path:'post',component: PostComponent},
  {
    path: 'post-prof/:code/:nom/:ue_id',
    component: ShowPostComponent,
    children: [
      { path: '',redirectTo: 'post-all', pathMatch: 'full' },
      { path: 'post-all',component: PostListComponent },
      { path: 'forum-ue',component: ForumComponent },
      { path: 'participants-ue', component: ProfDashboardComponent },
      { path: 'forum-ue/:forumId', component: ForumDetailsComponent },

    ]
  },


  {path:'page-ue',component:PageUeComponent},
  {path:'ue/:id',component:UeDetailsComponent},
  {path:'dashboard',component:AdminDashboardComponent},
  {path:'participants',component:ProfDashboardComponent},
  {path:'logs',component:LogListComponent},
  {path:'showDevoir/:idPost/:codeUe',component:ShowDevoirComponent},

  { path: 'forum/:id', component: ForumDetailsComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
