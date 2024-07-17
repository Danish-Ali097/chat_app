import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpService: HttpService, private router:Router) 
  {
    const _storedUser = localStorage.getItem('user') ?? "";
    if(_storedUser?.length > 0){
      var user = JSON.parse(_storedUser);
      if (user) {
        this.isLoggedInSubject.next(true);
      } else {
        this.isLoggedInSubject.next(false);
      }
    } else {
      this.isLoggedInSubject.next(false);
    }
  }
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  login(body:object): Observable<any> {
    return this.httpService.post('/api/User/Login',"basic", "json", body)
    .pipe(map(p => {
      console.log(p);
      if(p.code == 200) {
        localStorage.setItem('token',p.data.token);
        localStorage.setItem('user',JSON.stringify(p.data));
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/dashboard']);
      }
    }));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/dashboard']);
  }
}
