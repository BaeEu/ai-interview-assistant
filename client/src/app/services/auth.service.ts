import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    login(username: string, password: string) {

        if (
            username === 'admin' &&
            password === '1234'
        ) {

            localStorage.setItem('isLoggedIn', 'true');

            return true;
        }

        return false;
    }

    logout() {
        localStorage.removeItem('isLoggedIn');
    }

    isAuthenticated(): boolean {

        return localStorage.getItem('isLoggedIn')
            === 'true';
    }
}