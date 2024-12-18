//Class that holds all relevant AnkiConnect Methods

class AnkiConnect {
    constructor() {
        /** @type {boolean} */
        this._enabled = false;
        /** @type {?string} */
        this._server = null;
        /** @type {?string} */
        this._apiKey = null;
    }



    
    //Method
    invoke(action, version, params = {}) {
        return new Promise((resolve, reject) => {
            browser.runtime.sendMessage(
                { action: "invoke", data: { action, version, params } },
                response => {
                    if (browser.runtime.lastError) {
                        console.error("Content script error:", browser.runtime.lastError.message);
                        reject(browser.runtime.lastError.message);
                    } else if (!response.success) {
                        console.error("AnkiConnect error:", response.error);
                        reject(`Request failed: ${response.error}`);
                    } else {
                        //console.log("Content script: Response received", response);
                        resolve(response.data.result);
                    }
                }
            );
        });
    }
    
}
  
