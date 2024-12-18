// ImportParser.js

// This function is responsible for parsing the file content
document.getElementById('upload-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent page refresh on submit
  
    console.log('Form submitted'); // Debugging: Log when form is submitted
  
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];
  
    if (!file) {
      console.log('No file selected');
      return;
    }
  
    console.log('File selected:', file.name);
  
    const reader = new FileReader();
    reader.onload = function () {
      const content = reader.result;
      console.log('File content:', content); // Debugging: Log the file content
      let words = [];
  
      if (file.name.endsWith('.txt')) {
        // Parse .txt file (one word per line), keeping only the first word
        words = parseTextFile(content);
      } else if (file.name.endsWith('.apkg') || file.name.endsWith('.colpkg')) {
        words = parseApkgOrColpkg(content);  // Add actual parsing logic for .apkg or .colpkg files
      }
  
      // Clear previous collection and save the new words to local storage
      browser.storage.local.clear() // Clear entire storage
        .then(() => {
          return browser.storage.local.set({ wordCollection: words });
        })
        .then(() => {
          alert('Collection uploaded successfully!');
          displayWords(words); // Update UI with the uploaded word list
        })
        .catch(err => {
          console.error('Error saving collection:', err);
          alert('Failed to save the collection.');
        });
    };
  
    reader.readAsText(file);
  });
  
  // Function to parse the .txt file, extracting only the first word from each line
  function parseTextFile(content) {
    const words = content.split('\n') // Split content into lines
                         .map(line => line.trim()) // Remove whitespace from each line
                         .filter(line => line && !line.startsWith('#')) // Ignore empty lines and comments
                         .map(line => {
                            const fields = line.split('\t'); // Split line into fields using tabs
                            return fields[0] ? fields[0].trim() : null; // Take the first field if it exists
                         })
                         .filter(word => word); // Remove null or undefined values
  
    return words;
  }
  
  // Dummy function to handle .apkg/.colpkg files (replace with actual parsing logic later)
  function parseApkgOrColpkg(content) {
    // Implement actual logic to parse apkg/colpkg files, for now it returns dummy data
    return ['word1', 'word2', 'word3'];
  }
  
