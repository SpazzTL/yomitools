//Exports useful functions

export function getSetting(subSetting) {
    return browser.storage.local.get('userSettings').then(result => {
        const settings = result.userSettings || {}; // Safeguard if userSettings does not exist.
        return settings[subSetting] || null; // Return null if subSetting doesn't exist.
    });
}

export function setSetting(subSetting, value) {
    return browser.storage.local.get('userSettings').then(result => {
        let settings = result.userSettings || {}; // Safeguard if userSettings doesn't exist
        settings[subSetting] = value; // Update the specific subsetting
        return browser.storage.local.set({ userSettings: settings }); // Save updated settings
    });
}

export function getAllUserSettings(){
    return browser.storage.local.get('userSettings').then(result => {
        const settings = result.userSettings || {};
        return settings
    });
}

/*/  
All user settings:
ankiEnabled : true/false
theme : light/dark
/*/


export async function setDefaultUserSettings() {
    // Retrieve userSettings from local storage
    const result = await browser.storage.local.get('userSettings');
    let settings = result.userSettings || {};  // Initialize settings if not already present

    console.log("Initial Settings (from storage):", settings);

    // Set default values if not already present in the settings object
    if (!settings.theme) {
        settings.theme = 'light';
        await setSetting('theme', settings.theme); // Use setSetting() to save theme
    }

    if (!settings.ankiEnabled) {
        settings.ankiEnabled = 'true';
        await setSetting('ankiEnabled', settings.ankiEnabled); // Use setSetting() to save ankiEnabled
    }

    console.log("Default Settings (after updates):", settings);

  
    
    // Retrieve the updated userSettings to confirm they're saved
    const updatedResult = await browser.storage.local.get('userSettings');
    console.log("Storage after initialization:", updatedResult.userSettings);

    return updatedResult.userSettings;
}

