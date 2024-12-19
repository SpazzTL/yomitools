// Dark Mode INIT
// Only if not yet set to preference
browser.storage.local.get(['theme'])
    .then(data => {
        // console.log("Found a theme")
        browser.storage.local.set({ theme: 'light' });
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
