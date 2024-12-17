document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const colorInput = document.getElementById('highlight-color');
  const enableCheckbox = document.getElementById('enable-highlight');
  const saveSettingsBtn = document.getElementById('save-settings');
  const dropdownBtn = document.getElementById("dropdown-btn");
  const dropdownContainer = document.querySelector(".dropdown-container");

  const darkModeSwitch = document.getElementById("dark-mode-switch");

  // --- Dropdown Toggle ---
  dropdownBtn.addEventListener("click", () => {
      dropdownContainer.classList.toggle("show");
  });

  // --- Load Saved Highlight Settings ---
  browser.storage.local.get(['highlightColor', 'highlightEnabled', 'theme'])
      .then(data => {
          if (data.highlightColor) colorInput.value = data.highlightColor;
          if (data.highlightEnabled !== undefined) enableCheckbox.checked = data.highlightEnabled;

          // Load Dark Mode Setting
          if (data.theme === 'dark') {
              document.documentElement.setAttribute('data-theme', 'dark');
              darkModeSwitch.checked = true;
          }
      })
      .catch(err => console.error('Error loading settings:', err));

  // --- Save Highlight Settings ---
  saveSettingsBtn.addEventListener('click', () => {
      const highlightColor = colorInput.value;
      const highlightEnabled = enableCheckbox.checked;

      browser.storage.local.set({ highlightColor, highlightEnabled })
          .then(() => {
              alert('Settings saved successfully!');
          })
          .catch(err => console.error('Error saving settings:', err));
  });

  // --- Dark Mode Toggle ---
  darkModeSwitch.addEventListener('change', () => {
      if (darkModeSwitch.checked) {
          document.documentElement.setAttribute('data-theme', 'dark');
          browser.storage.local.set({ theme: 'dark' });
      } else {
          document.documentElement.removeAttribute('data-theme');
          browser.storage.local.set({ theme: 'light' });
      }
  });
});
