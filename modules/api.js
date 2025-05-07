import { config } from './config.js';

export class API {
    constructor() {
        this.apiKey = config.apiKey;
    }

    async sendMessage(message) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: config.systemPrompt },
                        { role: "user", content: message }
                    ],
                    max_tokens: config.maxTokens,
                    temperature: config.temperature
                })
            });
            if (!response.ok) {
                throw new Error('Erreur API OpenAI');
            }
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Erreur API:', error);
            return 'Une mise à jour est en cours. Veuillez réessayer plus tard ou laissez un message à Artillio via la zone de contact en bas de la page.';
        }
    }
}
