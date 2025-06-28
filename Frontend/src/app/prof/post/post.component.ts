import {Component, Input, OnChanges, OnInit,SimpleChanges} from '@angular/core';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit,OnChanges {

  @Input() post: any;
  @Input() isProf: boolean = false;

  ngOnInit() {
    console.log('app-post ngOnInit, post:', this.post);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['post']) {
      console.log('app-post ngOnChanges, post changed:', this.post);
    }
  }

  isFichierOrDevoir(): boolean {
    if (!this.post || !this.post.type_post) return false;
    const result = ['fichier', 'devoir'].includes(this.post.type_post.trim().toLowerCase());
    console.log(`isFichierOrDevoir for type_post "${this.post.type_post}":`, result);
    return result;
  }


}
