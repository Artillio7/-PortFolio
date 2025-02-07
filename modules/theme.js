export class ThemeManager {
    constructor() {
        this.setupThemeToggle();
        this.initTheme();
        this.setupListeners();
    }

    setupThemeToggle() {
        // Création du bouton de toggle si non existant
        if (!document.getElementById('theme-toggle')) {
            const toggle = document.createElement('button');
            toggle.id = 'theme-toggle';
            toggle.className = 'theme-toggle';
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
            document.body.appendChild(toggle);
        }
        this.themeToggle = document.getElementById('theme-toggle');
    }

    initTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        this.updateToggleIcon(document.documentElement.getAttribute('data-theme'));
    }

    setupListeners() {
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', e => {
                const newTheme = e.matches ? 'dark' : 'light';
                this.setTheme(newTheme);
            });

        this.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleIcon(theme);
    }

    updateToggleIcon(theme) {
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}
