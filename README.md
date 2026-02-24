# ⚡ PromptWrapper

> **Inject pre-set professional prompts into ChatGPT — right from a sleek sidebar.**

PromptWrapper is a minimal, privacy-first Chrome extension that adds a sidebar to ChatGPT. Pick a preset role (Tutor, Designer, Coach…), type your question, and send — the extension prepends the right system prompt automatically.

**No backend. No API keys. No tracking. 100% client-side. MIT License.**

---

## 📸 What It Looks Like

The extension injects a fixed sidebar on the right side of chat.openai.com:

```
┌─────────────────────────────────────────────────────────────┐
│                ChatGPT interface                  │ Sidebar │
│                                                   │         │
│                                                   │ ⚡ Prompt│
│                                                   │ Wrapper │
│                                                   │ ─────── │
│                                                   │ Preset ▾│
│                                                   │ 📚 Tutor│
│                                                   │ ─────── │
│                                                   │ Your Q: │
│                                                   │ [     ] │
│                                                   │         │
│                                                   │ ▶ Run   │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🎭 **10 Preset Roles** | Tutor, Designer, Career Coach, Code Reviewer, Product Manager, Socratic Guide, Writing Coach, Translator, Devil's Advocate, ELI5 |
| 💾 **Persistent state** | Last-used preset and your typed content survive page refreshes |
| 👁️ **Live preview** | Collapsible preview shows the full assembled prompt before you send |
| 🔒 **Privacy-first** | Zero network requests, zero analytics, zero external dependencies |
| 🧑‍💻 **Beginner-friendly** | Plain HTML/CSS/JS — no build step, no framework, no bundler |
| 📝 **Easy customization** | Edit `prompts.json` to add your own presets — no code required |

---

## 📦 Folder Structure

```
prompt-wrapper/
├── manifest.json       # Extension config (Manifest V3)
├── content.js          # Injected into ChatGPT — creates sidebar, handles injection
├── sidebar.html        # Sidebar UI markup
├── sidebar.css         # Sidebar styles (dark theme)
├── sidebar.js          # Sidebar logic (loads presets, sends prompt)
├── prompts.json        # All preset prompt templates
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## 🚀 Installation (Developer Mode)

Chrome extensions can be loaded unpacked without publishing to the Web Store:

1. **Download or clone this repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/prompt-wrapper.git
   ```

2. **Open Chrome Extensions**
   - Go to `chrome://extensions/` in your browser

3. **Enable Developer Mode**
   - Toggle the **"Developer mode"** switch in the top-right corner ✅

4. **Load the extension**
   - Click **"Load unpacked"**
   - Select the `prompt-wrapper/` folder

5. **Open ChatGPT**
   - Navigate to [https://chat.openai.com](https://chat.openai.com) or [https://chatgpt.com](https://chatgpt.com)
   - The PromptWrapper sidebar will appear on the right side automatically

6. **Use it!**
   - Choose a preset from the dropdown
   - Type your question or paste your content
   - Click **"▶ Run with Preset"**

> 💡 **Tip:** After any code changes, go to `chrome://extensions/` and click the 🔄 refresh icon on the PromptWrapper card.

---

## 🧠 How It Works

```
User clicks "Run with Preset"
         │
         ▼
sidebar.js assembles: [preset template] + [user input]
         │
         ▼  postMessage()
content.js receives the message
         │
         ▼
Finds ChatGPT's contenteditable input div
         │
         ▼
Injects the combined prompt text via execCommand
         │
         ▼
Clicks the ChatGPT Send button (or simulates Enter)
```

**Key decisions:**
- **iframe for the sidebar**: Keeps PromptWrapper's CSS isolated from ChatGPT's styles. No specificity wars.
- **postMessage bridge**: The standard, secure way for an iframe to talk to its parent page.
- **`execCommand("insertText")`**: Required for contenteditable elements that use React — direct `.textContent =` bypasses React's state and the Send button stays disabled.
- **No background script**: Not needed for this MVP, which keeps permissions minimal.
- **`chrome.storage.local`**: Persists UI state (last preset + last typed content) across page reloads without any server.

---

## ✏️ Adding Your Own Presets

Open `prompts.json` and add a new entry to the `"prompts"` array:

```json
{
  "id": "my-custom-preset",
  "label": "🚀 My Custom Preset",
  "description": "A short description shown in the sidebar",
  "template": "You are a [describe the role]. [Describe what you want the AI to do]. Here is the input:\n\n"
}
```

Save the file, reload the extension at `chrome://extensions/`, and your preset appears in the dropdown.

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| Sidebar doesn't appear | Make sure the extension is loaded and enabled at `chrome://extensions/` |
| "Could not find the ChatGPT input box" | ChatGPT may have updated their DOM selectors. [Open an issue](https://github.com/YOUR_USERNAME/prompt-wrapper/issues) |
| Prompt doesn't send | Try clicking the Run button again — ChatGPT sometimes needs a moment to enable the Send button |
| Styles look broken | Hard-refresh ChatGPT with `Cmd+Shift+R` / `Ctrl+Shift+R` |

---

## 🗺️ Roadmap (Not Yet Implemented)

- [ ] Multiple LLM support (Claude, Gemini, Perplexity, etc.)
- [ ] Custom prompt packs (import/export JSON)
- [ ] Favorites / pinned presets
- [ ] Community prompt library
- [ ] Per-preset keyboard shortcuts
- [ ] Dark/light theme toggle

---

## 🤝 Contributing

Pull requests are welcome! This project is intentionally beginner-friendly:
- No build tools required
- Plain HTML/CSS/JS
- Clear comments throughout

```bash
# Fork, clone, make changes, then reload at chrome://extensions/
```

---

## 📜 License

MIT © 2025 — Free to use, modify, and distribute.

---

<p align="center">Made with ⚡ for anyone who talks to LLMs every day</p>
