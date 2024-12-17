document.addEventListener('DOMContentLoaded', function () {

    // Reset the word collection in local storage
    document.getElementById('reset-btn').addEventListener('click', function () {
      browser.storage.local.clear()
        .then(() => {
          alert('Word collection has been reset!');
          displayWords([]); // Reset word list in UI after clearing storage
        })
        .catch((error) => {
          console.error('Error resetting collection:', error);
          alert('Failed to reset the collection.');
        });
    });
  
    // Check saved word collection
    document.getElementById('check-saved').addEventListener('click', function () {
      browser.storage.local.get('wordCollection')
        .then((result) => {
          if (result.wordCollection) {
            alert('Saved words: ' + result.wordCollection.join(', '));
          } else {
            alert('No words saved.');
          }
        })
        .catch((error) => {
          console.error('Error retrieving saved collection:', error);
          alert('Failed to retrieve the saved collection.');
        });
    });
  
    // Load saved words when the page loads
    browser.storage.local.get('wordCollection')
      .then((result) => {
        if (result.wordCollection) {
          displayWords(result.wordCollection); // Show the saved words on page load
        } else {
          displayWords([]); // No saved words
        }
      })
      .catch((error) => {
        console.error('Error loading saved words:', error);
      });
  
    // Function to display words in the panel
    function displayWords(words) {
      const wordListContainer = document.getElementById('word-list');
      wordListContainer.innerHTML = ''; // Clear any existing words
  
      if (words.length === 0) {
        wordListContainer.innerHTML = '<p>No words in the collection.</p>';
      } else {
        words.forEach(word => {
          const wordDiv = document.createElement('div');
          wordDiv.textContent = word;
          wordListContainer.appendChild(wordDiv);
        });
      }
    }
  
    // Export the displayWords function to make it available for other scripts
    window.displayWords = displayWords;
  
  });
  