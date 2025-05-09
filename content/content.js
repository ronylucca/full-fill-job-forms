// Armazena os dados do perfil carregados
let profileData = {};
let autoFillEnabled = true;

// Carrega as configurações e dados de perfil quando a página carrega
loadSettings();
loadProfileData();

// Cria o modal para exibir respostas da IA
const aiResponseModal = createAIResponseModal();
document.body.appendChild(aiResponseModal);

// Listener para mensagens do script de background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'displayAIResponse' && message.response) {
    showAIResponse(message.response);
  } else if (message.action === 'displayAIError' && message.error) {
    showAIError(message.error);
  } else if (message.action === 'generateAIResponse') {
    // Já estamos lidando com isso no background script
    // Apenas exibimos o modal com mensagem de carregamento
    showAIResponseLoading();
  }
});

/**
 * Carrega as configurações
 */
function loadSettings() {
  chrome.storage.sync.get('settingsData', (result) => {
    if (result.settingsData) {
      autoFillEnabled = result.settingsData.autoFillEnabled !== undefined 
        ? result.settingsData.autoFillEnabled 
        : true;
      
      // Se o preenchimento automático estiver ativado, adicionamos os listeners
      if (autoFillEnabled) {
        setupFormDetection();
      }
    }
  });
}

/**
 * Carrega os dados do perfil
 */
function loadProfileData() {
  chrome.storage.sync.get('profileData', (result) => {
    if (result.profileData) {
      profileData = result.profileData;
    }
  });
}

/**
 * Configura a detecção de formulários
 */
