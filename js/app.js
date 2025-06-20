import { eventBus, EVENTS } from './utils/events.js';
import { ProfileService } from './services/profiles.js';
import { MessageService } from './services/messages.js';

class QuickMessagesApp {
    constructor() {
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            console.log('Initializing Quick Messages App...');
            
            await this.initializeServices();
            this.setupGlobalEventListeners();
            
            this.isInitialized = true;
            eventBus.emit(EVENTS.APP_READY);
            console.log('Quick Messages App initialized successfully!');
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize the application. Please refresh the page.');
        }
    }

    async initializeServices() {
        await ProfileService.initialize();
        await MessageService.initialize();
    }

    setupGlobalEventListeners() {
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        eventBus.on(EVENTS.APP_READY, () => console.log('App is ready!'));
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    handleKeyboard(event) {
        if (event.key === 'Escape') {
            const settingsPanel = document.querySelector('settings-panel');
            if (settingsPanel && settingsPanel.isOpen) {
                settingsPanel.close();
            }
        }
    }

    handleGlobalError(event) {
        console.error('Global error:', event.error);
        this.showError('An unexpected error occurred.');
    }

    handleUnhandledRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        this.showError('An unexpected error occurred.');
    }

    showError(message) {
        const existingError = document.querySelector('.global-error');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'global-error';
        errorDiv.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background-color: var(--danger-color); color: white; padding: 1rem 2rem;
            border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => { if (errorDiv.parentElement) errorDiv.remove() }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const app = new QuickMessagesApp();
    await app.init();
});

window.QuickMessagesApp = QuickMessagesApp;