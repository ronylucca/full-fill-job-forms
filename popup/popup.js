document.addEventListener('DOMContentLoaded', function() {
  // UI Elements
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const profileForm = document.getElementById('profileForm');
  const settingsForm = document.getElementById('settingsForm');
  const aiProviderSelect = document.getElementById('aiProvider');
  const openrouterModelGroup = document.getElementById('openrouterModelGroup');
  
  // Add click event to tabs
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // Remove active class from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to selected tab
      button.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Add event to show/hide OpenRouter model selector
  aiProviderSelect.addEventListener('change', () => {
    if (aiProviderSelect.value === 'openrouter') {
      openrouterModelGroup.style.display = 'block';
    } else {
      openrouterModelGroup.style.display = 'none';
    }
  });
  
  // Load saved data when opening popup
  loadProfileData();
  loadSettingsData();
  
  // Add event to save profile
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProfileData();
  });
  
  // Add event to save settings
  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveSettingsData();
  });
  
  /**
   * Saves profile data to local storage
   */
  function saveProfileData() {
    const profileData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zipCode: document.getElementById('zipCode').value,
      country: document.getElementById('country').value,
      company: document.getElementById('company').value,
      jobTitle: document.getElementById('jobTitle').value,
      website: document.getElementById('website').value,
      linkedin: document.getElementById('linkedin').value
    };
    
    chrome.storage.sync.set({ profileData }, () => {
      showAlert('Profile saved successfully!', 'success');
    });
  }
  
  /**
   * Loads profile data from local storage
   */
  function loadProfileData() {
    chrome.storage.sync.get('profileData', (result) => {
      if (result.profileData) {
        const data = result.profileData;
        document.getElementById('name').value = data.name || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('address').value = data.address || '';
        document.getElementById('city').value = data.city || '';
        document.getElementById('state').value = data.state || '';
        document.getElementById('zipCode').value = data.zipCode || '';
        document.getElementById('country').value = data.country || '';
        document.getElementById('company').value = data.company || '';
        document.getElementById('jobTitle').value = data.jobTitle || '';
        document.getElementById('website').value = data.website || '';
        document.getElementById('linkedin').value = data.linkedin || '';
      }
    });
  }
  
  /**
   * Saves settings to local storage
   */
  function saveSettingsData() {
    const settingsData = {
      aiProvider: document.getElementById('aiProvider').value,
      apiKey: document.getElementById('apiKey').value,
      openrouterModel: document.getElementById('openrouterModel').value,
      autoFillEnabled: document.getElementById('autoFillEnabled').checked,
      aiContextMenu: document.getElementById('aiContextMenu').checked
    };
    
    chrome.storage.sync.set({ settingsData }, () => {
      showAlert('Settings saved successfully!', 'success');
      
      // Notify background script about changes
      chrome.runtime.sendMessage({
        action: 'settingsUpdated',
        settings: settingsData
      });
    });
  }
  
  /**
   * Loads settings from local storage
   */
  function loadSettingsData() {
    chrome.storage.sync.get('settingsData', (result) => {
      if (result.settingsData) {
        const data = result.settingsData;
        document.getElementById('aiProvider').value = data.aiProvider || 'openai';
        document.getElementById('apiKey').value = data.apiKey || '';
        
        // Configure OpenRouter model if defined
        if (data.openrouterModel) {
          document.getElementById('openrouterModel').value = data.openrouterModel;
        }
        
        // Show or hide OpenRouter model selector as needed
        if (data.aiProvider === 'openrouter') {
          openrouterModelGroup.style.display = 'block';
        } else {
          openrouterModelGroup.style.display = 'none';
        }
        
        document.getElementById('autoFillEnabled').checked = 
          data.autoFillEnabled !== undefined ? data.autoFillEnabled : true;
        document.getElementById('aiContextMenu').checked = 
          data.aiContextMenu !== undefined ? data.aiContextMenu : true;
      }
    });
  }
  
  /**
   * Shows a temporary alert message
   * @param {string} message - Message to display
   * @param {string} type - Alert type (success or error)
   */
  function showAlert(message, type) {
    // Remove previous alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    // Create a new alert
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    
    // Add the alert before the first element on the page
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);
    
    // Add 'show' class to display it
    setTimeout(() => {
      alert.classList.add('show');
    }, 10);
    
    // Remove the alert after 3 seconds
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => {
        alert.remove();
      }, 300);
    }, 3000);
  }
}); 