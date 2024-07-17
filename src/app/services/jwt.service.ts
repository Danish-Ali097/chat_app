import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  getMongoId(token: string): string | null {
    const decodedToken = this.decodeToken(token);
    if (decodedToken && decodedToken.mongo_user) {
      return decodedToken.mongo_user;
    }
    return null;
  }
  getExpirationDate(token: string): Date | null {
    const decodedToken = this.decodeToken(token);
    if (decodedToken && decodedToken.exp) {
      const date = new Date(0);
      date.setUTCSeconds(decodedToken.exp);
      return date;
    }
    return null;
  }

  isTokenExpired(token: string): boolean {
    const expirationDate = this.getExpirationDate(token);
    return expirationDate ? expirationDate < new Date() : true;
  }
}