function setupFormDetection() {
  // Detecta campos de formulário quando a página carrega
  detectFormFields();
  
  // Observa mudanças no DOM para detectar novos campos de formulário
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        detectFormFields();
        break;
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Detecta campos de formulário na página
 */
function detectFormFields() {
  // Campos comuns de formulário e suas possíveis correspondências
  const fieldMappings = [
    { type: 'text', names: ['name', 'fullname', 'full-name', 'full_name', 'nome', 'nome_completo'], key: 'name' },
    { type: 'email', names: ['email', 'e-mail', 'emailaddress', 'email_address'], key: 'email' },
    { type: 'tel', names: ['phone', 'telephone', 'tel', 'mobile', 'telefone', 'celular'], key: 'phone' },
    { type: 'text', names: ['address', 'endereco', 'endereço', 'streetaddress', 'street-address'], key: 'address' },
    { type: 'text', names: ['city', 'cidade', 'town'], key: 'city' },
    { type: 'text', names: ['state', 'estado', 'province', 'region'], key: 'state' },
    { type: 'text', names: ['zipcode', 'zip', 'postal', 'cep', 'postal-code', 'postalcode'], key: 'zipCode' },
    { type: 'text', names: ['country', 'pais', 'país', 'nation'], key: 'country' },
    { type: 'text', names: ['company', 'empresa', 'organization', 'business'], key: 'company' },
    { type: 'text', names: ['job', 'jobtitle', 'job-title', 'job_title', 'cargo', 'occupation', 'profession', 'title', 'position'], key: 'jobTitle' },
    { type: 'url', names: ['website', 'site', 'web', 'homepage'], key: 'website' },
    { type: 'url', names: ['linkedin', 'linkedinurl', 'linkedin-url'], key: 'linkedin' }
  ];
  
  // Processar todos os campos de entrada
  const inputFields = document.querySelectorAll('input');
  
  inputFields.forEach(field => {
    // Ignorar campos ocultos e de submissão
    if (field.type === 'hidden' || field.type === 'submit' || field.type === 'button') {
      return;
    }
    
    // Verificar se o campo já tem nosso processamento
    if (field.dataset.fullFillProcessed) {
      return;
    }
    
    // Marcar o campo como processado
    field.dataset.fullFillProcessed = 'true';
    
    // Adicionar ícone de preenchimento automático
    addAutoFillButton(field, fieldMappings);
    
    // Também adicionar evento para detecção de campos potenciais pelo foco
    field.addEventListener('focus', (e) => {
      const possibleField = detectPossibleFieldType(e.target, fieldMappings);
      if (possibleField) {
        highlightAutoFillPossibility(e.target, possibleField);
      }
    });
  });
}

/**
 * Detecta o possível tipo de campo com base em atributos
 * @param {HTMLElement} field - O campo de entrada
 * @param {Array} mappings - Mapeamentos de campos
 * @returns {Object|null} - O mapeamento encontrado ou null
 */
function detectPossibleFieldType(field, mappings) {
  // Atributos a verificar
  const attributes = ['name', 'id', 'placeholder', 'aria-label'];
  
  for (const mapping of mappings) {
    // Verificar tipo de campo
    if (mapping.type && field.type === mapping.type) {
      return mapping;
    }
    
    // Verificar atributos para possíveis correspondências
    for (const attr of attributes) {
      if (!field[attr]) continue;
      
      const attrValue = field[attr].toLowerCase();
      
      for (const name of mapping.names) {
        // Verificar correspondência exata ou como parte de uma palavra
        if (attrValue === name || 
            attrValue.includes(name + ' ') || 
            attrValue.includes(' ' + name) || 
            attrValue.includes('_' + name) || 
            attrValue.includes(name + '_')) {
          return mapping;
        }
      }
    }
  }
  
  return null;
}

/**
 * Adiciona botão de preenchimento automático ao campo
 * @param {HTMLElement} field - O campo de entrada
 * @param {Array} mappings - Mapeamentos de campos
 */
function addAutoFillButton(field, mappings) {
  const possibleField = detectPossibleFieldType(field, mappings);
  
  if (possibleField && profileData[possibleField.key]) {
    // Cria o botão de preenchimento automático
    const autoFillButton = document.createElement('button');
    autoFillButton.className = 'full-fill-autofill-button';
    autoFillButton.innerHTML = '⚡';
    autoFillButton.title = 'Preencher automaticamente';
    
    // Estiliza o botão
    autoFillButton.style.position = 'absolute';
    autoFillButton.style.right = '8px';
    autoFillButton.style.top = '50%';
    autoFillButton.style.transform = 'translateY(-50%)';
    autoFillButton.style.background = '#3498db';
    autoFillButton.style.color = 'white';
    autoFillButton.style.border = 'none';
    autoFillButton.style.borderRadius = '50%';
    autoFillButton.style.width = '24px';
    autoFillButton.style.height = '24px';
    autoFillButton.style.fontSize = '14px';
    autoFillButton.style.cursor = 'pointer';
    autoFillButton.style.zIndex = '9999';
    autoFillButton.style.display = 'flex';
    autoFillButton.style.alignItems = 'center';
    autoFillButton.style.justifyContent = 'center';
    
    // Adiciona evento de clique para preencher o campo
    autoFillButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      field.value = profileData[possibleField.key];
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Posiciona o botão corretamente
    const fieldRect = field.getBoundingClientRect();
    const fieldStyle = window.getComputedStyle(field);
    
    // Ajusta o pai do campo para posicionamento relativo, se necessário
    const fieldParent = field.parentElement;
    if (fieldParent && window.getComputedStyle(fieldParent).position === 'static') {
      fieldParent.style.position = 'relative';
    }
    
    // Adiciona o botão ao DOM
    field.parentElement.appendChild(autoFillButton);
    
    // Posiciona o botão em relação ao campo
    positionAutoFillButton(autoFillButton, field);
    
    // Observa mudanças de tamanho/posição do campo
    window.addEventListener('resize', () => {
      positionAutoFillButton(autoFillButton, field);
    });
  }
}

/**
 * Posiciona o botão de preenchimento automático
 * @param {HTMLElement} button - O botão de preenchimento
 * @param {HTMLElement} field - O campo de referência
 */
function positionAutoFillButton(button, field) {
  const fieldRect = field.getBoundingClientRect();
  const fieldStyle = window.getComputedStyle(field);
  
  // Ajusta a posição do botão para estar dentro do campo
  button.style.top = `${field.offsetTop + (fieldRect.height / 2)}px`;
  button.style.right = `${parseInt(fieldStyle.paddingRight) + 4}px`;
}

/**
 * Destaca a possibilidade de preenchimento automático
 * @param {HTMLElement} field - O campo de entrada
 * @param {Object} mapping - O mapeamento do campo
 */
function highlightAutoFillPossibility(field, mapping) {
  // Apenas destaca se temos os dados para preencher
  if (profileData[mapping.key]) {
    field.style.borderColor = '#3498db';
    
    // Cria um tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'full-fill-tooltip';
    tooltip.textContent = `Clique no ícone ⚡ para preencher com "${profileData[mapping.key]}"`;
    
    // Estiliza o tooltip
    tooltip.style.position = 'absolute';
    tooltip.style.left = '0';
    tooltip.style.top = '100%';
    tooltip.style.backgroundColor = '#3498db';
    tooltip.style.color = 'white';
    tooltip.style.padding = '4px 8px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '10000';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.marginTop = '4px';
    
    // Posiciona o tooltip
    const fieldRect = field.getBoundingClientRect();
    
    // Adiciona o tooltip ao corpo do documento
    document.body.appendChild(tooltip);
    
    // Posiciona o tooltip abaixo do campo
    const tooltipRect = tooltip.getBoundingClientRect();
    tooltip.style.left = `${fieldRect.left}px`;
    tooltip.style.top = `${fieldRect.bottom + 4}px`;
    
    // Remove o tooltip quando o campo perde o foco
    field.addEventListener('blur', () => {
      field.style.borderColor = '';
      tooltip.remove();
    }, { once: true });
  }
}

/**
 * Cria o modal para exibir respostas da IA
 * @returns {HTMLElement} - O elemento do modal
 */
function createAIResponseModal() {
  const modal = document.createElement('div');
  modal.className = 'full-fill-ai-modal';
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  modal.style.zIndex = '10000';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'full-fill-ai-modal-content';
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '24px';
  modalContent.style.borderRadius = '8px';
  modalContent.style.maxWidth = '600px';
  modalContent.style.width = '90%';
  modalContent.style.maxHeight = '80vh';
  modalContent.style.overflowY = 'auto';
  modalContent.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
  modalContent.style.position = 'relative';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'full-fill-ai-modal-close';
  closeButton.innerHTML = '&times;';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '12px';
  closeButton.style.right = '12px';
  closeButton.style.background = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '24px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.color = '#666';
  closeButton.style.width = '32px';
  closeButton.style.height = '32px';
  closeButton.style.display = 'flex';
  closeButton.style.alignItems = 'center';
  closeButton.style.justifyContent = 'center';
  closeButton.style.borderRadius = '50%';
  closeButton.style.transition = 'background-color 0.2s';
  
  closeButton.addEventListener('mouseover', () => {
    closeButton.style.backgroundColor = '#f1f1f1';
  });
  
  closeButton.addEventListener('mouseout', () => {
    closeButton.style.backgroundColor = 'transparent';
  });
  
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  const title = document.createElement('h2');
  title.className = 'full-fill-ai-modal-title';
  title.textContent = 'Resposta da IA';
  title.style.marginTop = '0';
  title.style.marginBottom = '16px';
  title.style.color = '#2c3e50';
  title.style.fontSize = '20px';
  
  const content = document.createElement('div');
  content.className = 'full-fill-ai-modal-text';
  content.style.marginBottom = '24px';
  content.style.lineHeight = '1.6';
  content.style.color = '#333';
  
  const actionButtons = document.createElement('div');
  actionButtons.className = 'full-fill-ai-modal-actions';
  actionButtons.style.display = 'flex';
  actionButtons.style.justifyContent = 'flex-end';
  actionButtons.style.gap = '12px';
  
  const copyButton = document.createElement('button');
  copyButton.className = 'full-fill-ai-modal-copy';
  copyButton.textContent = 'Copiar';
  copyButton.style.padding = '8px 16px';
  copyButton.style.backgroundColor = '#f1f1f1';
  copyButton.style.border = 'none';
  copyButton.style.borderRadius = '4px';
  copyButton.style.cursor = 'pointer';
  copyButton.style.color = '#333';
  copyButton.style.fontWeight = '500';
  
  copyButton.addEventListener('mouseover', () => {
    copyButton.style.backgroundColor = '#e5e5e5';
  });
  
  copyButton.addEventListener('mouseout', () => {
    copyButton.style.backgroundColor = '#f1f1f1';
  });
  
  copyButton.addEventListener('click', () => {
    const text = content.textContent;
    navigator.clipboard.writeText(text).then(() => {
      copyButton.textContent = 'Copiado!';
      setTimeout(() => {
        copyButton.textContent = 'Copiar';
      }, 2000);
    });
  });
  
  const insertButton = document.createElement('button');
  insertButton.className = 'full-fill-ai-modal-insert';
  insertButton.textContent = 'Inserir';
  insertButton.style.padding = '8px 16px';
  insertButton.style.backgroundColor = '#3498db';
  insertButton.style.border = 'none';
  insertButton.style.borderRadius = '4px';
  insertButton.style.cursor = 'pointer';
  insertButton.style.color = 'white';
  insertButton.style.fontWeight = '500';
  
  insertButton.addEventListener('mouseover', () => {
    insertButton.style.backgroundColor = '#2980b9';
  });
  
  insertButton.addEventListener('mouseout', () => {
    insertButton.style.backgroundColor = '#3498db';
  });
  
  insertButton.addEventListener('click', () => {
    // Tenta identificar o campo de texto ativo
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || 
                          activeElement.tagName === 'INPUT' && activeElement.type === 'text')) {
      // Insere o texto no campo
      const text = content.textContent;
      
      // Determina a posição do cursor
      const startPos = activeElement.selectionStart;
      const endPos = activeElement.selectionEnd;
      
      // Insere o texto na posição atual do cursor
      activeElement.value = activeElement.value.substring(0, startPos) + 
                           text + 
                           activeElement.value.substring(endPos);
      
      // Atualiza a posição do cursor
      activeElement.selectionStart = activeElement.selectionEnd = startPos + text.length;
      
      // Dispara eventos para notificar mudanças
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      activeElement.dispatchEvent(new Event('change', { bubbles: true }));
      
      modal.style.display = 'none';
    } else {
      // Avisa ao usuário que precisa selecionar um campo
      alert('Por favor, selecione um campo de texto antes de inserir.');
    }
  });
  
  // Monta a estrutura do modal
  actionButtons.appendChild(copyButton);
  actionButtons.appendChild(insertButton);
  
  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(content);
  modalContent.appendChild(actionButtons);
  
  modal.appendChild(modalContent);
  
  // Fecha o modal ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  return modal;
}

