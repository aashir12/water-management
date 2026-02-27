// Example for Prod.html
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = "2"; // This would come from your login session
    const permissions = JSON.parse(localStorage.getItem(`userRoles_${currentUser}`));

    // If 'add-prod' checkbox was unchecked, block access
    if (permissions && permissions['add-prod'] === false) {
        document.body.innerHTML = "<h1 style='text-align:center; margin-top:20%; color:red;'>🚫 ACCESS DENIED: You do not have permission to view this section.</h1>";
        setTimeout(() => window.location.href = 'produ.html', 2000);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Persistence
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 2. Row Selection logic (Mirroring the blue highlight in image)
    const rows = document.querySelectorAll('#balanceTableBody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            rows.forEach(r => r.classList.remove('selected-row'));
            row.classList.add('selected-row');
        });
    });

    // 3. Search Simulation
    window.performSearch = () => {
        const query = document.getElementById('searchInput').value;
        if(query) alert(`🔍 Scanning Database for: ${query}`);
    };
});