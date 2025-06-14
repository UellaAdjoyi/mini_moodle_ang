import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../models/user.model";
import {Ue} from "../models/ue.model";
import {UserService} from "../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmDialogComponent} from "../utils/confirm-dialog/confirm-dialog.component";
import {UeService} from "../services/ue.service";



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

  users: User[] = [];
  selectedUe: string = '';
  selectedRole: string = 'participant';

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ueService: UeService,
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



  removeUeFromUser(ueId: string) {
    if (this.user) {
      this.remove.emit({userId: this.user._id, ueId});
    }
  }

  onClose() {
    this.close.emit();
  }
}
