import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Observable ,  Subscription } from 'rxjs';
import { ChatroomService } from './../../../../services/chatroom.service';
import { LoadingService } from './../../../../servies/loading.service';

@Component({
  selector: 'app-chatroom-window',
  templateUrl: './chatroom-window.component.html',
  styleUrls: ['./chatroom-window.component.scss']
})
export class ChatroomWindowComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('scrollContainer') private scrollContainer: ElementRef;

  private subscriptions: Subscription[] = [];
  public chatroom: Observable<any>;
  public messages: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private chatroomService: ChatroomService,
    private loadingService: LoadingService
  ) {
    this.subscriptions.push(
      this.chatroomService.selectedChatroom.subscribe(chatroom => {

        this.chatroom = chatroom;
      })
    );

    this.subscriptions.push(
      this.chatroomService.selectedChatroomMessages.subscribe(messages => {
        this.messages = messages;
      })
    );
  }

  ngOnInit() {
    this.scrollToBottom();

    
      this.route.paramMap.subscribe(params => {
        const chatroomId = params.get('chatroomId');
        let chatRoom = {
          id: chatroomId,
          type: ''
        };
        this.route.queryParams.subscribe((res) => {
          chatRoom.type = res.type;
          this.chatroomService.changeChatroom.next(chatRoom);
        })
      })
   

  
    

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

}
