document.addEventListener('DOMContentLoaded', () => {
    // Fetch the theme from storage
    browser.storage.local.get(['theme'])
        .then(data => {
            // Apply the saved theme (dark or light)
            if (data.theme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
            } else {
                document.body.setAttribute('data-theme', 'light');
            }
        })
        .catch(err => console.error('Error loading theme:', err));

    // Go to settings button
    const goToSettingsBtn = document.getElementById('goToSettings');
    goToSettingsBtn.addEventListener('click', () => {
        browser.runtime.openOptionsPage();
    });
});
