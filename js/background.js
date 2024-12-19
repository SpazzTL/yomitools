import { getAllUserSettings, getSetting, setSetting, setDefaultUserSettings} from "./core/utils.js";



// Initialize Settings

getAllUserSettings().then(settings => {
    if (Object.keys(settings).length === 0) {
        console.log("Settings not INIT");
        setDefaultUserSettings()
            .then(defaultSettings => {
                //console.log("Default settings initialized as:", defaultSettings);

            })
            .then(updatedSettings => {
                //console.log("Updated settings are:", updatedSettings);
            })
            .catch(error => {
                //console.error("Failed to initialize settings:", error);
            });
    } else {

       // console.log("Settings retrieved as:", settings);
    }
});





getSetting('theme').then(theme => {
    if (theme) {
        return
    } else {
        setSetting('theme', 'light')
    }
});



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
