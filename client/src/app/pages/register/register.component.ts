import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  username = '';

  password = '';

  error = '';

  constructor(private authService: AuthService, private router: Router, public themeService: ThemeService) { }

  register() {
    this.authService.register({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          this.authService.saveToken(res.token);

          this.authService.setCurrentUser(res.user);

          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.error.message;
        }
      });
  }
}
