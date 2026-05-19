import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai.service';
import { Message } from '../../models/message.model';
import { marked } from 'marked';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

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
  loading = false;
  errorMessage = '';

  @ViewChild('chatBox')
  chatBox!: ElementRef;

  constructor(private aiService: AiService, private authService: AuthService,
    private router: Router, public themeService: ThemeService) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {

      this.router.navigate(['/login']);
    }
    this.loadMessages();
  }

  logout() {
    this.authService.logout();

    this.router.navigate(['/login']);
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

  saveMessages() {

    localStorage.setItem(
      'chat_messages',
      JSON.stringify(this.messages)
    );
  }

  loadMessages() {

    const savedMessages =
      localStorage.getItem('chat_messages');

    if (savedMessages) {

      this.messages = JSON.parse(savedMessages);
    }
  }

  clearChat() {

    this.messages = [];

    localStorage.removeItem('chat_messages');
  }

  sendMessage() {

    if (!this.userMessage.trim()) {
      return;
    }

    const userText =
      `${this.selectedCategory} interview question: ${this.userMessage}`;

    this.messages.push({
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString()
    });

    this.saveMessages();

    this.userMessage = '';

    this.loading = true;

    this.scrollToBottom();

    this.aiService.sendMessage(userText)
      .subscribe({

        next: (response) => {

          this.messages.push({
            sender: 'ai',
            text: response.reply,
            time: new Date().toLocaleTimeString()
          });

          this.saveMessages();

          this.loading = false;

          this.scrollToBottom();
        },

        error: (error) => {

          console.log(error);

          this.errorMessage =
            'Something went wrong. Please try again.';

          this.loading = false;
        }
      });
  }

  autoResize(textarea: HTMLTextAreaElement) {

    textarea.style.height = 'auto';

    textarea.style.height =
      textarea.scrollHeight + 'px';
  }

  copyMessage(text: string) {

    navigator.clipboard.writeText(text);
  }
}
