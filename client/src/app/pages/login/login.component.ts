import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  username = '';

  password = '';

  error = '';

  constructor(
    private authService: AuthService, private router: Router, public themeService: ThemeService
  ) { }

  login() {

    const success =
      this.authService.login(
        this.username,
        this.password
      );

    if (success) {

      this.router.navigate(['/']);

    } else {

      this.error = 'Invalid credentials';
    }
  }
}