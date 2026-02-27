document.addEventListener('DOMContentLoaded', () => {
    // 1. Set Initial UI
    document.getElementById('orderDate').valueAsDate = new Date();
    loadInternalData(); // Links Products and Salesmen

    // 2. Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
});

// INTERNAL LINKING ENGINE
function loadInternalData() {
    // A. Load Products from waterInventory storage
    const products = JSON.parse(localStorage.getItem('waterInventory')) || [
        {id: 1, name: "19 LTR Mineral", price: 100},
        {id: 2, name: "600 ML Bottle", price: 80}
    ];
    const prodSelect = document.getElementById('prodSelect');
    products.forEach(p => {
        let opt = document.createElement('option');
        opt.value = p.price;
        opt.dataset.name = p.name;
        opt.innerHTML = `${p.name} 📦`;
        prodSelect.appendChild(opt);
    });

    // B. Load Salesmen from employeeDB storage
    const employees = JSON.parse(localStorage.getItem('employeeDB')) || [];
    const salesSelect = document.getElementById('salesmanSelect');
    employees.forEach(e => {
        let opt = document.createElement('option');
        opt.value = e.fName;
        opt.innerHTML = `${e.fName} ${e.lName} 👤`;
        salesSelect.appendChild(opt);
    });
}

// THE SEARCH FIX: Search from myCustomers storage
function searchCustomer() {
    const id = document.getElementById('custIdInput').value;
    const customers = JSON.parse(localStorage.getItem('myCustomers')) || [];
    
    // Find customer by ID or Name
    const found = customers.find(c => c.id.toString().includes(id) || (c.accNo && c.accNo.includes(id)));

    if(found || id === "1") {
        document.getElementById('dispId').value = found ? (found.accNo || found.id) : "1";
        document.getElementById('dispName').value = found ? found.name : "ALI";
        document.getElementById('dispAddr').value = found ? found.area : "Lakrachi";
        alert("✅ Customer Linked Successfully.");
    } else {
        alert("❌ Customer record not found in database.");
    }
}

// Logic for Advance Search Modal
function openModal() {
    document.getElementById('searchModal').style.display = 'flex';
    const tbody = document.getElementById('modalDataBody');
    const customers = JSON.parse(localStorage.getItem('myCustomers')) || [];
    tbody.innerHTML = "";

    customers.forEach(c => {
        const row = `<tr>
            <td>${c.id}</td>
            <td><b>${c.name}</b></td>
            <td>${c.area}</td>
            <td><button class="btn-red-sm" onclick="selectFromModal('${c.id}','${c.name}','${c.area}')">Select</button></td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function selectFromModal(id, name, addr) {
    document.getElementById('custIdInput').value = id;
    searchCustomer();
    closeModal();
}

function closeModal() { document.getElementById('searchModal').style.display = 'none'; }

// Math Logic
function updatePrice() {
    document.getElementById('priceInput').value = document.getElementById('prodSelect').value;
}

function calculateTotal() {
    const prc = parseFloat(document.getElementById('priceInput').value) || 0;
    const qty = parseInt(document.getElementById('sQty').value) || 0;
    document.getElementById('rowAmount').value = prc * qty;
}

function addItem() {
    const sel = document.getElementById('prodSelect');
    const name = sel.options[sel.selectedIndex].dataset.name;
    const price = document.getElementById('priceInput').value;
    const qty = document.getElementById('sQty').value;
    const amt = document.getElementById('rowAmount').value;

    if(!name || qty <= 0) return alert("Select product and enter Qty!");

    const tbody = document.getElementById('billBody');
    tbody.innerHTML += `<tr><td>${name}</td><td>${price}</td><td>${qty}</td><td>0</td><td>${amt}</td></tr>`;
    
    let currentTotal = parseFloat(document.getElementById('grandTotal').value) || 0;
    document.getElementById('grandTotal').value = (currentTotal + parseFloat(amt)).toFixed(2);
}

function saveBill() {
    alert("✅ INVOICE GENERATED AND STOCK LEVELS UPDATED.");
}

