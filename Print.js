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
    
    // 1. Theme Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 2. Auto-set Date & Ref ID
    document.getElementById('currentDate').innerText = new Date().toLocaleString();
    document.getElementById('refID').innerText = `#AF-PRNT-${Math.floor(100000 + Math.random() * 900000)}`;

    // 3. INTERNAL LINKING: Load Data from Storage
    loadReportData();
});

function loadReportData() {
    const tableHead = document.getElementById('printTableHead');
    const tableBody = document.getElementById('printTableBody');
    const reportTitle = document.getElementById('printReportTitle');
    const subTotal = document.getElementById('subTotalDisplay');

    // Hum localStorage se data uthayenge (Assumption: Reports page saves 'lastReportType' key)
    const reportType = localStorage.getItem('lastReportType') || 'stock'; 
    const inventory = JSON.parse(localStorage.getItem('myInventory')) || [];
    const logs = JSON.parse(localStorage.getItem('fillingLogs')) || [];

    tableBody.innerHTML = "";
    let totalSum = 0;

    if (reportType === 'stock') {
        reportTitle.innerText = "STOCK VALUATION REPORT";
        tableHead.innerHTML = "<th>#</th><th>Product Description</th><th>SKU</th><th>Stock Level</th><th>Total Value ($)</th>";
        
        inventory.forEach((item, index) => {
            const value = parseFloat(item.buy || 0) * parseInt(item.qty || 0);
            totalSum += value;
            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${item.name}</strong></td>
                    <td>${item.sku}</td>
                    <td>${item.qty} Units</td>
                    <td>$${value.toLocaleString()}</td>
                </tr>`;
        });
        subTotal.innerHTML = `<strong>Total Inventory Value: $${totalSum.toLocaleString()}</strong>`;
    } 
    
    else if (reportType === 'sales') {
        reportTitle.innerText = "DAILY MOVEMENT LOG";
        tableHead.innerHTML = "<th>#</th><th>Time Stamp</th><th>Activity</th><th>Operator</th><th>Net Change</th>";
        
        logs.slice(-15).forEach((log, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${log.time.replace('T', ' ')}</td>
                    <td>${log.product}</td>
                    <td>${log.operator}</td>
                    <td style="color:${log.qty.includes('-') ? 'red' : 'green'}">${log.qty}</td>
                </tr>`;
        });
        subTotal.innerHTML = `<strong>Entries Scanned: ${logs.length}</strong>`;
    }

    if(tableBody.innerHTML === "") {
        tableBody.innerHTML = "<tr><td colspan='5' style='text-align:center'>No records found in database for this report.</td></tr>";
    }
}