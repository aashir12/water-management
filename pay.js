document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Logic
    const savedTheme = localStorage.getItem('sysTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // 2. Load Real Databases
    loadSalesmen();
    loadCustomers();

    // 3. Form Submit
    document.getElementById('paymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment();
    });
});

// A. Internal Link: Get staff from employeeDB
function loadSalesmen() {
    const staff = JSON.parse(localStorage.getItem('employeeDB')) || [];
    const select = document.getElementById('salesmanSelect');
    staff.forEach(s => {
        select.innerHTML += `<option value="${s.fName}">${s.accNo}-${s.fName} ${s.lName} 👤</option>`;
    });
}

// B. Internal Link: Get clients from myCustomers and render Sheet
function loadCustomers(filter = null) {
    const customers = filter || JSON.parse(localStorage.getItem('myCustomers')) || [];
    const tbody = document.getElementById('customerTableBody');
    tbody.innerHTML = "";
    let totalBal = 0;

    customers.forEach((c, index) => {
        totalBal += parseFloat(c.balance || 0);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${c.id.toString().slice(-4)}</td>
            <td><strong>${c.name}</strong></td>
            <td>${c.area}</td>
            <td>${c.phone}</td>
            <td>Active</td>
            <td>$ ${c.balance}</td>
        `;

        // THE SELECTION FIX (Linking Table to Form)
        row.onclick = () => {
            document.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
            row.classList.add('selected-row');
            
            // FILL THE FORM FIELDS
            document.getElementById('accNum').value = c.id.toString().slice(-4);
            document.getElementById('custName').value = c.name;
            document.getElementById('balBottle').value = c.bottles || 0;
            document.getElementById('balAmount').value = c.balance;
        };

        tbody.appendChild(row);
    });

    document.getElementById('footerTotal').value = totalBal.toLocaleString();
}

// C. Process Payment & Update Global Storage
function processPayment() {
    const acc = document.getElementById('accNum').value;
    const paid = parseFloat(document.getElementById('pReceived').value);

    if(!acc || paid <= 0) return alert("Select customer and enter amount!");

    let customers = JSON.parse(localStorage.getItem('myCustomers'));
    const idx = customers.findIndex(c => c.id.toString().includes(acc));

    if(idx !== -1) {
        // Math logic
        customers[idx].balance -= paid;
        localStorage.setItem('myCustomers', JSON.stringify(customers));

        // Show Image-style Popup
        document.getElementById('successModal').style.display = 'flex';
        loadCustomers(); // Update output Sheet
    }
}

// Search Filter
function filterCustomers() {
    const val = document.getElementById('custSearchInput').value.toLowerCase();
    const all = JSON.parse(localStorage.getItem('myCustomers')) || [];
    const filtered = all.filter(c => c.name.toLowerCase().includes(val) || c.id.toString().includes(val));
    loadCustomers(filtered);
}

function closeModal() { document.getElementById('successModal').style.display = 'none'; resetForm(); }
function resetForm() { document.getElementById('paymentForm').reset(); }