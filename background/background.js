// Configuração inicial
let settingsData = {
  aiProvider: 'openai',
  apiKey: '',
  autoFillEnabled: true,
  aiContextMenu: true
};

// Carrega as configurações salvas
loadSettings();

// Cria o item de menu de contexto
createContextMenu();

// Ouvinte para mensagens de outros scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'settingsUpdated') {
    settingsData = message.settings;
    
    // Atualiza o menu de contexto com base nas novas configurações
    if (settingsData.aiContextMenu) {
      createContextMenu();
    } else {
      chrome.contextMenus.removeAll();
    }
  } else if (message.action === 'generateAIResponse') {
    generateAIResponse(message.selectedText)
      .then(response => {
        sendResponse({ success: true, response });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Importante para mensagens assíncronas
  } else if (message.action === 'getProfileData') {
    chrome.storage.sync.get('profileData', result => {
      sendResponse({ profileData: result.profileData || {} });
    });
    return true; // Importante para mensagens assíncronas
  }
});

/**
 * Carrega as configurações salvas
 */
function loadSettings() {
  chrome.storage.sync.get('settingsData', (result) => {
    if (result.settingsData) {
      settingsData = result.settingsData;
      
      // Atualiza o menu de contexto
      if (settingsData.aiContextMenu) {
        createContextMenu();
      } else {
        chrome.contextMenus.removeAll();
      }
    }
  });
}

/**
 * Cria o item de menu de contexto
 */
function createContextMenu() {
  // Primeiro remove todos os menus existentes para evitar duplicações
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'generateAIResponse',
      title: 'Gerar resposta profissional com IA',
      contexts: ['selection']
    });
  });
}

// Ouvinte para cliques no menu de contexto
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'generateAIResponse') {
    // Injeta um script na página para abrir um modal com a resposta
    chrome.tabs.sendMessage(tab.id, {
      action: 'generateAIResponse',
      selectedText: info.selectionText
    });
    
    // Também geramos a resposta aqui no background
    generateAIResponse(info.selectionText)
      .then(response => {
        // Enviamos a resposta para o content script
        chrome.tabs.sendMessage(tab.id, {
          action: 'displayAIResponse',
          response
        });
      })
      .catch(error => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'displayAIError',
          error: error.message
        });
      });
  }
});

/**
 * Gera uma resposta usando a API de IA selecionada
 * @param {string} prompt - O texto selecionado pelo usuário
 * @returns {Promise<string>} - A resposta gerada pela IA
 */
async function generateAIResponse(prompt) {
  // Verifica se a chave da API está configurada
  if (!settingsData.apiKey) {
    throw new Error('Chave de API não configurada. Por favor, configure nas Configurações da extensão.');
  }
  
  // Prepara o prompt completo para a IA
  const fullPrompt = `Gere uma resposta profissional para o seguinte texto: "${prompt}"`;
  
  try {
    if (settingsData.aiProvider === 'openai') {
      return await callOpenAI(fullPrompt);
    } else if (settingsData.aiProvider === 'anthropic') {
      return await callAnthropic(fullPrompt);
    } else {
      throw new Error('Provedor de IA não suportado');
    }
  } catch (error) {
    console.error('Erro ao gerar resposta:', error);
    throw new Error('Erro ao gerar resposta. Verifique sua chave de API e tente novamente.');
  }
}

/**
 * Chama a API da OpenAI (GPT-4)
 * @param {string} prompt - O prompt preparado
 * @returns {Promise<string>} - A resposta gerada
 */
async function callOpenAI(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settingsData.apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Você é um assistente profissional que ajuda a redigir respostas formais e adequadas para o ambiente de trabalho.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Erro da API OpenAI: ${errorData.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

/**
 * Chama a API da Anthropic (Claude)
 * @param {string} prompt - O prompt preparado
 * @returns {Promise<string>} - A resposta gerada
 */
async function callAnthropic(prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': settingsData.apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-2',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Erro da API Anthropic: ${errorData.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  return data.content[0].text.trim();
}

// Ouvinte para instalação da extensão
chrome.runtime.onInstalled.addListener(() => {
  createContextMenu();
}); 