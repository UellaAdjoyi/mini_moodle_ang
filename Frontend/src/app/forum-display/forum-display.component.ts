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
export class ForumDisplayComponent implements OnInit {


  ngOnInit(): void {
  }
}
