document.addEventListener('DOMContentLoaded', function() {
  // Elementos da UI
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const profileForm = document.getElementById('profileForm');
  const settingsForm = document.getElementById('settingsForm');
  
  // Adiciona evento de clique nas abas
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // Remove classe active de todas as abas
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Adiciona classe active na aba selecionada
      button.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Carrega dados salvos ao abrir o popup
  loadProfileData();
  loadSettingsData();
  
  // Adiciona evento para salvar perfil
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProfileData();
  });
  
  // Adiciona evento para salvar configurações
  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveSettingsData();
  });
  
  /**
   * Salva os dados do perfil no armazenamento local
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
      showAlert('Perfil salvo com sucesso!', 'success');
    });
  }
  
  /**
   * Carrega os dados do perfil do armazenamento local
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
   * Salva as configurações no armazenamento local
   */
  function saveSettingsData() {
    const settingsData = {
      aiProvider: document.getElementById('aiProvider').value,
      apiKey: document.getElementById('apiKey').value,
      autoFillEnabled: document.getElementById('autoFillEnabled').checked,
      aiContextMenu: document.getElementById('aiContextMenu').checked
    };
    
    chrome.storage.sync.set({ settingsData }, () => {
      showAlert('Configurações salvas com sucesso!', 'success');
      
      // Notifica o script de background sobre as alterações
      chrome.runtime.sendMessage({
        action: 'settingsUpdated',
        settings: settingsData
      });
    });
  }
  
  /**
   * Carrega as configurações do armazenamento local
   */
  function loadSettingsData() {
    chrome.storage.sync.get('settingsData', (result) => {
      if (result.settingsData) {
        const data = result.settingsData;
        document.getElementById('aiProvider').value = data.aiProvider || 'openai';
        document.getElementById('apiKey').value = data.apiKey || '';
        document.getElementById('autoFillEnabled').checked = 
          data.autoFillEnabled !== undefined ? data.autoFillEnabled : true;
        document.getElementById('aiContextMenu').checked = 
          data.aiContextMenu !== undefined ? data.aiContextMenu : true;
      }
    });
  }
  
  /**
   * Exibe uma mensagem de alerta temporária
   * @param {string} message - Mensagem a ser exibida
   * @param {string} type - Tipo de alerta (success ou error)
   */
  function showAlert(message, type) {
    // Remove alertas anteriores
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    // Cria um novo alerta
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    
    // Adiciona o alerta antes do primeiro elemento na página
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);
    
    // Adiciona a classe 'show' para exibi-lo
    setTimeout(() => {
      alert.classList.add('show');
    }, 10);
    
    // Remove o alerta após 3 segundos
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => {
        alert.remove();
      }, 300);
    }, 3000);
  }
}); 