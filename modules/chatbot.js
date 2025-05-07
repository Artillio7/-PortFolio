import { config } from './config.js';
import { API } from './api.js';

export class ChatBot {
    constructor() {
        this.api = new API();
        this.initialize();
    }

    initialize() {
        this.createChatbotUI();
        this.setupEventListeners();
    }

    createChatbotUI() {
        const chatbotContainer = document.createElement('div');
        chatbotContainer.className = 'chatbot-container';
        chatbotContainer.innerHTML = `
            <div class="chatbot-header">
                <h3>${config.botName}</h3>
                <button class="chatbot-close">×</button>
            </div>
            <div class="chatbot-messages"></div>
            <div class="chatbot-input-container">
                <input type="text" class="chatbot-input" placeholder="Posez votre question...">
                <button class="chatbot-send"><i class="fas fa-paper-plane"></i></button>
            </div>
        `;
        document.body.appendChild(chatbotContainer);

        // Ajout du bouton d'ouverture
        const openButton = document.createElement('button');
        openButton.className = 'chatbot-open';
        openButton.innerHTML = '<i class="fas fa-comment-dots"></i>';
        document.body.appendChild(openButton);
    }

    setupEventListeners() {
        const chatbotContainer = document.querySelector('.chatbot-container');
        const chatbotOpen = document.querySelector('.chatbot-open');
        const chatbotClose = document.querySelector('.chatbot-close');
        const chatbotInput = document.querySelector('.chatbot-input');
        const chatbotSend = document.querySelector('.chatbot-send');

        chatbotOpen.addEventListener('click', () => {
            chatbotContainer.style.display = 'block';
            chatbotOpen.style.display = 'none';
        });

        chatbotClose.addEventListener('click', () => {
            chatbotContainer.style.display = 'none';
            chatbotOpen.style.display = 'block';
        });

        chatbotSend.addEventListener('click', () => this.sendMessage(chatbotInput.value));
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage(chatbotInput.value);
        });
    }

    async sendMessage(message) {
        const input = document.querySelector('.chatbot-input');
        if (!message.trim()) return;

        this.addMessage(message, 'user');
        input.value = '';

        const response = await this.api.sendMessage(message);
        this.addMessage(response, 'bot');
    }

    addMessage(text, sender) {
        const messagesContainer = document.querySelector('.chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Ajout du message de bienvenue si le chat est vide
    checkWelcomeMessage() {
        const messagesContainer = document.querySelector('.chatbot-messages');
        if (messagesContainer.children.length === 0) {
            this.addMessage('Bonjour ! Je suis Artillio AI, l\'assistant personnel de Mr YEPMO. Comment puis-je vous aider aujourd\'hui ?', 'bot');
        }
    }
}
