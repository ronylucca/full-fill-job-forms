# Full Fill - Chrome Extension

A Google Chrome extension that allows you to automatically fill forms and generate professional responses using AI.

## Features

- **Personal data storage**: Store your personal and professional information securely in your browser.
- **Automatic form filling**: Automatically detect fields in web forms and fill them with a click.
- **AI-powered responses**: Use AI to generate professional responses when selecting text on any page.
- **Multiple AI providers support**: Choose between OpenAI (GPT-4), Anthropic (Claude), DeepSeek (R1), or OpenRouter (access to multiple models) to generate responses.

## Installation

### Method 1: Load unpacked extension (for development)

1. Clone or download this repository to your computer.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the project folder.
5. The extension should appear in the Chrome toolbar.

### Method 2: Package and install (for personal use)

1. Clone or download this repository to your computer.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Pack extension" and select the project folder.
5. Install the generated .crx file by dragging it to the Chrome extensions page.

## Configuration

### Personal data

1. Click on the extension icon in the Chrome toolbar.
2. In the "My Profile" tab, fill in your personal and professional information.
3. Click "Save" to store your information.

### AI Configuration

1. Click on the extension icon in the Chrome toolbar.
2. Navigate to the "Settings" tab.
3. Select your preferred AI provider (OpenAI, Anthropic, DeepSeek, or OpenRouter).
4. Enter your API key:
   - For OpenAI: Get it at [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - For Anthropic: Get it at [https://console.anthropic.com/](https://console.anthropic.com/)
   - For DeepSeek: Get it at [https://platform.deepseek.com/](https://platform.deepseek.com/)
   - For OpenRouter: Get it at [https://openrouter.ai/keys](https://openrouter.ai/keys)
5. If you choose OpenRouter, also select the specific model you want to use.
6. Click "Save" to store your settings.

## How to use

### Automatic form filling

1. Navigate to a website with forms.
2. Fields compatible with your stored data will be highlighted.
3. A ⚡ icon will appear in detected fields.
4. Click on the icon to automatically fill the field.

### Generating AI responses

1. On any web page, select text for which you want a response.
2. Right-click and select "Generate professional response with AI".
3. Wait while the AI generates a response.
4. When the response appears, you can:
   - Copy the response to the clipboard
   - Insert the response directly into an active text field

## Security and privacy

- **Local storage**: Your personal data is stored only locally in your browser.
- **API keys**: Your API keys are stored locally and used only for requests to AI services.
- **No tracking**: The extension does not track your browsing or send data to external servers (except direct requests to AI APIs).

## About OpenRouter

OpenRouter is a service that offers unified access to hundreds of AI models through a single endpoint, automatically handling fallbacks and selecting the most cost-effective options. Through this option, you can access models from various companies such as OpenAI, Anthropic, Google, Meta, and Mistral, without having to create accounts with each of these services.

The extension includes support for various models through OpenRouter, including:
- OpenAI GPT-4o
- Anthropic Claude 3 Opus and Sonnet
- Google Gemini Pro and Gemini 1.5 Flash (free version)
- Meta Llama 3 70B
- Mistral Large
- DeepSeek Coder, Chat and LLM 67B

When using OpenRouter, you only need a single API key to access all these models, simplifying credential management and allowing you to choose the most suitable model for each situation.

## Generating the extension icons

The extension includes a tool to generate icons based on the lightning bolt symbol (⚡) used in the interface:

1. Open the `images/generate_icons.html` file in your browser
2. The icons will be automatically generated in three sizes: 16x16, 48x48, and 128x128 pixels
3. Click on the "Download" links below each icon to save the corresponding PNG
4. Replace the placeholder files in the `images` folder with the downloaded icons:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

The icons are generated using HTML Canvas and can be downloaded directly from the browser, without the need for external tools.

## Development requirements

- Google Chrome version 88 or higher
- Account with an AI provider (OpenAI, Anthropic, DeepSeek, or OpenRouter) with a valid API key

## Troubleshooting

### The extension doesn't detect fields in the form

- Check if you correctly filled your data in the "My Profile" tab.
- Some sites use non-standard form structures that may not be automatically detected.

### Error generating AI response

- Check if the API key is correct and valid.
- Confirm if the selected AI provider is available and without interruptions.
- If using OpenRouter, check if the selected model is available.
- Check if your internet connection is working properly.

## Known limitations

- Automatic field detection may not work on sites with highly customized form structures.
- Automatic filling may not work on dynamic forms that use JavaScript for validation.
- Inserting AI responses works best in simple text fields and text areas.

## Future development

Planned improvements for future versions:

- Support for more AI providers
- Improved form field detection
- Interface for batch editing of multiple profiles
- Cross-device synchronization (via Google account)
- Support for filling complex forms (addresses, credit cards, etc.)

## License

This project is licensed under the MIT License. See the LICENSE file for more details. 