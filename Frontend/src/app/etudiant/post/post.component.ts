import {Component, Input, OnChanges, OnInit,SimpleChanges,EventEmitter,Output} from '@angular/core';
import { Post } from 'src/app/models/post';
import {PostService} from "../../services/post.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  standalone: true,
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit,OnChanges {

}
