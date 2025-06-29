import { Component, OnInit } from '@angular/core';
import {Log, LogService} from "../services/log.service";
import {User} from "../models/user.model";

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.css']
})
export class LogListComponent implements OnInit {

  logs: Log[] = [];
  page = 1;
  limit = 20;
  userFilter = '';
  actionFilter = '';

  constructor(private logService: LogService) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    const filters = {
      user_id: this.userFilter,
      action: this.actionFilter
    };
    this.logService.getAllLogs(this.page, this.limit, filters).subscribe(res => {
      this.logs = res;
    });

  }

  isUserObject(user: string | { email?: string }): user is { email: string } {
    return user != null && typeof user === 'object' && 'email' in user;
  }


  nextPage() {
    this.page++;
    this.loadLogs();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadLogs();
    }
  }

}
