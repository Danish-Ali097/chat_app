import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IChat } from '../app.types';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chats: BehaviorSubject<IChat[]>;

  chats$: Observable<IChat[]>;

  constructor(
    private httpService: HttpService
  ) { 
    this.chats = new BehaviorSubject<IChat[]>([]);
    this.chats$ = this.chats.asObservable();
  }

  getChats(): Observable<any> {
    return this.httpService.get('/api/Message/GetConversations', "bearer").pipe(
      map(c => {
        if(c.code == 200){
          this.chats.next(c.data);
        }
      })
    );
  }
}
