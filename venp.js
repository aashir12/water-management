document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Load
    loadVendors();
    document.getElementById('pDate').valueAsDate = new Date();

    // 2. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 3. Form Submission Logic
    const payForm = document.getElementById('paymentForm');
    payForm.addEventListener('submit', (e) => {
        e.preventDefault();
        processPayment();
    });
});

// --- CORE FUNCTIONS ---

// 1. Load Vendors into the Table (Right Side)
function loadVendors() {
    const searchVal = document.getElementById('vSearch').value.toLowerCase();
    const vendors = JSON.parse(localStorage.getItem('vendorDB')) || [];
    const tbody = document.getElementById('vendorTableBody');
    tbody.innerHTML = "";

    let totalVisibleBalance = 0;

    // Filter logic
    const filtered = vendors.filter(v => 
        (v.accNo || v.acc).toString().includes(searchVal) || 
        v.name.toLowerCase().includes(searchVal)
    );

    filtered.forEach((v, index) => {
        const row = document.createElement('tr');
        const bal = parseFloat(v.balance || 0);
        totalVisibleBalance += bal;

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${v.accNo || v.acc}</td>
            <td class="v-name-cell"><strong>${v.name}</strong></td>
            <td>${v.address || '---'}</td>
            <td>${v.phone || '---'}</td>
            <td class="bal-cell">${bal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
        `;

        // Selection Logic
        row.onclick = () => selectVendor(v, row);
        tbody.appendChild(row);
    });

    // Update Footer Summary
    document.getElementById('footerBalance').value = totalVisibleBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
}

// 2. Select Vendor from Table to Form
function selectVendor(vendor, rowElement) {
    // UI Highlight
    document.querySelectorAll('#vendorTableBody tr').forEach(r => r.classList.remove('selected-row'));
    rowElement.classList.add('selected-row');

    // Fill Form
    document.getElementById('accNo').value = vendor.accNo || vendor.acc;
    document.getElementById('vName').value = vendor.name;
    document.getElementById('balAmount').value = parseFloat(vendor.balance || 0).toFixed(2);
    
    // Focus on payment input
    document.getElementById('pAmount').focus();
}

// 3. Process the Payment
function processPayment() {
    const accNo = document.getElementById('accNo').value;
    const amount = parseFloat(document.getElementById('pAmount').value);
    const date = document.getElementById('pDate').value;
    const pType = document.querySelector('input[name="pType"]:checked').value;
    const cheque = document.getElementById('chequeNo').value;
    const remarks = document.getElementById('remarks').value;

    if (!accNo) return alert("❌ Please select a vendor from the table first!");
    if (isNaN(amount) || amount <= 0) return alert("❌ Please enter a valid payment amount!");

    // A. Update Vendor Master Balance (vendorDB)
    let vendors = JSON.parse(localStorage.getItem('vendorDB')) || [];
    const vIndex = vendors.findIndex(v => (v.accNo || v.acc).toString() === accNo);

    if (vIndex !== -1) {
        vendors[vIndex].balance = parseFloat(vendors[vIndex].balance) - amount;
        localStorage.setItem('vendorDB', JSON.stringify(vendors));

        // B. Add to Transaction History (For Ledger Sync)
        let transactions = JSON.parse(localStorage.getItem('vendor_transactions')) || [];
        transactions.push({
            vId: accNo,
            date: date,
            invoice: "PAYMENT",
            bill: pType === "CHEQUE" ? "CHQ: " + cheque : "CASH",
            prod: "Vendor Payment",
            price: 0,
            qty: 0,
            amt: 0, // No bill amount for payment
            pay: amount, // Payment amount
            remarks: remarks
        });
        localStorage.setItem('vendor_transactions', JSON.stringify(transactions));

        alert("✅ Payment processed and balance updated successfully!");
        resetForm();
        loadVendors();
    }
}

// 4. Utility Functions
function filterVendors() {
    loadVendors();
}

function resetForm() {
    document.getElementById('paymentForm').reset();
    document.getElementById('accNo').value = "";
    document.getElementById('vName').value = "";
    document.getElementById('balAmount').value = "";
    document.getElementById('pDate').valueAsDate = new Date();
    document.querySelectorAll('#vendorTableBody tr').forEach(r => r.classList.remove('selected-row'));
}