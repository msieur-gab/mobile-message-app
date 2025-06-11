import { eventBus, EVENTS } from '../utils/events.js';

class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.timeInterval = null;
    }

    connectedCallback() {
        this.render();
        this.setupEvents();
        
        this.updateTime = this.updateTime.bind(this);
        this.updateTime();
        this.timeInterval = setInterval(this.updateTime, 1000);
    }

    disconnectedCallback() {
        clearInterval(this.timeInterval);
    }

    updateTime() {
        const timeEl = this.shadowRoot.getElementById('time-card-content');
        if (timeEl) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            timeEl.textContent = timeString;
        }
    }

    setupEvents() {
        const settings = this.shadowRoot.querySelector('.settings');
        if (settings) {
            settings.addEventListener('click', () => {
                eventBus.emit(EVENTS.SETTINGS_TOGGLE);
            });
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--container-color);
                    padding: 1rem;
                    border-bottom: 1px solid var(--color-border);
                }

                .top-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }
                .title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--color-text-dark);
                }
                .settings {
                    background: none; border: none; cursor: pointer;
                    padding: 8px; border-radius: 50%;
                    transition: background-color 0.2s;
                }
                .settings:hover { background-color: #f0f0f0; }
                .settings svg { width: 24px; height: 24px; color: #555; }

                .carousel-container {
                    display: flex;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    gap: 1rem;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .carousel-container::-webkit-scrollbar {
                    display: none;
                }
                .card {
                    flex: 0 0 calc(50% - 0.5rem);
                    scroll-snap-align: start;
                    box-sizing: border-box;
                    background: #1f2937;
                    color: #ffffff;
                    border-radius: 12px;
                    padding: 1rem;
                    height: 200px; /* Increased height slightly for graphs */
                    display: flex;
                    flex-direction: column;
                }
                .card-title {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color:rgb(182, 182, 182);
                    margin-bottom: 0.5rem; /* Add space below title */
                }
                .card-content {
                    flex: 1; /* Allow content to fill space */
                    font-size: 1.75rem;
                    font-weight: 700;
                    text-align: right;
                    display: flex;
                    align-items: flex-end;
                    justify-content: flex-end;
                }
                #time-card-content {
                    font-family: "SF Mono", "Consolas", "Menlo", monospace;
                }

                /* --- Styles for Vertical Bar Graph --- */
                .graph-container {
                    flex: 1;
                    display: flex;
                    align-items: flex-end; /* Makes bars grow from the bottom */
                    justify-content: space-between;
                    gap: 5px;
                }
                .bar {
                    background-color:rgb(255, 255, 255); /* Indigo color for contrast */
                    width: 4%;
                    border-radius: 4px;
                    animation: grow 1s ease-out;
                }

                /* --- Styles for Horizontal Bar Graph --- */
                .h-graph-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 6px;
                }
                .h-bar-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .h-bar-label {
                    font-size: 0.75rem;
                    color:rgb(255, 255, 255);
                    width: 50px; /* Fixed width for labels */
                    text-align: right;
                }
                .h-bar-wrapper {
                    flex: 1;
                    background-color: rgba(255, 255, 255, 0.5);
                    border-radius: 4px;
                    height: 6px;
                }
                .h-bar {
                    background-color: #fff; /* Green color for contrast */
                    height: 100%;
                    border-radius: 4px;
                    animation: slide 1s ease-out;
                }
                
                /* --- Animations for Graphs --- */
                @keyframes grow {
                    from { height: 0%; }
                }
                @keyframes slide {
                    from { width: 0%; }
                }

            </style>
            
            <div class="top-bar">
                <h2 class="title">Quick Messages</h2>
                <button class="settings">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                </button>
            </div>

            <div class="carousel-container">
                <div class="card">
                    <span class="card-title">Current Time</span>
                    <div class="card-content">
                        <span id="time-card-content">--:--</span>
                    </div>
                </div>

                <div class="card">
                    <span class="card-title">Past 7 Days</span>
                    <div class="graph-container">
                        <div class="bar" style="height: 60%;"></div>
                        <div class="bar" style="height: 80%;"></div>
                        <div class="bar" style="height: 40%;"></div>
                        <div class="bar" style="height: 50%;"></div>
                        <div class="bar" style="height: 90%;"></div>
                        <div class="bar" style="height: 70%;"></div>
                        <div class="bar" style="height: 100%;"></div>
                    </div>
                </div>

                <div class="card">
                    <span class="card-title">Most used category</span>
                    <div class="h-graph-container">
                        <div class="h-bar-group">
                            <span class="h-bar-label">Greetings</span>
                            <div class="h-bar-wrapper"><div class="h-bar" style="width: 90%;"></div></div>
                        </div>
                        <div class="h-bar-group">
                            <span class="h-bar-label">Affection</span>
                            <div class="h-bar-wrapper"><div class="h-bar" style="width: 60%;"></div></div>
                        </div>
                        <div class="h-bar-group">
                            <span class="h-bar-label">School</span>
                            <div class="h-bar-wrapper"><div class="h-bar" style="width: 45%;"></div></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('app-header', AppHeader);