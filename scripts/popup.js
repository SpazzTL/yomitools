document.getElementById('goToSettings').addEventListener('click', function() {
    console.log("Opening Settings Page...");
    browser.runtime.openOptionsPage();
});
