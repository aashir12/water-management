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
    // Initial Sync
    syncAllData();
    
    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // Default dates
    document.getElementById('dateTo').valueAsDate = new Date();
});

// 1. Sync All Data from different modules
function syncAllData() {
    const inventory = JSON.parse(localStorage.getItem('myInventory')) || [];
    const customers = JSON.parse(localStorage.getItem('myCustomers')) || [];
    const logs = JSON.parse(localStorage.getItem('fillingLogs')) || [];

    // Update Summary Cards
    // A. Inventory Value (Purchase price * Qty)
    const invValue = inventory.reduce((acc, item) => acc + (parseFloat(item.buy) * parseInt(item.qty || 0)), 0);
    document.getElementById('statInventoryValue').innerText = `$${invValue.toLocaleString()}`;

    // B. Today's Sales (Stock OUT quantity from logs)
    const today = new Date().toISOString().split('T')[0];
    const todaySales = logs.filter(l => l.time.startsWith(today) && l.qty.toString().includes('-'))
                           .reduce((acc, l) => acc + Math.abs(parseInt(l.qty)), 0);
    document.getElementById('statTodaySales').innerText = `${todaySales} Units`;

    // C. Total Dues (From Customers Module)
    const dues = customers.reduce((acc, c) => acc + (c.balance < 0 ? Math.abs(c.balance) : 0), 0);
    document.getElementById('statTotalDues').innerText = `$${dues.toLocaleString()}`;

    // Update Time
    document.getElementById('syncTime').innerText = new Date().toLocaleTimeString();
    
    // Refresh current open report
    showReport('sales');
}

// 2. Report Switcher Logic
window.showReport = (type) => {
    const title = document.getElementById('reportTitle');
    const thead = document.getElementById('tableHead');
    const tbody = document.getElementById('reportTableBody');
    
    // Update active UI
    document.querySelectorAll('.report-menu li').forEach(li => li.classList.remove('active'));
    document.getElementById(`btn-${type}`).classList.add('active');

    tbody.innerHTML = "";

    if (type === 'sales') {
        title.innerText = "Stock Movement History Report";
        thead.innerHTML = "<th>Ref #</th><th>Time</th><th>Product</th><th>Change</th><th>Final Stock</th>";
        const logs = JSON.parse(localStorage.getItem('fillingLogs')) || [];
        logs.slice().reverse().forEach(l => {
            tbody.innerHTML += `<tr>
                <td>${l.id.toString().slice(-6)}</td>
                <td>${l.time.replace('T', ' ')}</td>
                <td><strong>${l.product}</strong></td>
                <td style="color:${l.qty.toString().includes('+') ? '#22c55e' : '#ef4444'}">${l.qty}</td>
                <td>${l.total}</td>
            </tr>`;
        });
    } 
    
    else if (type === 'stock') {
        title.innerText = "Current Stock Valuation Report";
        thead.innerHTML = "<th>Product</th><th>SKU</th><th>Stock</th><th>Buy Price</th><th>Total Value</th>";
        const inventory = JSON.parse(localStorage.getItem('myInventory')) || [];
        inventory.forEach(i => {
            const val = parseFloat(i.buy) * parseInt(i.qty);
            tbody.innerHTML += `<tr>
                <td><strong>${i.name}</strong></td>
                <td>${i.sku}</td>
                <td>${i.qty} ${i.unit || 'Units'}</td>
                <td>$${i.buy}</td>
                <td style="font-weight:700; color:var(--primary-blue)">$${val.toLocaleString()}</td>
            </tr>`;
        });
    }

    else if (type === 'dues') {
        title.innerText = "Customer Accounts Receivable (Dues)";
        thead.innerHTML = "<th>Customer Name</th><th>Phone</th><th>Area</th><th>Outstanding Balance</th>";
        const customers = JSON.parse(localStorage.getItem('myCustomers')) || [];
        customers.filter(c => c.balance < 0).forEach(c => {
            tbody.innerHTML += `<tr>
                <td><strong>${c.name}</strong></td>
                <td>${c.phone}</td>
                <td>${c.area}</td>
                <td style="color:#ef4444; font-weight:700;">$${Math.abs(c.balance).toLocaleString()}</td>
            </tr>`;
        });
    }

    if (tbody.innerHTML === "") {
        tbody.innerHTML = "<tr><td colspan='5' style='text-align:center; padding:40px;'>No data records found in this category.</td></tr>";
    }
};