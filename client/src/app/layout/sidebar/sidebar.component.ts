import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { SessionService } from '../../services/session.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SessionStateService } from '../../services/session-state.service'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, NgClass, CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent implements OnInit {

  @Input()
  collapsed = false;
  userId: number = 0;
  sessions: any[] = [];

  constructor(public themeService: ThemeService, private sessionService: SessionService,
    private authService: AuthService, private sessionStateService: SessionStateService) {
    this.userId = this.authService.getUserId() || 0;
    if (!this.userId) {
      console.log('User not found');
      return;
    }
  }

  selectSession(session: any) {
    this.sessionStateService.setSession(session);
  }

  ngOnInit(): void {

    this.loadSessions();
  }

  loadSessions() {

    this.sessionService.getUserSessions(this.userId).subscribe({
      next: (response: any) => {
        this.sessions = response.sessions;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteSession(sessionId: number) {
    this.sessionService.deleteSession(sessionId).subscribe({
      next: () => {
        this.sessions =
          this.sessions.filter(s => s.session_id !== sessionId);
      },

      error: (error) => {
        console.log(error);
      }
    });
  }

  editSession(session: any) {

    const newCategory =
      prompt(
        'Enter new session name',
        session.category
      );

    if (!newCategory || newCategory.trim() === '') {
      return;
    }

    this.sessionService.updateSession(session.session_id, newCategory)
      .subscribe({

        next: () => {

          session.category =
            newCategory;

        },

        error: (error) => {

          console.log(error);

        }
      });
  }

}
