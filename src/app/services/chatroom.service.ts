import { User } from './../interfaces/user';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { LoadingService } from './../servies/loading.service';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map'

@Injectable()
export class ChatroomService {

  public chatrooms: Observable<any>;
  public activeUsers: Observable<any>;
  public changeChatroom: BehaviorSubject<any | null> = new BehaviorSubject(null);
  public selectedChatroom: Observable<any>;
  public selectedChatroomMessages: Observable<any>;
  public toggleActiveUsers: Boolean = false;
  public currentUser: any = null;
  public tester: any

  constructor(
    private db: AngularFirestore,
    private loadingService: LoadingService,
    private authService: AuthService,
    private auth: AuthService
  ) {
    this.auth.currentUser.subscribe(user => {
      this.currentUser = user
    })



    this.selectedChatroom = this.changeChatroom.switchMap(chatRoom => {


      if (chatRoom) {
        if (chatRoom.type === 'PRIVATE') {
          console.log("ffffffffff", chatRoom.id)
          return db.doc(`privatechatrooms/${chatRoom.id}`).valueChanges()
        }


        if (chatRoom.type === 'NEW') {
          const type = 'PRIVATE';
          const id = `${chatRoom.id}_${this.currentUser.id}`;
          const user1 = chatRoom.id;
          const user2 = this.currentUser.id;
          const userName2 = this.currentUser.firstName;

          db.doc(`users/${user1}`).valueChanges().subscribe(userName1 => {
            const rating: any = { id, user1, user2, type, userName2, userName1 };
            db.collection(`privatechatrooms`).valueChanges().subscribe(item => {
              this.tester = item
              let test = this.tester.filter((item) => item.user1 === user1 && item.user2 === user2 || item.user2 === user1 && item.user1 === user2);
              if (test.length === 0 && user1 != user2) {
                this.db.doc(`privatechatrooms/${user1}_${user2}`)
                  .set(rating)
              }
            })
          })
          console.log("terug", this.tester)

          return db.doc(`privatechatrooms/${user1}_${user2}`).valueChanges()
        }
        else {
          // alert('her');
          return db.doc(`chatrooms/${chatRoom.id}`).valueChanges();
        }
      }
      return Observable.of(null);
    });




    this.selectedChatroomMessages = this.changeChatroom.switchMap(chatRoom => {
      if (chatRoom.id) {
        if (chatRoom.type === 'PUBLIC') {
          return db.collection(`chatrooms/${chatRoom.id}/messages`, ref => {
            console.log("ref", ref)
            return ref.orderBy('createdAt', 'desc').limit(100);
          })
            .valueChanges()
            .map(arr =>
              arr.reverse());
        } else {
          return db.collection(`privatechatrooms/${chatRoom.id}/messages`, ref => {
            return ref.orderBy('createdAt', 'desc').limit(100);

          })
            .valueChanges()
            .map(arr =>
              arr.reverse());
        }
      }

      return Observable.of(null);
    });

    this.chatrooms = db.collection('chatrooms').valueChanges();
    this.activeUsers = db.collection('activeuser').valueChanges();
  }

  public createMessage(text: string): void {

    const chatroomId = this.changeChatroom.value.id;
    console.log(chatroomId)
    const message = {
      message: text,
      createdAt: new Date(),
      sender: this.authService.currentUserSnapshot
    };
    if (chatroomId.length < 30) {
      this.db.collection(`chatrooms/${chatroomId}/messages`).add(message);
    }
    else { this.db.collection(`privatechatrooms/${chatroomId}/messages`).add(message); }


  }

  public closeActiveUsers() {
    this.toggleActiveUsers = !this.toggleActiveUsers
  }

}
