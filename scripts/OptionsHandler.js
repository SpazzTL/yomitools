document.addEventListener('DOMContentLoaded', () => {
    const colorInput = document.getElementById('highlight-color');
    const enableCheckbox = document.getElementById('enable-highlight');
    const saveSettingsBtn = document.getElementById('save-settings');
  
    // Load saved settings on page load
    browser.storage.local.get(['highlightColor', 'highlightEnabled'])
      .then(data => {
        if (data.highlightColor) colorInput.value = data.highlightColor;
        if (data.highlightEnabled !== undefined) enableCheckbox.checked = data.highlightEnabled;
      })
      .catch(err => console.error('Error loading settings:', err));
  
    // Save settings when clicking "Save Settings"
    saveSettingsBtn.addEventListener('click', () => {
      const highlightColor = colorInput.value;
      const highlightEnabled = enableCheckbox.checked;
  
      browser.storage.local.set({ highlightColor, highlightEnabled })
        .then(() => {
          alert('Settings saved successfully!');
        })
        .catch(err => console.error('Error saving settings:', err));
    });
  });
  