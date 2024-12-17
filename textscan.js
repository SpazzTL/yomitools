console.log('Extension Started');

// Define highlightColor and highlightEnabled in the global scope
let highlightColor = '#ffff00'; // Default yellow
let highlightEnabled = true; // Default to true

// Function to retrieve settings and apply highlighting
function applyHighlighting() {
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

      // Retrieves the stored word collection and starts the highlighting process
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
        })
        .catch(err => console.error('Failed to retrieve word collection:', err));
    })
    .catch(err => {
      console.error('Failed to retrieve highlight settings:', err);
    });
}

// Call the applyHighlighting function on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('Page is fully loaded (DOM fully loaded)');
  applyHighlighting(); // First execution after DOMContentLoaded
});

// Call the applyHighlighting function again on window.onload
window.onload = function () {
  console.log('Page is fully loaded (window.onload)');
  applyHighlighting(); // Second execution after window.onload
}

// Wait 5 seconds and call applyHighlighting a third time 
//Sometimes window.onload doesn't work and dom misses content
setTimeout(function () {
  console.log('5 seconds have passed, highlighting again...');
  applyHighlighting(); // Third execution after 5 seconds
}, 5000); // 5000 milliseconds = 5 seconds

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
