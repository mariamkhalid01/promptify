// =============================================================
// sidebar.js — PromptWrapper Sidebar Logic
// Runs inside sidebar.html (inside the <iframe>)
// Responsibilities:
//   1. Load prompts.json and populate the preset dropdown
//   2. Restore the last-used preset from chrome.storage.local
//   3. Build a preview of the full assembled prompt
//   4. On "Run", post a message to content.js with the final prompt
// =============================================================

(function () {
    "use strict";

    // ── DOM references ────────────────────────────────────────
    const presetSelect = document.getElementById("preset-select");
    const presetDesc = document.getElementById("preset-description");
    const userInput = document.getElementById("user-input");
    const charCount = document.getElementById("char-count");
    const previewToggle = document.getElementById("preview-toggle");
    const previewBox = document.getElementById("preview-box");
    const previewContent = document.getElementById("preview-content");
    const runBtn = document.getElementById("run-btn");
    const statusMsg = document.getElementById("status-msg");
    const closeBtn = document.getElementById("close-btn");

    // ── State ─────────────────────────────────────────────────
    let prompts = []; // array loaded from prompts.json

    // ── 1. Load prompts.json ──────────────────────────────────
    /**
     * chrome.runtime.getURL resolves the file path within the extension bundle.
     * We fetch it as JSON even though it's a local file — this works
     * because web_accessible_resources in manifest.json whitelists it.
     */
    const promptsUrl = chrome.runtime.getURL("prompts.json");

    fetch(promptsUrl)
        .then((res) => {
            if (!res.ok) throw new Error("Failed to load prompts.json");
            return res.json();
        })
        .then((data) => {
            prompts = data.prompts;
            populateDropdown(prompts);
            restoreLastPreset(); // after populating, restore saved state
        })
        .catch((err) => {
            console.error("[PromptWrapper] Could not load prompts.json:", err);
            showStatus("⚠️ Could not load presets. Check prompts.json.", "error");
        });

    // ── 2. Populate the dropdown ──────────────────────────────
    function populateDropdown(promptList) {
        // Remove the loading placeholder
        presetSelect.innerHTML = "";

        // Add a blank default option
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "— Select a preset —";
        placeholder.disabled = true;
        placeholder.selected = true;
        presetSelect.appendChild(placeholder);

        // Add one <option> per prompt template
        promptList.forEach((prompt) => {
            const opt = document.createElement("option");
            opt.value = prompt.id;
            opt.textContent = prompt.label;
            presetSelect.appendChild(opt);
        });
    }

    // ── 3. Restore last-used preset from storage ──────────────
    function restoreLastPreset() {
        chrome.storage.local.get(["lastPreset", "lastInput"], (result) => {
            if (result.lastPreset) {
                presetSelect.value = result.lastPreset;
                updateDescription(result.lastPreset);
            }
            if (result.lastInput) {
                userInput.value = result.lastInput;
                charCount.textContent = result.lastInput.length;
            }
            updatePreview();
        });
    }

    // ── 4. Helper: get the selected prompt object ─────────────
    function getSelectedPrompt() {
        const id = presetSelect.value;
        return prompts.find((p) => p.id === id) || null;
    }

    // ── 5. Update the description text under the dropdown ─────
    function updateDescription(id) {
        const prompt = prompts.find((p) => p.id === id);
        presetDesc.textContent = prompt ? prompt.description : "";
    }

    // ── 6. Build the full assembled prompt text ───────────────
    function assemblePrompt() {
        const preset = getSelectedPrompt();
        if (!preset) return "";
        const userText = userInput.value.trim();
        // Combine: preset template + user content
        return preset.template + userText;
    }

    // ── 7. Update the live preview box ───────────────────────
    function updatePreview() {
        const full = assemblePrompt();
        previewContent.textContent = full || "(Select a preset and type your content to see a preview)";
    }

    // ── 8. Show a status message (auto-hides after 3s) ────────
    function showStatus(message, type = "success") {
        statusMsg.textContent = message;
        statusMsg.className = `status-msg ${type}`;
        statusMsg.hidden = false;
        setTimeout(() => {
            statusMsg.hidden = true;
        }, 3500);
    }

    // ── Event Listeners ───────────────────────────────────────

    // Preset dropdown change
    presetSelect.addEventListener("change", () => {
        const id = presetSelect.value;
        updateDescription(id);
        updatePreview();
        // Persist the selection
        chrome.storage.local.set({ lastPreset: id });
    });

    // Textarea input: update char count, preview, and persist
    userInput.addEventListener("input", () => {
        charCount.textContent = userInput.value.length;
        updatePreview();
        // Debounced persistence (avoid writing on every keystroke)
        clearTimeout(userInput._saveTimer);
        userInput._saveTimer = setTimeout(() => {
            chrome.storage.local.set({ lastInput: userInput.value });
        }, 500);
    });

    // Collapsible preview toggle
    previewToggle.addEventListener("click", () => {
        const isExpanded = previewToggle.getAttribute("aria-expanded") === "true";
        previewToggle.setAttribute("aria-expanded", String(!isExpanded));
        previewBox.hidden = isExpanded;
    });

    // ── 9. Run button ─────────────────────────────────────────
    runBtn.addEventListener("click", () => {
        const preset = getSelectedPrompt();

        // Validation
        if (!preset) {
            showStatus("⚠️ Please select a preset first.", "error");
            presetSelect.focus();
            return;
        }

        const userText = userInput.value.trim();
        if (!userText) {
            showStatus("⚠️ Please type your content or question.", "error");
            userInput.focus();
            return;
        }

        const fullPrompt = assemblePrompt();

        // Disable the button to prevent double-click during submission
        runBtn.disabled = true;
        runBtn.textContent = "Sending…";

        /**
         * Post a message to the parent page (content.js).
         * `window.parent` refers to the ChatGPT tab page that embeds this iframe.
         * `"*"` is safe here since content.js validates the message source.
         */
        window.parent.postMessage(
            { type: "inject-prompt", prompt: fullPrompt },
            "*"
        );

        // Re-enable after a short delay (ChatGPT submission takes ~200ms)
        setTimeout(() => {
            runBtn.disabled = false;
            runBtn.innerHTML = '<span class="run-icon">▶</span> Run with Preset';
            showStatus("✅ Prompt sent! Check the chat.", "success");
        }, 800);
    });

    // ── 10. Close button ──────────────────────────────────────
    // Tells content.js to hide the sidebar iframe and restore the page margin.
    closeBtn.addEventListener("click", () => {
        window.parent.postMessage({ type: "close-sidebar" }, "*");
    });

})();
