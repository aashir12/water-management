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
    // 1. Initial Data Load
    loadHistory();

    // 2. Theme Toggle Persistence
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    themeBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('sysTheme', newTheme);
    });

    // Set Default Search Dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fromDate').value = today;
    document.getElementById('toDate').value = today;
});

// 3. INTERNAL LINKING ENGINE
function loadHistory(filteredData = null) {
    // Pulling data from the shared 'fillingLogs' key
    const logs = filteredData || JSON.parse(localStorage.getItem('fillingLogs')) || [];
    const tbody = document.getElementById('historyData');
    
    tbody.innerHTML = "";

    if (logs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; opacity:0.5;">No production logs found in the database.</td></tr>`;
        return;
    }

    // Sort to show newest first
    logs.slice().reverse().forEach((log, index) => {
        const row = document.createElement('tr');
        
        // Logical math for Old vs New Stock
        const newQty = parseInt(log.qty) || 0;
        const totalStock = parseInt(log.total) || 0;
        const oldStock = totalStock - newQty;

        row.innerHTML = `
            <td>${logs.length - index}</td>
            <td>${log.time.replace('T', ' ')}</td>
            <td><strong>${log.product}</strong></td>
            <td>${oldStock}</td>
            <td><b style="color:var(--primary)">+ ${newQty}</b></td>
            <td>${totalStock}</td>
        `;

        // Row Selection Logic (Matches Blue Highlight from Image)
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

    loadHistory(filtered);
    
    const btn = document.querySelector('.btn-search');
    btn.innerHTML = "Filtering... ⏳";
    setTimeout(() => {
        btn.innerHTML = "Search 🔍";
    }, 500);
}