import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) { }

  @Output()
  toggleSidebar =
    new EventEmitter<void>();

  toggleSidebarMenu() {

    this.toggleSidebar.emit();
  }

  logout() {

    this.authService.logoutAuth();
    this.router.navigate(['/login']);
  }

  toggleTheme() {

    this.themeService.toggleTheme();
  }

}