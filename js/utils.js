/**
 * Funções utilitárias para a extensão Full Fill
 */

/**
 * Função para criptografar dados sensíveis
 * @param {string} text - Texto a ser criptografado
 * @param {string} key - Chave para criptografia (opcional)
 * @returns {string} - Texto criptografado
 */
function encryptData(text, key = 'full-fill-secret-key') {
  // Implementação simples de criptografia para demonstração
  // Em produção, use bibliotecas de criptografia mais robustas
  try {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).slice(-2);
    const applySaltToChar = code => textToChars(key).reduce((a, b) => a ^ b, code);

    return text
      .split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
  } catch (e) {
    console.error('Erro ao criptografar:', e);
    return text; // Retorna o texto original em caso de erro
  }
}

/**
 * Função para descriptografar dados sensíveis
 * @param {string} encoded - Texto criptografado
 * @param {string} key - Chave para descriptografia (opcional)
 * @returns {string} - Texto descriptografado
 */
function decryptData(encoded, key = 'full-fill-secret-key') {
  // Implementação simples de descriptografia para demonstração
  // Em produção, use bibliotecas de criptografia mais robustas
  try {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(key).reduce((a, b) => a ^ b, code);
    
    return encoded
      .match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('');
  } catch (e) {
    console.error('Erro ao descriptografar:', e);
    return encoded; // Retorna o texto criptografado em caso de erro
  }
}

/**
 * Validator para verificar se um e-mail é válido
 * @param {string} email - Email a ser validado
 * @returns {boolean} - Se o email é válido ou não
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validator para verificar se um número de telefone é válido
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} - Se o telefone é válido ou não
 */
function isValidPhone(phone) {
  // Aceita diversos formatos de telefone com ou sem código de país
  const phoneRegex = /^(\+\d{1,3})?[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{4}$/;
  return phoneRegex.test(phone);
}

/**
 * Gera um ID único para uso interno
 * @returns {string} - ID único
 */
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Formata uma data para exibição localizada
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} - Data formatada
 */
function formatDate(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Debounce uma função para evitar múltiplas chamadas rápidas
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} - Função com debounce
 */
function debounce(func, wait = 300) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Exporta as funções para uso em outros scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    encryptData,
    decryptData,
    isValidEmail,
    isValidPhone,
    generateUniqueId,
    formatDate,
    debounce
  };
} 