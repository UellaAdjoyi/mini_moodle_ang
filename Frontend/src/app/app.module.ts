import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CatalogueComponent } from './catalogue/catalogue.component';
import { UeListComponent } from './ue-list/ue-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { UeCardComponent } from './ue-card/ue-card.component';
import { UeModalComponent } from './ue-modal/ue-modal.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { MesCoursComponent } from './mes-cours/mes-cours.component';
import {NgOptimizedImage} from "@angular/common";
import { CreatePostComponent } from './create-post/create-post.component';
import { ForumComponent } from './forum/forum.component';
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from './utils/confirm-dialog/confirm-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { ProfilComponent } from './profil/profil.component';
import { PostComponent } from './prof/post/post.component';
import { PageUeComponent } from './prof/page-ue/page-ue.component';
import { UserCoursComponent } from './user-cours/user-cours.component';
import { AssignUeModalComponent } from './assign-ue-modal/assign-ue-modal.component';
import { UeDetailsComponent } from './ue-details/ue-details.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ProfDashboardComponent } from './prof-dashboard/prof-dashboard.component';
import { ListPostEtuComponent } from './etudiant/list-post-etu/list-post-etu.component';
import { PostListComponent } from './prof/post-list/post-list.component';
import { ShowPostComponent } from './prof/show-post/show-post.component';
import { UePageComponent } from './ue-page/ue-page.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LogListComponent } from './log-list/log-list.component';
import { EtudiantPostComponent } from './etudiant/etudiant-post/etudiant-post.component';
import { ForumDetailsComponent } from './forum-details/forum-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    HomeComponent,
    CatalogueComponent,
    UeListComponent,
    UserListComponent,
    UeCardComponent,
    UeModalComponent,
    UserModalComponent,
    MesCoursComponent,
    CreatePostComponent,
    ForumComponent,
    ConfirmDialogComponent,
    ProfilComponent,
    PageUeComponent,
    UserCoursComponent,
    AssignUeModalComponent,
    UeDetailsComponent,
    AdminDashboardComponent,
    ProfDashboardComponent,
    PostListComponent,
    ShowPostComponent,
    UePageComponent,
    ForgotPasswordComponent,
    ListPostEtuComponent,
    PostComponent,
    LogListComponent,
    EtudiantPostComponent,
    ForumDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgOptimizedImage,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  providers: [
    HttpClientModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
