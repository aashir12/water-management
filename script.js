// Theme Toggle Logic
const themeBtn = document.getElementById('theme-toggle');
const html = document.documentElement;

themeBtn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    
    html.setAttribute('data-theme', nextTheme);
    
    // Update Toggle Icon
    themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
});

// Simple Console Log to confirm script load
console.log("Water Inventory Software Loaded Successfully.");
// Mobile menu toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.icon-nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Accordion for dropdowns on mobile
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(drop => {
    drop.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.stopPropagation();
            drop.classList.toggle('active');
        }
    });
});