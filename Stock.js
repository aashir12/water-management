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
    
    // Default Date Settings
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('sDate').value = today;
    document.getElementById('headerDate').value = today;

    // 1. Theme Switcher Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 2. Form Submission to Table
    const stockForm = document.getElementById('stockForm');
    const stockBody = document.getElementById('stockBody');
    let sno = 1;

    stockForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Getting values
        const date = document.getElementById('sDate').value;
        const salesman = document.getElementById('sSalesman').value;
        const product = document.getElementById('sProduct').value;
        const qty = document.getElementById('sQty').value;
        const status = document.getElementById('sStatus').value;
        const remarks = document.getElementById('sRemarks').value;

        // Creating New Table Row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sno++}</td>
            <td>${date}</td>
            <td><strong>${product}</strong></td>
            <td>${qty}</td>
            <td style="color: ${status.includes('OUT') ? 'red' : 'green'}; font-weight: bold;">${status}</td>
            <td>${salesman}</td>
            <td>${remarks}</td>
        `;

        // Adding Row to the top of table
        stockBody.insertBefore(row, stockBody.firstChild);

        alert("✅ Stock Entry Success!");
        stockForm.reset();
        document.getElementById('sDate').value = today; // Reset to today's date
    });

    // Sidebar/Nav Internal Linking Simulation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        });
    });
});