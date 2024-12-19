import { getSetting } from './core/utils.js';
import { AnkiConnect } from './comm/ankiconnect.js';

const anki = new AnkiConnect()

document.addEventListener('DOMContentLoaded', () => {
    //console.log("DOM fully loaded");

    // Apply theme
    getSetting('theme').then(theme => {
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
        }
    })
    .catch(err => console.error('Error loading theme:', err)); //Logging doesn't seem to work, more of a hope

    // Settings Button
    const settingsButton = document.getElementById('goToSettings');
    settingsButton.addEventListener('click', () => {
        browser.runtime.openOptionsPage();
    });

    // Anki Status
    const ankiStatusElement = document.getElementById('ankiStatus');
    const text = ankiStatusElement.textContent.trim();
    
    
    // Call isConnected and handle the Promise
    anki.isConnected()
    .then(isConnected => {
        console.log("Anki connected = " + isConnected);
        if (isConnected) {
            ankiStatusElement.textContent = "Anki is connected!";
        } else {
            ankiStatusElement.textContent = "Anki is not connected!";
        }
    })
    .catch(error => {
        console.error('Failed to check Anki connection:', error);
        ankiStatusElement.textContent = "Error checking Anki connection!";
    });

    
    
});

