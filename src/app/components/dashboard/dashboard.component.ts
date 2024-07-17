import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import * as io from 'socket.io-client';
import { FormsModule } from '@angular/forms';
import { JwtService } from '../../services/jwt.service';
import { IChat, IMesage } from '../../app.types';
import { ChatService } from '../../services/chat.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer')
  private messagesContainer!: ElementRef;
  private socket!: io.Socket;
  selectedChat!: IChat;
  chats:IChat[] = [];
  newMessage!:IMesage;
  user:any;
  mongoId!: string;

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    const _storedUser = localStorage.getItem('user') ?? "";
    if(_storedUser?.length > 0)
    {
      this.user = JSON.parse(_storedUser);
      this.mongoId = jwtService.getMongoId(this.user.token) ?? "";
    }
  }
  ngOnInit(): void {
    this.socket = io.connect('http://localhost:3001', {
      query: {
        userId: this.mongoId
      }
    });

    if(this.socket != null) {
      this.chatService.getChats().subscribe();
      this.chatService.chats$.subscribe(r => {
        this.chats = r
      });
    }

    this.socket.on('user_details', (res) => {
      console.log("user_details", res);
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  addListenersToChats() {
    this.chats.forEach(chat => {
      this.socket.on(chat.id, this.chatCallback);
    });
  }

  chatCallback(chat: IChat) {
    console.log("chatCallback", chat);
    const from = chat.receipients?.filter(x => x != this.mongoId)[0];
    this.snackBar.open("new message from: "+from);
    const idx = this.chats.findIndex(x => x.id == chat.id);
    this.chats[idx] = chat;
  }

  selectChat(chat: IChat)
  {
    if(this.selectedChat && this.selectedChat.id.length > 0 && chat.id !== this.selectedChat.id)
    {
      // joining global listener
      this.socket.on(this.selectedChat.id, this.chatCallback);
      // leaving previously joined room.
      this.socket.emit('close_chat', this.selectedChat.id);
    }

    this.selectedChat = chat; // selecting new chat.

    // joining room.
    this.socket.emit('open_chat',this.selectedChat.id);

    // leaving global listener
    this.socket.off(this.selectedChat.id);

    this.socket.on('new_message', (res) => {
      console.log(res);
      this.selectedChat.messages?.push(res);
    });
  }

  sendMessage()
  {
    console.log(this.newMessage);
    const new_message = {
      chat_id: this.selectedChat.id,
      message: this.newMessage
    };
    this.socket.emit('send_message', new_message)
  }

  logout() {
    this.authService.logout();
  }
  private scrollToBottom(): void {
    try {
      if (this.messagesContainer && this.messagesContainer.nativeElement){
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll to bottom failed:', err);
    }
  }
}
