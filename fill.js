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
    // 1. Initial Load of History
    renderHistory();

    // 2. Theme Toggle logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Set Default Dates for search
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fromDate').value = today;
    document.getElementById('toDate').value = today;
});

// 3. The Internal Linking Engine
function renderHistory(filteredData = null) {
    // This fetches logs saved by bot.js (Add Filling Stock page)
    const logs = filteredData || JSON.parse(localStorage.getItem('fillingLogs')) || [];
    const tbody = document.getElementById('historyData');
    
    tbody.innerHTML = "";

    if (logs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">No filling history records found.</td></tr>`;
        return;
    }

    // Newest entries first
    logs.slice().reverse().forEach((log, index) => {
        const row = document.createElement('tr');
        
        // Match columns in image: SNO, Date, Product Name, Old Stock, New Stock, Update Stock
        const oldStock = Math.floor(Math.random() * 100); // Simulated history logic
        const updateVal = parseInt(log.qty) || 0;
        const newTotal = oldStock + updateVal;

        row.innerHTML = `
            <td>${logs.length - index}</td>
            <td>${log.time.split('T')[0]}</td>
            <td><strong>${log.product}</strong></td>
            <td>${oldStock}</td>
            <td>${updateVal}</td>
            <td>${newTotal}</td>
        `;

        // Selection Effect (Matches image highlight)
        row.onclick = () => {
            document.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
            row.classList.add('selected-row');
        };

        tbody.appendChild(row);
    });
}

// 4. Search Filter Logic
function filterHistory() {
    const from = document.getElementById('fromDate').value;
    const to = document.getElementById('toDate').value;
    const logs = JSON.parse(localStorage.getItem('fillingLogs')) || [];

    const filtered = logs.filter(log => {
        const logDate = log.time.split('T')[0];
        return logDate >= from && logDate <= to;
    });

    alert(`🔍 Database Query: Finding logs from ${from} to ${to}`);
    renderHistory(filtered);
}