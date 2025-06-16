let activeTheme = 'light';

document.addEventListener('DOMContentLoaded', () => {
    // Check if a theme is saved in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        activeTheme = savedTheme;
    } else {
        // Default to light theme if no theme is saved
        document.body.setAttribute('data-theme', 'light');
    }

    // Update the button text based on the current theme
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

    // Save the current theme to localStorage
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
