//Class that holds all relevant AnkiConnect Methods


export class AnkiConnect {
    constructor() {
        /** @type {boolean} */
        this._enabled = true;
}


    /**
 * Checks whether a connection to AnkiConnect can be established.
 * @returns {Promise<boolean>} `true` if the connection was made, `false` otherwise.
 */
    async isConnected() {
        try {
            await this._getVersion();
            return true;
        } catch (e) {
            console.error(e)
            return false;
        
        }
    }

    /**
     * Gets the AnkiConnect API version number.
     * @returns {Promise<?number>} The version number
     */
    async _getVersion() {
        if (!this._enabled) { return null; }
        const result = await this._invoke('version')
        if (result){
            return true;
        }
        else{
            return false;
        }
    }



    /**
     * @returns {Promise<string[]>}
     */
    async getDeckNames() {
        console.log("Called function getDeckName")
        if (!this._enabled) {console.log("AnkiConnect Disabled"); return []; }
        await this._checkVersion();
        const result = await this._invoke('deckNames', {});
        console.log("Result is " + result)
        return result
        // return this._normalizeArray(result, -1, 'string');
    }



        
    /**
     * @param {string} action
     * @param {import('core').SerializableObject} params
     * @returns {Promise<unknown>}
     */
     _invoke(action, version, params = {}) {
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
