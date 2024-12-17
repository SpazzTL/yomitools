function invoke(action, version, params = {}) {
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
                    console.log("Content script: Response received", response);
                    resolve(response.data.result);
                }
            }
        );
    });
}

// Usage example
(async () => {
    try {
        const result = await invoke('multi', 6, {actions: [
            {action: 'deckNames', version: 6},
            {action: 'findNotes', version: 6, params: {query: 'deck:current'}}
        ]});
        console.log("Multi Test Returns array:", result);
        
        // Check each individual result (for debugging)
        const [deckNamesResult, findNotesResult] = result;
        console.log("Deck Names Result:", deckNamesResult);
        console.log("Find Notes Result:", findNotesResult); 

    } catch (error) {
        console.error("Error:", error);
    }
})();

(async () => {
    try {
        // Get all deck names
        const decks = await invoke('deckNames', 6);
        console.log("Deck Result:", decks);

        // Initialize an array to hold all the cards
        let allCards = [];

        // Loop through each deck and find its cards
        for (let deck of decks) {
            // Skip "Default" deck
            if (deck === "Default") {
                continue;
            }

            // Find cards for the current deck
            const cards = await invoke('findCards', 6, {query: `deck:${deck}`});
            console.log(`Cards added from ${deck}:`, cards);

            // Add the cards to the allCards array
            allCards = allCards.concat(cards);
        }

        console.log("All Cards:", allCards);

        // Fetch cardsInfo for all cards
        const cardsInfo = await invoke('cardsInfo', 6, {cards: allCards});

        console.log("Cards Info Result:", cardsInfo);

        // Extract the first field's text (value) from each card
        const firstFieldValues = cardsInfo.map(card => {
            const fields = card.fields;

            // Extract the first field's value (assuming it's ordered correctly)
            const firstField = Object.values(fields)[0]?.value || "No Value";
            return firstField;
        });

        // Log the extracted first field values
        console.log("First Field Values:", firstFieldValues);

        browser.storage.local.clear()
        browser.storage.local.set({ wordCollection: firstFieldValues})

    } catch (error) {
        console.error("Error:", error);
    }
})();
