import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class MessageService {
    private apiUrl = `${environment.apiUrl}/message`;

    constructor(
        private http: HttpClient
    ) { }

    saveMessage(data: any) {

        return this.http.post(
            this.apiUrl,
            data
        );
    }

    getMessages(sessionId: number) {
        return this.http.get(
            `${this.apiUrl}/${sessionId}`
        );
    }

    clearMessages(sessionId: number) {
        return this.http.delete(`${this.apiUrl}/session/${sessionId}`);
    }
}