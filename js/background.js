
// Sets default theme
// Only if not yet set to preference

// _getSetting('theme').then(theme => {
//     if (theme) {
//         return
//     } else {
//         _setSetting('theme', 'light')
//     }
// });


 //Cant use import in background script
        // Functions 

        function _getSetting(subSetting) {
            return browser.storage.local.get('userSettings').then(result => {
                const settings = result.userSettings || {}; // Safeguard if userSettings does not exist.
                return settings[subSetting] || null; // Return null if subSetting doesn't exist.
            });
        }
        
        function _setSetting(subSetting, value) {
            return browser.storage.local.get('userSettings').then(result => {
                let settings = result.userSettings || {}; // Safeguard if userSettings doesn't exist
                settings[subSetting] = value; // Update the specific subsetting
                return browser.storage.local.set({ userSettings: settings }); // Save updated settings
            });
        }

//Anki Connect Sender...
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    if (message.action === "invoke") {
        const url = "http://127.0.0.1:8765";
        const body = JSON.stringify({
            action: message.data.action,
            version: message.data.version,
            params: message.data.params
        });

        //console.log("Background script: Sending request to AnkiConnect");

        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                //console.log("Background script: Response received", data);
                sendResponse({ success: true, data: data });
            })
            .catch(error => {
                console.error("Background script: Fetch error", error);
                sendResponse({ success: false, error: error.message });
            });

        return true; // Keep the message channel open for async response
    }



       
});
