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
    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
});

// Toggle Date Filters visibility based on dropdown
function toggleDateFilters() {
    const type = document.getElementById('ledgerType').value;
    const filterBox = document.getElementById('dateFilterSection');
    if (type.includes('range')) {
        filterBox.style.display = 'block';
    } else {
        filterBox.style.display = 'none';
    }
}

// Logic to fetch from storage and show "Output"
function fetchLedger() {
    const id = document.getElementById('ledgerCustId').value;
    const allCust = JSON.parse(localStorage.getItem('myCustomers')) || [];
    
    // Find customer
    const cust = allCust.find(c => c.id.toString().includes(id));

    if (!cust) {
        alert("❌ Customer ID not found!");
        return;
    }

    // Populate Header Info
    document.getElementById('dispId').value = cust.id.toString().slice(-6);
    document.getElementById('dispName').value = cust.name;
    document.getElementById('dispAddr').value = cust.area;
    document.getElementById('dispPhone').value = cust.phone;
    document.getElementById('outBalance').value = Math.abs(cust.balance);
    document.getElementById('outBottle').value = Math.floor(Math.random() * 5); // Simulated logic

    // Populate Mock Table Data (Output Simulation)
    const tbody = document.getElementById('ledgerTableBody');
    tbody.innerHTML = ""; // Clear loader

    // Mock records logic
    const records = [
        { sno: 1, date: "09-Jan-2021", inv: "INV-501", bill: "B-22", prod: "19L Jar", prc: 100, sqty: 5, rqty: 2, amt: 500, pay: 200 },
        { sno: 2, date: "12-Jan-2021", inv: "INV-602", bill: "B-23", prod: "19L Jar", prc: 100, sqty: 3, rqty: 3, amt: 300, pay: 300 }
    ];

    records.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td>${r.sno}</td>
                <td>${r.date}</td>
                <td>${r.inv}</td>
                <td>${r.bill}</td>
                <td><strong>${r.prod}</strong></td>
                <td>${r.prc}</td>
                <td>${r.sqty}</td>
                <td>${r.rqty}</td>
                <td><b>${r.amt}</b></td>
                <td><span style="color:green; font-weight:bold;">${r.pay}</span></td>
            </tr>
        `;
    });

    // Update Bottom Summary Calculations
    document.getElementById('totSale').value = 8;
    document.getElementById('totRet').value = 5;
    document.getElementById('botBal').value = 3;
    document.getElementById('billAmt').value = 800;
    document.getElementById('totAmt').value = 800;
    document.getElementById('payRec').value = 500;
    document.getElementById('taxAmt').value = 0;
    document.getElementById('finalBal').value = 300;

    alert("📊 Ledger Generated Successfully for: " + cust.name);
}