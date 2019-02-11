import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ChatroomService } from './../../services/chatroom.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public toggler : Boolean

  

  constructor(private chatroomService: ChatroomService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((res) => {
     
    })
   }

   

  ngOnInit() {
    this.toggler = this.chatroomService.toggleActiveUsers
  }

}
