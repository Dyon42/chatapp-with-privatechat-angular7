import { Component, OnInit } from '@angular/core';
import { ChatroomService } from './../../../../services/chatroom.service';

import { AuthService } from "../../../../services/auth.service";
import { User } from "../../../../interfaces/user";

@Component({
  selector: 'app-chat-activeusers',
  templateUrl: './chat-activeusers.component.html',
  styleUrls: ['./chat-activeusers.component.scss']
})
export class ChatActiveusersComponent implements OnInit {
  
  public user: User;

  constructor(
    public chatroomService: ChatroomService,
    private auth: AuthService,
   ) { }

  ngOnInit() {
     
  }


}
