import { Component, OnInit } from '@angular/core';
import { ChatroomService } from './../../../../services/chatroom.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from "../../../../interfaces/user";
import { AuthService } from "../../../../services/auth.service";
import * as Rx from "rxjs";

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.scss']
})
export class ChatroomListComponent implements OnInit {
  public currentUser: any = null;
 public data:any = new Rx.Subject()
 public privateChats:any



  constructor(
    private auth: AuthService,
    public chatroomService: ChatroomService,
    private db: AngularFirestore
  ) { }


  ngOnInit() {
   this.currentUser = this.auth.currentUserSnapshot

    this.getPrivateChatroom(this.currentUser.id).subscribe(chatrooms =>this.data.next(chatrooms))
    this.getPrivateChatroom2(this.currentUser.id).subscribe(chatrooms =>this.data.next([...this.privateChats, ...chatrooms]))
    this.data.subscribe((data) => {
      this.privateChats = data
      console.log("testing",data)
  });
  }

  public getPrivateChatroom(userId) {
    const ratingRef = this.db.collection("privatechatrooms", ref =>
      ref.where( "user2", "==", userId)
    );
    return ratingRef.valueChanges();
  }
  public getPrivateChatroom2(userId) {
    const ratingRef = this.db.collection("privatechatrooms", ref =>
      ref.where( "user1", "==", userId)
    );
    return ratingRef.valueChanges();
  }
}
