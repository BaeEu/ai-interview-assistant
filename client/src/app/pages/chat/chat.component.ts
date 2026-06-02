import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai.service';
import { Message } from '../../models/message.model';
import { marked } from 'marked';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { SessionService } from '../../services/session.service';
import { MessageService } from '../../services/message.service';
import { CategoryService } from '../../services/category.service';
import { SessionStateService } from '../../services/session-state.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  userMessage = '';
  selectedCategory = 'Angular';
  messages: Message[] = [];
  categories: any[] = [];
  loading = false;
  errorMessage = '';
  currentSessionId: number | null = null;
  userId: number = 0;

  @ViewChild('chatBox')
  chatBox!: ElementRef;

  constructor(private aiService: AiService, private authService: AuthService,
    private router: Router, public themeService: ThemeService, private sessionService: SessionService,
    private messageService: MessageService, private categoryService: CategoryService, private sessionStateService: SessionStateService) {
    this.userId = this.authService.getUserId() || 0;
    if (!this.userId) {
      console.log('User not found');
      return;
    }
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.loadCategories();
    // this.loadMessages();
    this.sessionStateService.selectedSession$
      .subscribe((session: any) => {
        if (session) {
          this.currentSessionId = session.session_id;
          this.selectedCategory = session.category;
          this.loadMessagesBySession(
            session.session_id
          );
        }
      });
  }


  loadCategories() {

    this.categoryService.getCategories()
      .subscribe({
        next: (response: any) => {
          this.categories = response.categories;
          if (this.categories.length > 0) {
            this.selectedCategory =
              this.categories[0]
                .name;
          }
        },

        error: (error) => {
          console.log(error);
        }
      });
  }

  createNewSession() {
    this.sessionService.createSession(this.userId, this.selectedCategory)
      .subscribe({
        next: (response: any) => {

          this.currentSessionId =
            response.session_id;

          console.log(
            'Session Created:',
            this.currentSessionId
          );
        },

        error: (error) => {

          console.log(error);
        }
      });
  }

  formatMessage(text: string) {
    return marked(text);
  }

  handleEnter(event: any) {

    if (event.shiftKey) {
      return;
    }
    event.preventDefault();

    this.sendMessage();
  }

  scrollToBottom() {

    setTimeout(() => {

      this.chatBox.nativeElement.scrollTop =
        this.chatBox.nativeElement.scrollHeight;

    }, 100);
  }

  clearChat() {
    if (!this.currentSessionId) {
      this.messages = [];
      return;
    }

    this.messageService.clearMessages(this.currentSessionId).subscribe({
      next: () => {
        this.messages = [];
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  sendMessage() {

    if (!this.userMessage.trim()) {
      return;
    }

    const processMessage = () => {

      const userText = `${this.selectedCategory} interview question:${this.userMessage}`;

      this.messages.push({ sender: 'user', text: userText, time: new Date().toLocaleTimeString() });

      this.loading = true;

      this.scrollToBottom();

      this.messageService.saveMessage({
        session_id: this.currentSessionId,
        sender: 'user',
        message: userText
      })

        .subscribe();

      const originalMessage = this.userMessage;

      this.userMessage = '';

      this.aiService.sendMessage(userText).subscribe({
        next: (response) => {
          this.messages.push({ sender: 'ai', text: response.reply, time: new Date().toLocaleTimeString() });

          this.messageService.saveMessage({ session_id: this.currentSessionId, sender: 'ai', message: response.reply }).subscribe();

          this.loading = false;

          this.scrollToBottom();
        },

        error: (error) => {

          console.log(error);

          this.errorMessage = 'Something went wrong';

          this.loading = false;
        }
      });
    };

    if (!this.currentSessionId) {
      this.sessionService.createSession(this.userId, this.selectedCategory).subscribe({
        next: (response: any) => {
          this.currentSessionId = response.session_id;
          processMessage();
        },
        error: (error) => {

          console.log(error);
        }
      });
    }
    else {

      processMessage();
    }
  }

  autoResize(textarea: HTMLTextAreaElement) {

    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  copyMessage(text: string) {
    navigator.clipboard.writeText(text);
  }

  loadMessagesBySession(sessionId: number) {

    this.messageService.getMessages(sessionId)

      .subscribe({

        next: (response: any) => {
          this.messages = response.map(
            (msg: any) => ({

              sender: msg.sender,

              text: msg.message,

              time: new Date(
                msg.created_at
              ).toLocaleTimeString()

            })
          );

          this.scrollToBottom();

        },
        error: (error) => {
          console.log(error);
        }

      });

  }
}
