document.addEventListener('DOMContentLoaded', () => {
    // 1. Internal Link: Load Products from the Inventory module
    loadProductsFromStorage();

    // 2. Theme Toggle logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });

    // 3. Form Submission (Save Price)
    const setForm = document.getElementById('setPriceForm');
    setForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const custId = document.getElementById('resCustId').value;
        if(!custId) return alert("❌ Search for a Customer first!");

        saveCustomerPrice(custId);
    });
});

// --- CORE FUNCTIONS ---

// LINK: Pull products from waterInventory key
function loadProductsFromStorage() {
    const products = JSON.parse(localStorage.getItem('waterInventory')) || [];
    const select = document.getElementById('newSelectProduct');
    select.innerHTML = '<option value="">-- Choose Product --</option>';
    
    products.forEach(p => {
        let opt = document.createElement('option');
        opt.value = p.name;
        opt.innerHTML = `${p.name} (${p.type}) 📦`;
        select.appendChild(opt);
    });
}

// LINK: Search logic to find Customer from myCustomers key
function searchCustomer() {
    const searchId = document.getElementById('custSearchId').value;
    const allCustomers = JSON.parse(localStorage.getItem('myCustomers')) || [];
    
    // Logic: Match ID or Account Number
    const found = allCustomers.find(c => c.id.toString().includes(searchId));

    if(found) {
        document.getElementById('resCustId').value = found.id.toString().slice(-4);
        document.getElementById('resCustName').value = found.name;
        document.getElementById('resCustAddr').value = found.area;
        
        loadCustomerPrices(found.id); // Load prices specific to this user
        alert(`✅ Customer "${found.name}" Loaded.`);
    } else {
        alert("❌ Error: Customer ID not found in database.");
    }
}

// STORAGE: Save custom price for a specific customer
function saveCustomerPrice(custId) {
    const pName = document.getElementById('newSelectProduct').value;
    const price = document.getElementById('newPriceInput').value;

    const priceObj = { pName, price };

    // Unique key for each customer's pricing: prices_CUSTID
    let savedPrices = JSON.parse(localStorage.getItem(`prices_${custId}`)) || [];
    
    // Update if exists, else push
    const index = savedPrices.findIndex(item => item.pName === pName);
    if(index !== -1) savedPrices[index].price = price;
    else savedPrices.push(priceObj);

    localStorage.setItem(`prices_${custId}`, JSON.stringify(savedPrices));
    
    alert("✅ Custom price linked to Customer Account.");
    loadCustomerPrices(custId);
    document.getElementById('setPriceForm').reset();
}

function loadCustomerPrices(custId) {
    const tbody = document.getElementById('priceTableBody');
    const prices = JSON.parse(localStorage.getItem(`prices_${custId}`)) || [];
    
    tbody.innerHTML = "";
    prices.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${item.pName}</strong></td>
            <td><b style="color:var(--primary)">$ ${item.price}</b></td>
            <td><i class="fas fa-trash" style="color:red; cursor:pointer;" onclick="deletePrice('${custId}', '${item.pName}')"></i></td>
        `;
        
        row.onclick = () => {
            document.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
            row.classList.add('selected-row');
            document.getElementById('updateProductName').value = item.pName;
            document.getElementById('updatePriceInput').value = item.price;
        };
        tbody.appendChild(row);
    });
}

function deletePrice(custId, pName) {
    let prices = JSON.parse(localStorage.getItem(`prices_${custId}`)) || [];
    prices = prices.filter(p => p.pName !== pName);
    localStorage.setItem(`prices_${custId}`, JSON.stringify(prices));
    loadCustomerPrices(custId);
}