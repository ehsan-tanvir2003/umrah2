import { Component, ChangeDetectionStrategy, output, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiAssistantComponent {
  close = output<void>();
  private aiService = inject(AiService);

  messages = signal<Message[]>([
    {
      sender: 'ai',
      text: "Hello! I'm FlowAI, your UmrahFlow assistant. How can I help you today? You can ask me things like:\n- How many customers are there in total?\n- List all packages and their prices.\n- Who has a payment due?"
    }
  ]);
  userInput = signal('');
  isLoading = signal(false);

  constructor() {
    afterNextRender(() => {
        this.scrollToBottom();
    });
  }

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  async sendMessage() {
    const prompt = this.userInput().trim();
    if (!prompt || this.isLoading()) {
      return;
    }

    // Add user message to chat
    this.messages.update(msgs => [...msgs, { sender: 'user', text: prompt }]);
    this.userInput.set('');
    this.isLoading.set(true);
    this.scrollToBottom();

    try {
      const aiResponse = await this.aiService.getAiResponse(prompt);
      this.messages.update(msgs => [...msgs, { sender: 'ai', text: aiResponse }]);
    } catch (error) {
        this.messages.update(msgs => [...msgs, { sender: 'ai', text: 'Sorry, I ran into a problem. Please check the console for details.' }]);
    } finally {
        this.isLoading.set(false);
        this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
        const chatHistory = document.querySelector('.chat-history');
        if (chatHistory) {
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    }, 0);
  }
}
