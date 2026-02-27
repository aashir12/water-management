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

    // 2. Default Join Date
    document.getElementById('secDate').valueAsDate = new Date();

    // 3. Form Submission
    const form = document.getElementById('securityForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const amt = document.getElementById('secAmount').value;
        const status = document.getElementById('secStatus').value;
        const desc = document.getElementById('secDetail').value;
        
        alert(`✅ ${status} of $${amt} recorded for current customer.`);
        addRecordToTable(status, desc, amt);
        form.reset();
        document.getElementById('secDate').valueAsDate = new Date();
    });
});

// 4. Internal Link: Search Customer (Using 'myCustomers' storage key)
function searchCustomer() {
    const searchId = document.getElementById('secSearchId').value;
    const allCustomers = JSON.parse(localStorage.getItem('myCustomers')) || [];
    
    const cust = allCustomers.find(c => c.id.toString().includes(searchId));

    if(cust) {
        document.getElementById('dispId').value = cust.id.toString().slice(-6);
        document.getElementById('dispName').value = cust.name;
        document.getElementById('dispAddr').value = cust.address || cust.area;
        
        // Mocking existing data for professional display
        addRecordToTable("Deposit", "Bottle Security Guarantee", "2000");
    } else {
        alert("❌ Customer ID not found in master records.");
    }
}

// 5. Update Audit Table UI
let sno = 1;
function addRecordToTable(status, desc, amt) {
    const tbody = document.getElementById('securityTableBody');
    const date = document.getElementById('secDate').value;
    
    const row = `<tr>
        <td>${sno++}</td>
        <td>${date}</td>
        <td>${status}</td>
        <td>${desc}</td>
        <td style="font-weight:700;">${amt}</td>
    </tr>`;
    tbody.innerHTML += row;

    // Update Totals Logic
    const totalDep = document.getElementById('totalDep');
    const balance = document.getElementById('secBalance');
    
    if(status === "Deposit") {
        totalDep.value = parseInt(totalDep.value) + parseInt(amt);
    }
    balance.value = parseInt(totalDep.value) - parseInt(document.getElementById('totalRef').value);
}

function resetForm() {
    document.getElementById('securityForm').reset();
}