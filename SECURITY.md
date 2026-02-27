# Security Policy

## Privacy & Data Security

**Promptify** is built with a "Privacy-First" architecture. Here is how we protect your data:

1.  **100% Client-Side**: All prompt assembly and injection happen entirely within your browser's local environment.
2.  **No Backend**: There is no remote server, no database, and no API that receives your prompts or personal information.
3.  **No Tracking**: We do not use any analytics, telemetry, or tracking scripts (no Google Analytics, no Mixpanel, etc.).
4.  **Local Storage only**: Your last-used preset and input are stored locally using `chrome.storage.local`. This data never leaves your machine and is only used to provide a better user experience upon page reload.
5.  **No Network Calls**: The extension does not make any external network requests other than loading its own internal files.

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please open an issue or contact the maintainers directly. Given the extension's local nature, security risks are minimal, but we take all reports seriously.

---

### Data Handling Summary
| Data Type | Stored? | Where? | Shared? |
| :--- | :--- | :--- | :--- |
| Your Prompts | No | N/A | Never |
| Last Preset | Yes | `chrome.storage.local` | Never |
| Last Input Text | Yes | `chrome.storage.local` | Never |
| User Identity | No | N/A | Never |
