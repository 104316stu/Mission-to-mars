"use strict";

(function () {

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function on(eventName, selector, handler) {
    document.addEventListener(eventName, (event) => {
      const target = event.target.closest(selector);
      if (!target) return;
      handler(event, target);
    });
  }


  const THEME_KEY = "mtm-theme";

  function applySavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) document.documentElement.dataset.theme = saved;
  }

  function toggleTheme() {
    const root = document.documentElement;
    const current = root.dataset.theme || "dark";
    const next = current === "light" ? "dark" : "light";
    root.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
    toast(`Theme: ${next}`);
  }


  function setFlightLine() {
    const el = $("#flightLine");
    if (!el) return;

    const now = new Date();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    el.textContent = `Cruising • ${now.getHours()}:${minutes} • All systems nominal`;
  }


  function toast(message) {
    const el = document.createElement("div");
    el.textContent = message;
    el.setAttribute("role", "status");

    Object.assign(el.style, {
      position: "fixed",
      left: "50%",
      bottom: "18px",
      transform: "translateX(-50%)",
      padding: "12px 14px",
      borderRadius: "14px",
      background: "rgba(0,0,0,0.65)",
      border: "1px solid rgba(255,255,255,0.12)",
      backdropFilter: "blur(10px)",
      zIndex: 9999,
      maxWidth: "min(520px, calc(100% - 24px))",
      textAlign: "center",
    });

    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), 1600);
  }


  function initActions() {
    on("click", "[data-action]", (_event, btn) => {
      const action = btn.getAttribute("data-action");

      switch (action) {
        case "refresh":
          setFlightLine();
          toast("Updated ✅");
          break;

        case "toast":
          toast("Welcome aboard 🚀");
          break;

        case "danger":
          toast("Demo only: Emergency button pressed");
          break;

        default:
          toast(`Unknown action: ${action}`);
      }
    });
  }


  function init() {
    applySavedTheme();
    setFlightLine();

    const themeBtn = $("#themeToggle");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

    initActions();
  }


  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
