import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-user-cours',
  templateUrl: './user-cours.component.html',
  styleUrls: ['./user-cours.component.css']
})
export class UserCoursComponent implements OnInit {
  @Input() userId!: string;
  cours: any[] = [];

  constructor(
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.userService.getUserCourses(this.userId).subscribe({
      next: (data) => this.cours = data,
      error: (err) => console.error(err)
    });
  }

  removeCourse(ue_code: string) {
    if (!confirm('Retirer cette UE ?')) return;

    this.userService.removeUserCourse(this.userId, ue_code).subscribe({
      next: () => {
        this.cours = this.cours.filter(c => c.ue_code !== ue_code);
      },
      error: (err) => console.error(err)
    });
  }
}
