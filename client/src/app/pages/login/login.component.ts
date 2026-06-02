import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  username = '';

  password = '';

  error = '';

  showPassword = false;

  constructor(
    private authService: AuthService, private router: Router, public themeService: ThemeService
  ) { }

  login(): void {

    this.authService.loginAuth({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          this.authService.saveToken(res.token);
          this.authService.setCurrentUser(res.user);
          this.router.navigate(['/chat']);
        },

        error: (err) => {

          this.error =
            err.error.message || 'Login failed';

        }
      });
  }
}