console.log('Extension Started');

// Define highlightColor and highlightEnabled in the global scope
let highlightColor = '#ffff00'; // Default yellow
let highlightEnabled = true; // Default to true

// Function to retrieve settings and apply highlighting
function applyHighlighting() {
  console.log("applyHighlighting called");

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

          // Escape special characters in words for regex
          const escapedWords = wordCollection.map(word => {
            return word.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&'); // Escape special characters
          });
          console.log('Escaped words:', escapedWords);

          // Precompile the regex for matching exact words with word boundaries
          const highlightRegex = new RegExp(`(?:^|\\W)(${escapedWords.join('|')})(?=$|\\W)`, 'gi'); // Match words separated by non-word characters
          console.log('Highlight Regex:', highlightRegex);

          // Test the regex against the document body
          const testString = document.body.textContent; // Test against the body text
          console.log('Testing regex matches:');
          const matches = testString.match(highlightRegex);
          console.log('Matches found in test string:', matches);

          // Start highlighting
          traverseAndHighlight(document.body, highlightRegex);
        })
        .catch(err => console.error('Failed to retrieve word collection:', err));
    })
    .catch(err => {
      console.error('Failed to retrieve highlight settings:', err);
    });
}

// Call the applyHighlighting function on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM content loaded');
  applyHighlighting(); // First execution after DOMContentLoaded
});

// Call the applyHighlighting function again on window.onload
window.onload = function () {
  console.log('Window loaded');
  applyHighlighting(); // Second execution after window.onload
}

// Wait 5 seconds and call applyHighlighting a third time
setTimeout(function () {
  console.log('5 seconds have passed, highlighting again...');
  applyHighlighting(); // Third execution after 5 seconds
}, 5000); // 5000 milliseconds = 5 seconds

/**
 * Traverses the DOM and highlights text nodes.
 *
 * @param  {Node} node           - The target DOM Node.
 * @param  {RegExp} highlightRegex - The compiled regex to match and highlight words.
 * @return {void}
 */
function traverseAndHighlight(node, highlightRegex) {
  // Ensure the node is valid and connected to the DOM
  if (!node || !node.isConnected) {
    console.log("Skipping disconnected node:", node);
    return;
  }

  // If the node is a text node, replace text
  if (node.nodeType === Node.TEXT_NODE) {
    replaceTextNode(node, highlightRegex);
  } else {
    // Recursively check child nodes
    node.childNodes.forEach(childNode => traverseAndHighlight(childNode, highlightRegex));
  }
}

/**
 * Replaces all occurrences of target words in text nodes with highlighted versions.
 *
 * @param  {Node} node           - The target DOM Node.
 * @param  {RegExp} highlightRegex - The compiled regex to match and highlight words.
 * @return {void}
 */
function replaceTextNode(node, highlightRegex) {
  // Ensure the node has a valid parent node before proceeding
  if (!node.parentNode) {
    console.log("Skipping node with no parent:", node);
    return;
  }

  const content = node.textContent;
  console.log("Checking text content:", content);

  // Skip if this node has already been highlighted
  if (node.parentNode && node.parentNode.hasAttribute('data-highlighted')) {
    console.log("Node already highlighted, skipping...");
    return;
  }

  // Check if the regex matches the content
  const matches = content.match(highlightRegex);
  if (matches) {
    console.log("Match found for:", content);
    console.log("Matched words:", matches);

    // Replace matched words with highlight spans
    const parts = content.split(highlightRegex);
    const fragment = document.createDocumentFragment();

    parts.forEach((part, index) => {
      if (index % 2 === 1) { // Matched words (regex matches at odd indexes)
        const span = document.createElement('span');
        span.style.backgroundColor = highlightColor;
        span.style.color = 'black';
        span.style.fontWeight = 'bold';
        span.style.border = '1px solid red'; // Added border for debugging visibility
        span.textContent = part;
        fragment.appendChild(span);
      } else {
        fragment.appendChild(document.createTextNode(part));
      }
    });

    // Replace the original text node with the highlighted version
    try {
      console.log("Replacing text node...");
      node.parentNode.replaceChild(fragment, node);
      // Mark this node as highlighted to prevent re-processing
      node.parentNode.setAttribute('data-highlighted', 'true');
    } catch (error) {
      console.error("Error replacing node:", error);
    }
  } else {
    console.log("No match for:", content);
  }
}
