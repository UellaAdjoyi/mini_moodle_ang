import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

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
    MesCoursComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
