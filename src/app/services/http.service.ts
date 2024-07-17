import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    console.log(JSON.stringify(environment));
    this.baseUrl = environment.baseUrl;
  }

  get(url: string, auth: 'basic' | 'bearer', body?: object, queryParam?: HttpParams): Observable<any> {
    const headers = this.generateHeaders(auth);
    const options = {
      headers,
      params: queryParam
    };
    return this.http.get(this.baseUrl + url, options);
  }

  post(url: string, auth: 'basic' | 'bearer', type: 'json' | 'multipart', body?: object, queryParam?: HttpParams): Observable<any> {
    const headers = this.generateHeaders(auth);

    // Handle Content-Type based on type parameter
    if (type === 'json') {
      headers.set('Content-Type', 'application/json');
    } else if (type === 'multipart') {
      // Adjust as per your multipart handling needs
      headers.set('Content-Type', 'multipart/form-data');
    }

    const options = {
      headers,
      params: queryParam
    };

    return this.http.post(this.baseUrl + url, body, options);
  }

  private generateHeaders(auth: 'basic' | 'bearer'): HttpHeaders {
    let headers = new HttpHeaders();

    switch (auth) {
      case 'basic':
        headers = headers.set('Authorization', 'Basic ' + btoa(environment.basicAuthUn + ":" + environment.basicAuthPass));
        break;
      case 'bearer':
        const token = localStorage.getItem('token');
        if (token) {
          headers = headers.set('Authorization', 'Bearer ' + token);
        }
        break;
      default:
        throw new Error("Wrong auth.");
    }

    return headers;
  }
}
