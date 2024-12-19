import { getSetting } from './core/utils.js';
import { setSetting } from './core/utils.js';
import { getAllUserSettings } from './core/utils.js';

document.addEventListener('DOMContentLoaded', () => {
   
    // console.log("Loaded Settings Script")

    // DOM Elements
    const darkModeSwitch = document.getElementById("dark-mode-switch");
    const ankiEnabledSwitch = document.getElementById("ankiconnect-enabled-switch")
    const settingsExportButton = document.getElementById("export-settings-button")
    const settingsImportButton = document.getElementById("import-settings-button")
// BUTTONS || LOCAL STORAGE

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
    //Export Settings as JSON
    settingsExportButton.addEventListener('click', () => {
        //Fetch Settings
        const settings = getAllUserSettings().then( settings => {
            console.log("Settings exported as ", settings)
        });
        
    });
    settingsImportButton.addEventListener('click', () => {

    });

// END BUTTONS

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




    

  
});