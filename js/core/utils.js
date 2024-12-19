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

