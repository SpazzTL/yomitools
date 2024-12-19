document.addEventListener('DOMContentLoaded', () => {
    // console.log("Loaded Settings Script")

    // DOM Elements
    const darkModeSwitch = document.getElementById("dark-mode-switch");
  
    
    // --- Dark Mode Toggle ---
  darkModeSwitch.addEventListener('change', () => {
    // console.log("Click Event Found")
    if (darkModeSwitch.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        browser.storage.local.set({ theme: 'dark' });
    } else {
        document.documentElement.removeAttribute('data-theme');
        browser.storage.local.set({ theme: 'light' });
    }
    });

    // --- Set Dark Mode Toggle to Checked/UnChecked ---
    browser.storage.local.get(['theme'])
    .then(data => {
        //console.log("Theme found as:", data.theme);
        if (data.theme === 'dark') {
            darkModeSwitch.checked = true;
        } else {
            darkModeSwitch.checked = false;
        }
    })

    
    //Collapsible
    const collapsibles = document.querySelectorAll('.collapsible');

    collapsibles.forEach((button) => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            button.setAttribute('aria-expanded', !isExpanded);
            content.classList.toggle('active');
        });
    });


    // Apply theme
    browser.storage.local.get(['theme'])
        .then(data => {
            //console.log("Theme found as:", data.theme);
            if (data.theme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
            } else {
                document.body.setAttribute('data-theme', 'light');
            }
        })
    .catch(err => console.error('Error loading theme:', err)); //Logging doesn't seem to work, more of a hope

});