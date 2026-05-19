import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ThemeService {

    darkMode = false;

    constructor() {

        const savedTheme =
            localStorage.getItem('darkMode');

        this.darkMode = savedTheme === 'true';

        this.updateBodyClass();
    }

    toggleTheme() {

        this.darkMode = !this.darkMode;

        localStorage.setItem(
            'darkMode',
            String(this.darkMode)
        );

        this.updateBodyClass();
    }

    updateBodyClass() {

        if (this.darkMode) {

            document.body.classList.add('dark-mode');

        } else {

            document.body.classList.remove('dark-mode');
        }
    }
}