/**
 * ============================================================================
 * THEME CONTROLLER (LIGHT & DARK MODES ONLY)
 * Seamless 1-click toggle, Lucide Icons, and localStorage persistence
 * ============================================================================
 */

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme_mode') || 'dark';
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme, false);

    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme, true);
  }

  applyTheme(theme, playSound = true) {
    this.currentTheme = theme;
    localStorage.setItem('theme_mode', theme);

    // Apply class to body
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);

    // Update Toggle Button Icon and Tooltip
    if (this.themeToggleBtn) {
      if (theme === 'dark') {
        this.themeToggleBtn.innerHTML = `<i data-lucide="sun" class="lucide-icon"></i><span>Light</span>`;
        this.themeToggleBtn.title = 'Switch to Light Mode';
      } else {
        this.themeToggleBtn.innerHTML = `<i data-lucide="moon" class="lucide-icon"></i><span>Dark</span>`;
        this.themeToggleBtn.title = 'Switch to Dark Mode';
      }

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    // Play signature theme audio if user toggled
    if (playSound && window.soundEngine) {
      window.soundEngine.playThemeSound(theme);
    }

    // Notify app of theme change (for SVG / canvas re-render)
    if (window.app && typeof window.app.onThemeChanged === 'function') {
      window.app.onThemeChanged(theme);
    }
  }
}

window.ThemeManager = ThemeManager;
