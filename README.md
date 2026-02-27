# ⚡ Promptify

> **Inject pre-set professional prompts into ChatGPT — right from a sleek sidebar.**

Promptify is a minimal, privacy-first Chrome extension that adds a sidebar to ChatGPT. Pick a preset role (Tutor, Designer, Coach…), type your question, and send — the extension prepends the right system prompt automatically.

**No backend. No API keys. No tracking. 100% client-side. MIT License.**

---

## ✨ Features

- 🎭 **10 Preset Roles**: Tutor, Designer, Career Coach, Code Reviewer, Product Manager, Socratic Guide, Writing Coach, Translator, Devil's Advocate, and ELI5.
- 💾 **Persistent State**: Your last-used preset and typed content survive page refreshes.
- 👁️ **Live Preview**: Collapsible preview shows the full assembled prompt before you send.
- 🔄 **Smart Toggle**: Close the sidebar with the 'X' button and re-open it anytime using the floating **⚡ tab** or by clicking the extension icon in your toolbar.
- 🔒 **Privacy-First**: No data is ever sent to any server. Everything happens on your machine.
- 🧑‍💻 **Open Source**: Clean, beginner-friendly code with no complex build steps.

---

## 🚀 Installation (Developer Mode)

Since this is an open-source project, you can load it directly into Chrome:

1. **Download or Clone** this repository to your computer.
2. **Open Chrome Extensions**: Navigate to `chrome://extensions/` in your browser.
3. **Enable Developer Mode**: Flip the switch in the top-right corner.
4. **Load Unpacked**: Click the "Load unpacked" button and select the `prompt-wrapper` folder.
5. **Start Prompting**: Open [ChatGPT](https://chatgpt.com) and you'll see the Promptify sidebar on the right!

---

## 📦 Folder Structure

```text
prompt-wrapper/
├── manifest.json       # Extension configuration (Manifest V3)
├── content.js          # Injected logic (sidebar creation & prompt injection)
├── background.js       # Handles extension icon click events
├── sidebar.html        # Sidebar UI structure
├── sidebar.css         # Modern dark-themed styles
├── sidebar.js          # Sidebar logic & prompt assembly
├── prompts.json        # Customizable prompt templates
├── icons/              # Extension icons (16, 48, 128px)
├── LICENSE             # MIT License
└── README.md           # Project documentation
```

---

## 🛠️ Customizing Prompts

You can easily add your own professional prompts! Just open `prompts.json` and add a new entry to the array:

```json
{
  "id": "my-custom-role",
  "label": "🚀 My Custom Role",
  "description": "Explains what this preset does",
  "template": "You are a [ROLE]. Please perform [TASK]. Here is my input:\n\n"
}
```
*Note: After editing the file, remember to click the **Reload** icon on the extension card in `chrome://extensions/`.*

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">Made with ⚡ for the open-source community</p>
