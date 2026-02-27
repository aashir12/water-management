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
    
    // 1. Theme Persistence Logic (Internal Linking with ERP)
    const themeBtn = document.getElementById('theme-toggle');
    const htmlTag = document.documentElement;

    themeBtn.addEventListener('click', () => {
        const isDark = htmlTag.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        htmlTag.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        
        // Links theme to all pages in the app
        localStorage.setItem('erpTheme', newTheme);
    });

    // Load saved theme on boot
    const savedTheme = localStorage.getItem('erpTheme');
    if (savedTheme) {
        htmlTag.setAttribute('data-theme', savedTheme);
        themeBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    // 2. Change Password Logic (Data Storage)
    const securityForm = document.getElementById('securityForm');
    securityForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const oldPass = document.getElementById('oldPass').value;
        const newPass = document.getElementById('newPass').value;
        const confirmPass = document.getElementById('confirmPass').value;

        // Validation logic
        if (newPass !== confirmPass) {
            alert("❌ ERROR: New Passwords do not match!");
            return;
        }

        // Simulating data storage
        localStorage.setItem('sysPassword', newPass);
        
        // Professional Feedback
        const btn = document.querySelector('.btn-change-pass');
        btn.innerText = "Processing Security Update...";
        btn.style.opacity = "0.7";

        setTimeout(() => {
            alert("✅ SUCCESS: System security credentials have been updated.");
            btn.innerText = "Change Password 🔄";
            btn.style.opacity = "1";
            securityForm.reset();
        }, 1500);
    });
});