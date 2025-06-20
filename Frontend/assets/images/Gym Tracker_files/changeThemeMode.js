let activeTheme = 'light';

document.addEventListener('DOMContentLoaded', () => {
    // Primero, si hay un tema guardado en localStorage, úsalo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        activeTheme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Si no hay guardado, consulta la preferencia del navegador
        document.body.setAttribute('data-theme', 'dark');
        activeTheme = 'dark';
    } else {
        // Por defecto, light
        document.body.setAttribute('data-theme', 'light');
        activeTheme = 'light';
    }

    updateButtonText();
});

function changeThemeMode() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
        activeTheme = 'light';
    } else {
        body.setAttribute('data-theme', 'dark');
        activeTheme = 'dark';
    }

    localStorage.setItem('theme', activeTheme);
    updateButtonText();
}

function updateButtonText() {
    const themeToggleButton = document.getElementById('themeChanger');
    if (activeTheme === 'light') {
        themeToggleButton.textContent = '☀️';
    } else {
        themeToggleButton.textContent = '🌑';
    }
}