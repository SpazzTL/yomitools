document.addEventListener('DOMContentLoaded', () => {
    // console.log("Loaded Settings Script")
    // DOM Elements
    const darkModeSwitch = document.getElementById("dark-mode-switch");
  
     // --- Dark Mode Toggle ---
  darkModeSwitch.addEventListener('change', () => {
    // console.log("Click Event Found")
    if (darkModeSwitch.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        browser.storage.local.set({ theme: 'dark' });
    } else {
        document.documentElement.removeAttribute('data-theme');
        browser.storage.local.set({ theme: 'light' });
    }
    });

    // --- Set Dark Mode Toggle to Checked/UnChecked ---
    browser.storage.local.get(['theme'])
    .then(data => {
        //console.log("Theme found as:", data.theme);
        if (data.theme === 'dark') {
            darkModeSwitch.checked = true;
        } else {
            darkModeSwitch.checked = false;
        }
    })


});