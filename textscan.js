console.log('Extension Started');

// Define highlightColor and highlightEnabled in the global scope
let highlightColor = '#ffff00'; // Default yellow
let highlightEnabled = true; // Default to true

// Retrieve the stored highlight color and status from local storage
browser.storage.local.get(['highlightColor', 'highlightEnabled'])
  .then(data => {
    highlightColor = data.highlightColor || highlightColor;  // Update with stored value if present
    highlightEnabled = data.highlightEnabled !== false; // Default to true if not found
    console.log("Highlight color is set to " + highlightColor);
    console.log("Highlight is set to " + highlightEnabled);

    if (!highlightEnabled) {
      console.log('Highlighting is disabled.');
      return;
    }
  })
  .catch(err => {
    console.error('Failed to retrieve highlight settings:', err);
});



document.addEventListener('DOMContentLoaded', function() {
  console.log('Page is fully loaded (DOM fully loaded)');
});

window.onload = function() {
  console.log('Page is fully loaded (window.onload)');



  // Retrieves the stored word collection and starts the highlighting process.
  
  browser.storage.local.get('wordCollection')
    .then(storage => {
      const wordCollection = storage.wordCollection || [];
      console.log('Word Collection Retrieved:', wordCollection);

      if (wordCollection.length === 0) {
        console.log('No words to highlight');
        return;
      }

      // Precompile the regex for word matching
      const highlightRegex = new RegExp(`(${wordCollection.join('|')})`, 'gi');


      // Start highlighting
      replaceText(document.body, highlightRegex);

      // Monitor DOM changes for new nodes and highlight them
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
              const newNode = mutation.addedNodes[i];
              replaceText(newNode, highlightRegex);
            }
          }
        });
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    })
    .catch(err => console.error('Failed to retrieve word collection:', err));

  /**
   * Replaces all occurrences of target words in text nodes with highlighted versions.
   *
   * @param  {Node} node           - The target DOM Node.
   * @param  {RegExp} highlightRegex - The compiled regex to match and highlight words.
   * @return {void}
   */
  function replaceText(node, highlightRegex) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentNode && node.parentNode.isContentEditable) {
        return; // Skip editable content
      }

      const content = node.textContent;

      if (highlightRegex.test(content)) {
        // Replace matched words with highlight spans
        const parts = content.split(highlightRegex);
        const fragment = document.createDocumentFragment();

        parts.forEach((part, index) => {
          if (index % 2 === 1) { // Matched words (regex matches at odd indexes)
            const span = document.createElement('span');
            span.style.backgroundColor = highlightColor;
            span.style.color = 'black';
            span.style.fontWeight = 'bold';
            span.textContent = part;
            fragment.appendChild(span);
          } else {
            fragment.appendChild(document.createTextNode(part));
          }
        });

        // Replace the original text node
        node.parentNode.replaceChild(fragment, node);
      }
    } else {
      // Process all child nodes
      node.childNodes.forEach(child => replaceText(child, highlightRegex));
    }
  }

};