document.addEventListener('DOMContentLoaded', () => {
    //console.log("DOM fully loaded");

    // Apply theme
    browser.storage.local.get(['theme'])
        .then(data => {
            //console.log("Theme found as:", data.theme);
            if (data.theme === 'dark') {
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
    
    if (true){//AnkiConnectStatus Placeholder 
        ankiStatusElement.textContent = "Anki is not connected!";
    }
    else {
        ankiStatusElement.textContent = "Anki is connected!";
    }
 
});
