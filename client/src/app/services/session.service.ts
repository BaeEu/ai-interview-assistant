import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = `${environment.apiUrl}/session`;

  constructor(
    private http: HttpClient
  ) { }

  createSession(user_id: number, category: string) {
    return this.http.post(
      this.apiUrl, { user_id: user_id, category }
    );
  }

  getUserSessions(user_id: number) {
    return this.http.get(`${this.apiUrl}/user/${user_id}`);
  }

  deleteSession(sessionId: number) {
    return this.http.delete(`${this.apiUrl}/${sessionId}`);
  }

  updateSession(sessionId: number, category: string) {
    return this.http.put(`${this.apiUrl}/${sessionId}`, { category });
  }
}
