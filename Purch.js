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
    document.getElementById('orderDate').valueAsDate = new Date();
    // Theme Sync
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });
});

// 1. MODAL LOGIC: Pull from Vendor Database (vendorDB)
function openModal() {
    document.getElementById('searchModal').style.display = 'flex';
    renderVendorsInModal();
}

function closeModal() {
    document.getElementById('searchModal').style.display = 'none';
}

function renderVendorsInModal() {
    // This pulls from the key used in your Vendor module
    const vendors = JSON.parse(localStorage.getItem('vendorDB')) || [];
    const tbody = document.getElementById('modalTableBody');
    tbody.innerHTML = "";

    vendors.forEach((v, i) => {
        const row = document.createElement('tr');
        // Link Row click to selection logic
        row.onclick = () => selectVendor(v);
        row.innerHTML = `
            <td>${i+1}</td>
            <td>${v.acc || v.id}</td>
            <td><strong>${v.name}</strong></td>
            <td>${v.address}</td>
            <td>${v.phone}</td>
            <td><span style="color:green; font-weight:bold;">Active</span></td>
        `;
        tbody.appendChild(row);
    });
}

// 2. THE REDIRECT LOGIC: Link Modal to Main Form Output
function selectVendor(v) {
    // Update the Vendor Information Box (Output)
    document.getElementById('resId').value = v.acc || v.id;
    document.getElementById('resName').value = v.name;
    document.getElementById('resAddr').value = v.address;
    
    // Also update the search bar ID for consistency
    document.getElementById('vSearchId').value = v.acc || v.id;
    
    closeModal();
    alert(`🤝 Vendor "${v.name}" Linked to Session.`);
}

// 3. QUICK SEARCH: Manual ID Input
function quickSearch() {
    const id = document.getElementById('vSearchId').value;
    const vendors = JSON.parse(localStorage.getItem('vendorDB')) || [];
    const found = vendors.find(v => v.acc.toString() === id || v.id.toString() === id);

    if(found) {
        selectVendor(found);
    } else {
        alert("❌ Vendor record not found in system.");
    }
}

// 4. NEW PURCHASE: Reset Form
function newOrderReset() {
    if(confirm("Generate New Order? This will clear current session.")) {
        location.reload();
    }
}

// Math logic
function calculateAmount() {
    const p = parseFloat(document.getElementById('priceInput').value) || 0;
    const q = parseInt(document.getElementById('pQty').value) || 0;
    document.getElementById('totalRowAmount').value = p * q;
}


document.addEventListener("DOMContentLoaded", function () {

    // Auto set date
    document.getElementById("orderDate").valueAsDate = new Date();

    loadVendors();
});

/* ===============================
   DATABASE STRUCTURE (Example)
=================================

localStorage.setItem("vendorDB", JSON.stringify([
    {
        id: "V1001",
        name: "Al-Hassan Traders",
        address: "Lahore",
        contact: "03001234567",
        accNo: "ACC-001"
    }
]));

================================= */


/* ===============================
   QUICK SEARCH (TOP SEARCH)
================================= */
function quickSearch() {
    const id = document.getElementById("topSearchId").value.trim();
    const vendors = JSON.parse(localStorage.getItem("vendorDB")) || [];

    const vendor = vendors.find(v =>
        v.id === id ||
        v.id.slice(-4) === id
    );

    if (!vendor) {
        alert("Vendor not found!");
        return;
    }

    fillVendorOutput(vendor);
}


/* ===============================
   FILL OUTPUT AREA
================================= */
function fillVendorOutput(vendor) {
    document.getElementById("resId").value = vendor.id;
    document.getElementById("resName").value = vendor.name;
    document.getElementById("resAddr").value = vendor.address;
}


/* ===============================
   MODAL OPEN & LOAD DATA
================================= */
function openModal() {
    document.getElementById("searchModal").style.display = "flex";

    const vendors = JSON.parse(localStorage.getItem("vendorDB")) || [];
    const tbody = document.getElementById("modalTableBody");
    tbody.innerHTML = "";

    vendors.forEach((v, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${v.accNo || "-"}</td>
                <td>${v.name}</td>
                <td>${v.address}</td>
                <td>${v.contact}</td>
                <td><button onclick='selectVendor(${JSON.stringify(v)})'>Select</button></td>
            </tr>
        `;
    });
}

function closeModal() {
    document.getElementById("searchModal").style.display = "none";
}

function selectVendor(vendor) {
    fillVendorOutput(vendor);
    closeModal();
}


/* ===============================
   MODAL FILTER
================================= */
function filterModal() {
    const input = document.getElementById("modalInput").value.toLowerCase();
    const rows = document.querySelectorAll("#modalTableBody tr");

    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(input)
            ? ""
            : "none";
    });
}


/* ===============================
   PRODUCT PRICE UPDATE
================================= */
function updatePrice() {
    const price = document.getElementById("prodSelect").value;
    document.getElementById("unitPrice").value = price || 0;
    calculateAmount();
}


/* ===============================
   CALCULATE LINE TOTAL
================================= */
function calculateAmount() {
    const price = parseFloat(document.getElementById("unitPrice").value) || 0;
    const qty = parseFloat(document.getElementById("pQty").value) || 0;

    document.getElementById("lineTotal").value = price * qty;
}


/* ===============================
   ADD ITEM TO TABLE
================================= */
function addItem() {
    const product = document.getElementById("prodSelect");
    const name = product.options[product.selectedIndex].text;
    const price = parseFloat(document.getElementById("unitPrice").value);
    const qty = parseFloat(document.getElementById("pQty").value);
    const total = parseFloat(document.getElementById("lineTotal").value);

    if (!name || qty <= 0) {
        alert("Select product and enter quantity!");
        return;
    }

    const tbody = document.getElementById("billBody");

    tbody.innerHTML += `
        <tr>
            <td>${name}</td>
            <td>${price}</td>
            <td>${qty}</td>
            <td><b>${total}</b></td>
        </tr>
    `;

    updateGrandTotal(total);

    // Reset line
    document.getElementById("pQty").value = 0;
    document.getElementById("lineTotal").value = 0;
}


/* ===============================
   UPDATE GRAND TOTAL
================================= */
function updateGrandTotal(amount) {
    let current = parseFloat(document.getElementById("grandTotal").value) || 0;
    document.getElementById("grandTotal").value = current + amount;
}


/* ===============================
   SAVE PURCHASE BILL
================================= */
function savePurchase() {

    const vendorId = document.getElementById("resId").value;
    if (!vendorId) {
        alert("Select vendor first!");
        return;
    }

    const bill = {
        vendorId: vendorId,
        vendorName: document.getElementById("resName").value,
        date: document.getElementById("orderDate").value,
        total: document.getElementById("grandTotal").value,
        items: document.getElementById("billBody").innerHTML
    };

    let purchases = JSON.parse(localStorage.getItem("purchaseDB")) || [];
    purchases.push(bill);

    localStorage.setItem("purchaseDB", JSON.stringify(purchases));

    alert("Purchase Bill Saved Successfully!");
}