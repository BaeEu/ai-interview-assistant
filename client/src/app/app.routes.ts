import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [

    {
        path: '',
        component: ChatComponent
    },

    {
        path: 'login',
        component: LoginComponent
    }
];