/**
 * Exibe o modal com uma mensagem de carregamento
 */
function showAIResponseLoading() {
  const modal = document.querySelector('.full-fill-ai-modal');
  const content = modal.querySelector('.full-fill-ai-modal-text');
  
  modal.style.display = 'flex';
  content.innerHTML = '<div style="text-align: center; padding: 20px;"><div style="display: inline-block; width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: full-fill-spin 1s linear infinite;"></div><p style="margin-top: 10px;">Gerando resposta...</p></div>';
  
  // Adiciona o estilo da animação se ainda não existir
  if (!document.getElementById('full-fill-spinner-style')) {
    const style = document.createElement('style');
    style.id = 'full-fill-spinner-style';
    style.textContent = `
      @keyframes full-fill-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Exibe o modal com a resposta da IA
 * @param {string} response - Resposta gerada pela IA
 */
function showAIResponse(response) {
  const modal = document.querySelector('.full-fill-ai-modal');
  const content = modal.querySelector('.full-fill-ai-modal-text');
  
  modal.style.display = 'flex';
  content.innerHTML = formatResponse(response);
}

/**
 * Exibe o modal com uma mensagem de erro
 * @param {string} error - Mensagem de erro
 */
function showAIError(error) {
  const modal = document.querySelector('.full-fill-ai-modal');
  const content = modal.querySelector('.full-fill-ai-modal-text');
  
  modal.style.display = 'flex';
  content.innerHTML = `<div style="color: #721c24; background-color: #f8d7da; padding: 12px; border-radius: 4px; border: 1px solid #f5c6cb; margin-bottom: 16px;">
    <strong>Erro:</strong> ${error}
  </div>`;
}

/**
 * Formata a resposta da IA para exibição
 * @param {string} text - Texto da resposta
 * @returns {string} - HTML formatado
 */
function formatResponse(text) {
  // Substitui quebras de linha por <br>
  return text.replace(/\n/g, '<br>');
} 