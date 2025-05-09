# Full Fill - Extensão para o Chrome

Uma extensão para Google Chrome que permite preencher formulários automaticamente e gerar respostas profissionais usando IA.

## Funcionalidades

- **Cadastro de dados pessoais**: Armazene seus dados pessoais e profissionais de forma segura no navegador.
- **Preenchimento automático**: Detecte automaticamente campos em formulários web e preencha-os com um clique.
- **Respostas com IA**: Use IA para gerar respostas profissionais ao selecionar um texto em qualquer página.
- **Suporte a múltiplos provedores de IA**: Escolha entre OpenAI (GPT-4), Anthropic (Claude), DeepSeek (R1) ou OpenRouter (acesso a múltiplos modelos) para gerar respostas.

## Instalação

### Método 1: Carregar extensão descompactada (para desenvolvimento)

1. Clone ou baixe este repositório para seu computador.
2. Abra o Google Chrome e navegue até `chrome://extensions/`.
3. Ative o "Modo do desenvolvedor" no canto superior direito.
4. Clique em "Carregar sem compactação" e selecione a pasta do projeto.
5. A extensão deve aparecer na barra de ferramentas do Chrome.

### Método 2: Empacotar e instalar (para uso pessoal)

1. Clone ou baixe este repositório para seu computador.
2. Abra o Google Chrome e navegue até `chrome://extensions/`.
3. Ative o "Modo do desenvolvedor" no canto superior direito.
4. Clique em "Empacotar extensão" e selecione a pasta do projeto.
5. Instale o arquivo .crx gerado arrastando-o para a página de extensões do Chrome.

## Configuração

### Dados pessoais

1. Clique no ícone da extensão na barra de ferramentas do Chrome.
2. Na aba "Meu Perfil", preencha seus dados pessoais e profissionais.
3. Clique em "Salvar" para armazenar suas informações.

### Configuração da IA

1. Clique no ícone da extensão na barra de ferramentas do Chrome.
2. Navegue até a aba "Configurações".
3. Selecione o provedor de IA de sua preferência (OpenAI, Anthropic, DeepSeek ou OpenRouter).
4. Insira sua chave de API:
   - Para OpenAI: Obtenha em [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Para Anthropic: Obtenha em [https://console.anthropic.com/](https://console.anthropic.com/)
   - Para DeepSeek: Obtenha em [https://platform.deepseek.com/](https://platform.deepseek.com/)
   - Para OpenRouter: Obtenha em [https://openrouter.ai/keys](https://openrouter.ai/keys)
5. Se você escolher o OpenRouter, selecione também o modelo específico que deseja usar.
6. Clique em "Salvar" para armazenar suas configurações.

## Como usar

### Preenchimento automático de formulários

1. Navegue até um site com formulários.
2. Os campos compatíveis com seus dados armazenados serão destacados.
3. Um ícone ⚡ aparecerá nos campos detectados.
4. Clique no ícone para preencher o campo automaticamente.

### Geração de respostas com IA

1. Em qualquer página web, selecione um texto para o qual deseja uma resposta.
2. Clique com o botão direito e selecione "Gerar resposta profissional com IA".
3. Aguarde enquanto a IA gera uma resposta.
4. Quando a resposta aparecer, você pode:
   - Copiar a resposta para a área de transferência
   - Inserir a resposta diretamente em um campo de texto ativo

## Segurança e privacidade

- **Armazenamento local**: Seus dados pessoais são armazenados apenas localmente no seu navegador.
- **Chaves de API**: Suas chaves de API são armazenadas localmente e usadas apenas para as solicitações aos serviços de IA.
- **Sem rastreamento**: A extensão não rastreia sua navegação ou envia dados para servidores externos (exceto as solicitações diretas às APIs de IA).

## Sobre o OpenRouter

O OpenRouter é um serviço que oferece acesso unificado a centenas de modelos de IA através de um único endpoint, gerenciando automaticamente fallbacks e selecionando as opções mais econômicas. Através desta opção, você pode acessar modelos de várias empresas como OpenAI, Anthropic, Google, Meta, e Mistral, sem precisar criar contas em cada um desses serviços.

A extensão inclui suporte para diversos modelos através do OpenRouter, incluindo:
- OpenAI GPT-4o
- Anthropic Claude 3 Opus e Sonnet
- Google Gemini Pro e Gemini 1.5 Flash (versão gratuita)
- Meta Llama 3 70B
- Mistral Large
- DeepSeek Coder, Chat e LLM 67B

Ao usar o OpenRouter, você precisa apenas de uma única chave de API para acessar todos esses modelos, simplificando o gerenciamento de credenciais e permitindo escolher o modelo mais adequado para cada situação.

## Requisitos para desenvolvimento

- Google Chrome versão 88 ou superior
- Conta em um provedor de IA (OpenAI, Anthropic, DeepSeek ou OpenRouter) com chave de API válida

## Solução de problemas

### A extensão não detecta campos no formulário

- Verifique se você preencheu corretamente seus dados na aba "Meu Perfil".
- Alguns sites usam estruturas de formulário não-padrão que podem não ser detectadas automaticamente.

### Erro ao gerar resposta com IA

- Verifique se a chave de API está correta e válida.
- Confirme se o provedor de IA selecionado está disponível e sem interrupções.
- Se estiver usando o OpenRouter, verifique se o modelo selecionado está disponível.
- Verifique se sua conexão com a internet está funcionando corretamente.

## Limitações conhecidas

- A detecção automática de campos pode não funcionar em sites com estruturas de formulário altamente personalizadas.
- O preenchimento automático pode não funcionar em formulários dinâmicos que usam JavaScript para validação.
- A inserção de respostas da IA funciona melhor em campos de texto simples e áreas de texto.

## Desenvolvimento futuro

Melhorias planejadas para versões futuras:

- Suporte a mais provedores de IA
- Melhoria na detecção de campos de formulário
- Interface para edição por lotes de múltiplos perfis
- Sincronização entre dispositivos (via conta Google)
- Suporte a preenchimento de formulários complexos (endereços, cartões de crédito, etc.)

## Gerando os ícones da extensão

A extensão inclui uma ferramenta para gerar ícones baseados no símbolo de raio (⚡) que é utilizado na interface:

1. Abra o arquivo `images/generate_icons.html` em seu navegador
2. Os ícones serão gerados automaticamente em três tamanhos: 16x16, 48x48 e 128x128 pixels
3. Clique nos links "Baixar" abaixo de cada ícone para salvar o PNG correspondente
4. Substitua os arquivos placeholder na pasta `images` pelos ícones baixados:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

Os ícones são gerados utilizando HTML Canvas e podem ser baixados diretamente do navegador, sem necessidade de ferramentas externas.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes. 