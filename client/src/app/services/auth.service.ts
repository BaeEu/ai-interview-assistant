import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    currentUser: any = null;

    constructor(private http: HttpClient) {

        const user =
            localStorage.getItem('user');

        if (user) {

            this.currentUser =
                JSON.parse(user);
        }
    }

    register(data: any): Observable<any> {

        return this.http.post(`${environment.apiUrl}/auth/register`, data);
    }

    loginAuth(data: any): Observable<any> {

        return this.http.post(`${environment.apiUrl}/auth/login`, data);
    }

    saveToken(token: string): void {

        localStorage.setItem('token', token);
    }

    getToken(): string | null {

        return localStorage.getItem(
            'token'
        );
    }

    setCurrentUser(user: any): void {
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
    }

    getCurrentUser() {

        return this.currentUser;
    }

    getUserId(): number {
        return this.currentUser?.user_id;
    }

    logoutAuth(): void {

        localStorage.removeItem('token');

        localStorage.removeItem('user');

        this.currentUser = null;
    }

    isLoggedIn(): boolean {

        return !!localStorage.getItem(
            'token'
        );
    }
}