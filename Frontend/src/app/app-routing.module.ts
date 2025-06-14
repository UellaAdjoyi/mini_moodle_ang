import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {CatalogueComponent} from "./catalogue/catalogue.component";
import {MesCoursComponent} from "./mes-cours/mes-cours.component";
import {CreatePostComponent} from "./create-post/create-post.component";
import {ForumComponent} from "./forum/forum.component";
import {ProfilComponent} from "./profil/profil.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {path: 'catalogue', component: CatalogueComponent},
  {path:'mesCours',component:MesCoursComponent},
  {path:'createPost',component: CreatePostComponent},
  {path: 'forum',component: ForumComponent},
  {path:'profil',component: ProfilComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
