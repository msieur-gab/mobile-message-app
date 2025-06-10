import { eventBus, EVENTS } from '../utils/events.js';

class FeedbackMessage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.timeoutId = null;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        eventBus.on(EVENTS.MESSAGE_COPIED, (data) => {
            this.showFeedback(data.copied, data.original);
        });
    }

    showFeedback(copiedText, originalText) {
        const messageEl = this.shadowRoot.getElementById('message');
        messageEl.innerHTML = `
            <div>${copiedText}</div>
            <div class="original-text">(${originalText})</div>
        `;

        this.classList.add('show');
        
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.classList.remove('show');
        }, 3000);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 100px;
                    left: 50%;
                    transform: translate(-50%, -100%);
                    background-color: var(--success-color);
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    z-index: 1000;
                    opacity: 0;
                    transition: opacity 0.5s, transform 0.5s;
                    pointer-events: none;
                    font-weight: 500;
                    text-align: center;
                    width: auto;
                    max-width: 90%;
                }

                :host(.show) {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }

                .original-text {
                    display: block;
                    font-size: 0.8em;
                    opacity: 0.8;
                    margin-top: 6px;
                }
            </style>
            
            <div id="message">Copied</div>
        `;
    }
}

customElements.define('feedback-message', FeedbackMessage);