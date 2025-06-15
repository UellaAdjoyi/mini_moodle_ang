import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../models/user.model";
import {UserService} from "../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UeService} from "../services/ue.service";
import {ConfirmDialogComponent} from "../utils/confirm-dialog/confirm-dialog.component";



@Component({
  selector: 'app-assign-ue-modal',
  templateUrl: './assign-ue-modal.component.html',
  styleUrls: ['./assign-ue-modal.component.css']
})
export class AssignUeModalComponent implements OnInit {
  @Input() user: any;
  @Input() ues: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() assign = new EventEmitter<{ userId: string, ueId: string, role: string }>();
  @Output() remove = new EventEmitter<{ userId: string; ueId: string }>();

  confirmingUeId: string | null = null;
  selectedUe: string = '';
  selectedRole: string = 'participant';
  availableRoles: string[] = [];


  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void{
  }

  onAssign() {
    if (this.selectedUe && this.selectedRole) {
      this.assign.emit({
        userId: this.user._id,
        ueId: this.selectedUe,
        role: this.selectedRole
      });
      this.onClose();
    }
  }

  ngOnChanges() {
    // Dès que la modal s'ouvre et que le user est défini
    if (this.user) {
      if (this.user.role.includes('ROLE_ETUDIANT')) {
        this.availableRoles = ['participant'];  // étudiant ne peut être que participant
        this.selectedRole = 'participant'; // forcer sélection par défaut
      } else if (this.user.role.includes('ROLE_PROF')) {
        this.availableRoles = ['enseignant'];  // prof ne peut être que enseignant
        this.selectedRole = 'enseignant';
      } else {
        // Cas général ou autres rôles
        this.availableRoles = ['participant', 'enseignant'];
      }
    }
  }

  removeUeFromUser(ueId: string) {
    this.confirmingUeId = ueId;
  }

  onClose() {
    this.close.emit();
  }

  confirmRemove(ueId: string) {
    this.remove.emit({ userId: this.user._id, ueId });
    this.confirmingUeId = null;
  }

  cancelConfirm() {
    this.confirmingUeId = null;
  }

}
