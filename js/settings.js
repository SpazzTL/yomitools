document.addEventListener('DOMContentLoaded', () => {
    // console.log("Loaded Settings Script")

    // DOM Elements
    const darkModeSwitch = document.getElementById("dark-mode-switch");
    const ankiEnabledSwitch = document.getElementById("ankiconnect-enabled-switch")
  
// BUTTONS || LOCAL STORAGE
//Store Settings here, as one Bulk Object
const settings = {
    ankiEnabled : 'true',
    theme : 'light'
}
    // --- Dark Mode Toggle ---
  darkModeSwitch.addEventListener('change', () => {
    // console.log("Click Event Found")
    if (darkModeSwitch.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        setSetting('theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        setSetting('theme', 'light');
    }
    });

    ankiEnabledSwitch.addEventListener('change', () => {
        if (ankiEnabledSwitch.checked){
            setSetting('ankiEnabled', 'true');
        } else {
            setSetting('ankiEnabled', 'false');
        }
        
    });

// --- Set Dark Mode Toggle to Checked/UnChecked --- || // Apply Theme as well
getSetting('theme').then(theme => {
    if (theme === 'dark') {
        darkModeSwitch.checked = true;
        document.body.setAttribute('data-theme', 'dark');
    } else {
        darkModeSwitch.checked = false;
        document.body.setAttribute('data-theme', 'light');
    }
});

    
    //Collapsible
    const collapsibles = document.querySelectorAll('.collapsible');

    collapsibles.forEach((button) => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            button.setAttribute('aria-expanded', !isExpanded);
            content.classList.toggle('active');
        });
    });




    // Functions 

    function getSetting(subSetting) {
        return browser.storage.local.get('userSettings').then(result => {
            const settings = result.userSettings || {}; // Safeguard if userSettings does not exist.
            return settings[subSetting] || null; // Return null if subSetting doesn't exist.
        });
    }
    
    function setSetting(subSetting, value) {
        return browser.storage.local.get('userSettings').then(result => {
            let settings = result.userSettings || {}; // Safeguard if userSettings doesn't exist
            settings[subSetting] = value; // Update the specific subsetting
            return browser.storage.local.set({ userSettings: settings }); // Save updated settings
        });
    }
    
});