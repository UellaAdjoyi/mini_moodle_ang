import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Ue} from "../models/ue.model";
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ue-card',
  templateUrl: './ue-card.component.html',
  styleUrls: ['./ue-card.component.css']
})
export class UeCardComponent implements OnInit {

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  @Input() ue!: Ue;
  @Input() role!: string;
  @Output() openDetails = new EventEmitter<Ue>();

  onOpenDetails() {
    this.openDetails.emit(this.ue);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/ue.png'; // image par défaut
  }

  createLog(){
    const userId = this.authService.getCurrentUserId()?? '';
      const formLog = new FormData();
      formLog.append('user_id', userId);
      formLog.append('action', 'consultation_ue');
      formLog.append('cible_type', 'UE');
      formLog.append('cible_details',this.ue.code );


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
  }
}
