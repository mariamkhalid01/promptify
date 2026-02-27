// =============================================================
// content.js — PromptWrapper Content Script
// Injected by Chrome into chat.openai.com / chatgpt.com
// Responsibilities:
//   1. Create and attach a sidebar <iframe> to the page
//   2. Listen for messages from sidebar.js (the iframe)
//   3. Write the combined prompt into ChatGPT's textarea and submit it
// =============================================================

(function () {
  "use strict";

  // ── 1. Guard and setup message listener ─────────────────────
  if (window.hasBeenInjected) return;
  window.hasBeenInjected = true;

  // Listen for messages from the background script (extension icon clicks)
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle-sidebar") {
      // If hidden or partially hidden, open it.
      if (sidebar.style.opacity === "0" || !document.body.contains(sidebar)) {
        openSidebar();
      } else {
        closeSidebar();
      }
    }
  });

  // ── 2. Build the sidebar container ──────────────────────────
  // We use an <iframe> so sidebar CSS never conflicts with ChatGPT's styles.
  const sidebar = document.createElement("iframe");
  sidebar.id = "prompt-wrapper-sidebar";
  sidebar.src = chrome.runtime.getURL("sidebar.html");

  // Style the sidebar: fixed, right-aligned, full height
  Object.assign(sidebar.style, {
    position: "fixed",
    top: "0",
    right: "0",
    width: "320px",
    height: "100vh",
    border: "none",
    zIndex: "999999",
    boxShadow: "-4px 0 24px rgba(0,0,0,0.18)",
    borderRadius: "0",
    background: "transparent",
    transition: "transform 0.3s ease, opacity 0.3s ease",
  });

  document.body.appendChild(sidebar);

  // ── 3. Create a floating toggle tab (initially hidden) ──────
  const toggleTab = document.createElement("div");
  toggleTab.id = "prompt-wrapper-toggle";
  toggleTab.textContent = "⚡";
  Object.assign(toggleTab.style, {
    position: "fixed",
    top: "50%",
    right: "0",
    width: "32px",
    height: "40px",
    background: "#7c6aff",
    color: "#fff",
    display: "none", // Hidden while sidebar is open
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    cursor: "pointer",
    zIndex: "999999",
    borderRadius: "8px 0 0 8px",
    boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
    transition: "transform 0.2s ease",
  });

  toggleTab.onmouseenter = () => toggleTab.style.transform = "translateX(-4px)";
  toggleTab.onmouseleave = () => toggleTab.style.transform = "translateX(0)";
  toggleTab.onclick = () => openSidebar();

  document.body.appendChild(toggleTab);

  // ── 4. Functions to toggle sidebar visibility ──────────────
  function openSidebar() {
    sidebar.style.transform = "translateX(0)";
    sidebar.style.opacity = "1";
    document.body.style.marginRight = "320px";
    toggleTab.style.display = "none";
  }

  function closeSidebar() {
    sidebar.style.transform = "translateX(100%)";
    sidebar.style.opacity = "0";
    document.body.style.marginRight = "0";
    // Show the toggle tab after sidebar animation
    setTimeout(() => {
      toggleTab.style.display = "flex";
    }, 300);
  }

  // Initial space allocation
  document.body.style.marginRight = "320px";
  document.body.style.transition = "margin-right 0.3s ease";

  // ── 5. Listen for messages from sidebar.js ──────────────────
  window.addEventListener("message", (event) => {
    // Security: only accept messages originating from our extension
    if (event.source !== sidebar.contentWindow) return;
    if (!event.data || !event.data.type) return;

    if (event.data.type === "inject-prompt") {
      injectAndSubmit(event.data.prompt);
    }

    if (event.data.type === "close-sidebar") {
      closeSidebar();
    }
  });

  // ── 5. Core injection logic ──────────────────────────────────
  /**
   * Finds ChatGPT's textarea, sets its value to `text`,
   * then programmatically clicks the Send button.
   *
   * ChatGPT uses a contenteditable <div> (not a real <textarea>),
   * so we use React's synthetic event trick to update its state.
   *
   * @param {string} text — The fully assembled prompt to inject
   */
  function injectAndSubmit(text) {
    // ChatGPT's prompt input is a contenteditable <div> with id="prompt-textarea"
    // (selector may need updating if OpenAI changes their DOM)
    const inputEl =
      document.querySelector("#prompt-textarea") ||
      document.querySelector("[data-id='prompt-textarea']") ||
      document.querySelector("div[contenteditable='true']");

    if (!inputEl) {
      alert(
        "PromptWrapper: Could not find the ChatGPT input box.\n" +
        "Please make sure a chat is open and try again."
      );
      return;
    }

    // --- Set the text value using React's internal state management ---
    // Directly setting .textContent won't trigger React's onChange.
    // Using execCommand (deprecated but still works for contenteditable) or
    // the React nativeInputValueSetter trick handles both cases.
    inputEl.focus();

    // Clear existing content first
    document.execCommand("selectAll", false, null);
    document.execCommand("delete", false, null);

    // Insert our prompt text as plain text
    document.execCommand("insertText", false, text);

    // For newer versions of ChatGPT that use React's synthetic events:
    const inputEvent = new Event("input", { bubbles: true });
    inputEl.dispatchEvent(inputEvent);

    // ── 6. Click the Send button ─────────────────────────────
    // Small delay lets React re-render and enable the Send button
    setTimeout(() => {
      // Try several common selectors for the Send button
      const sendBtn =
        document.querySelector("[data-testid='send-button']") ||
        document.querySelector("button[aria-label='Send message']") ||
        document.querySelector("button[aria-label='Send prompt']") ||
        document.querySelector("form button[type='submit']");

      if (sendBtn && !sendBtn.disabled) {
        sendBtn.click();
      } else {
        // Fallback: simulate pressing Enter in the input
        const enterEvent = new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          key: "Enter",
          code: "Enter",
          keyCode: 13,
        });
        inputEl.dispatchEvent(enterEvent);
      }
    }, 200);
  }
})();
