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
    // Initial Load
    loadPermissions();

    // Theme Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
});

// 1. SAVE PERMISSIONS PERMANENTLY
function savePermissions() {
    const userId = document.getElementById('userSelect').value;
    const checkboxes = document.querySelectorAll('.check-list input[type="checkbox"]');
    
    let userPermissions = {};

    checkboxes.forEach(cb => {
        userPermissions[cb.getAttribute('data-role')] = cb.checked;
    });

    // Store in LocalStorage using User ID as key
    localStorage.setItem(`userRoles_${userId}`, JSON.stringify(userPermissions));

    alert("✅ SUCCESS: Software User Roles Updated Permanently for Selected Employee.");
}

// 2. LOAD PERMISSIONS FROM STORAGE
function loadPermissions() {
    const userId = document.getElementById('userSelect').value;
    const savedRoles = JSON.parse(localStorage.getItem(`userRoles_${userId}`));
    
    const checkboxes = document.querySelectorAll('.check-list input[type="checkbox"]');

    if (savedRoles) {
        checkboxes.forEach(cb => {
            const role = cb.getAttribute('data-role');
            cb.checked = savedRoles[role] || false;
        });
    } else {
        // Default: Clear all if no data exists for user
        checkboxes.forEach(cb => cb.checked = false);
    }
}