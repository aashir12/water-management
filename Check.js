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
    loadStockData();

    // 1. Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
});

// 2. Load Data from localStorage (Internal Linking)
function loadStockData() {
    // This key 'waterInventory' must match the key used in your produ.js save function
    const products = JSON.parse(localStorage.getItem('waterInventory')) || [];
    const tbody = document.getElementById('stockData');
    
    tbody.innerHTML = "";

    // If no data, show empty rows (like in your image)
    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px;">No Stock Data Available. Please Add Products first.</td></tr>`;
        return;
    }

    products.forEach((p, index) => {
        const row = document.createElement('tr');
        
        // Logical calculations for a professional ERP feel
        const fillingStock = p.qty || 0; // Linked from Initial Qty
        const emptyStock = Math.floor(fillingStock * 0.2); // Simulated empty jars
        const totalInWh = parseInt(fillingStock) + emptyStock;
        const damage = 0; 
        const market = "-"; 

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.type}</td>
            <td>${fillingStock}</td>
            <td>${emptyStock}</td>
            <td>${totalInWh}</td>
            <td>${damage}</td>
            <td>${market}</td>
        `;

        // Row Selection Logic (Matches Blue Highlight in your image)
        row.onclick = () => {
            document.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
            row.classList.add('selected-row');
        };

        tbody.appendChild(row);
    });
}

// Manual Sync (Sync Data Button)
document.querySelector('.btn-sync')?.addEventListener('click', () => {
    loadStockData();
    alert("Database Synced Successfully! ●");
});