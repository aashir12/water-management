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
    // 1. Initial Load from Storage
    renderVendorTable();
    document.getElementById('vDate').valueAsDate = new Date();

    // 2. Theme Toggle logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 3. Form Save Logic (Internal Link to database)
    const vendorForm = document.getElementById('vendorForm');
    vendorForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const vendor = {
            id: Date.now(),
            acc: Math.floor(100 + Math.random() * 900), // Random Acc# simulation
            date: document.getElementById('vDate').value,
            name: document.getElementById('vName').value.toUpperCase(),
            phone: document.getElementById('vPhone').value,
            addr: document.getElementById('vAddress').value,
            rem: document.getElementById('vRemarks').value,
            bal: document.getElementById('vBalance').value
        };

        // Shared Local Database
        let db = JSON.parse(localStorage.getItem('vendorDB')) || [];
        db.push(vendor);
        localStorage.setItem('vendorDB', JSON.stringify(db));

        alert("✅ SUCCESS: Vendor record stored permanently.");
        vendorForm.reset();
        document.getElementById('vDate').valueAsDate = new Date();
        renderVendorTable();
    });
});

// 4. SEARCH FUNCTIONALITY (The specific request)
function searchVendors() {
    const val = document.getElementById('vSearchInput').value.toLowerCase();
    const db = JSON.parse(localStorage.getItem('vendorDB')) || [];
    
    // Filter logic for ID or Name
    const filtered = db.filter(v => 
        v.name.toLowerCase().includes(val) || 
        v.acc.toString().includes(val)
    );

    renderVendorTable(filtered);
    
    if(filtered.length > 0) {
        alert(`🔍 Search Complete: Found ${filtered.length} records.`);
    } else {
        alert("❌ No matching vendor found.");
    }
}

// 5. Output rendering logic
function renderVendorTable(data = null) {
    // If no filter, load all from storage
    const list = data || JSON.parse(localStorage.getItem('vendorDB')) || [];
    const tbody = document.getElementById('vendorTableBody');
    tbody.innerHTML = "";

    list.forEach((v, index) => {
        const row = document.createElement('tr');
        
        // Auto-select the first row to match your image blue highlight
        if(index === 0) row.classList.add('selected-row');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${v.acc}</td>
            <td>${v.date}</td>
            <td><strong>${v.name}</strong></td>
            <td>${v.addr}</td>
            <td>+92 ${v.phone}</td>
            <td style="font-weight:700;">${v.bal}</td>
        `;

        row.onclick = () => {
            document.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
            row.classList.add('selected-row');
        };

        tbody.appendChild(row);
    });

    if(list.length === 0) {
        tbody.innerHTML = "<tr><td colspan='7' style='text-align:center; padding:30px; opacity:0.5;'>Database empty. Register a New Vendor.</td></tr>";
    }
}

function editMode() {
    alert("📝 Select a vendor from the table to populate form for editing (Simulation).");
}


// Add this to your "Create Vendor Account" save button
function saveVendorAccount() {
    const vId = document.getElementById('vId').value; // e.g. "101"
    const vName = document.getElementById('vName').value;
    const vAddress = document.getElementById('vAddr').value;
    const vContact = document.getElementById('vContact').value;
    const vOpening = document.getElementById('vOpening').value || 0;

    const newVendor = {
        id: vId,
        name: vName,
        address: vAddress,
        contact: vContact,
        openingBal: parseFloat(vOpening)
    };

    // 1. Get existing vendors or start new list
    let vendors = JSON.parse(localStorage.getItem('vendors')) || [];
    
    // 2. Check if ID already exists
    if(vendors.find(v => v.id === vId)) {
        return alert("Vendor ID already exists!");
    }

    // 3. Save to "Database"
    vendors.push(newVendor);
    localStorage.setItem('vendors', JSON.stringify(vendors));

    alert("Account Created Successfully!");
    window.location.href = "venl.html"; // Internal link to Ledger
}


function saveNewVendor() {
    const newVendor = {
        id: document.getElementById('vId').value, // Used as Search Key
        name: document.getElementById('vName').value,
        address: document.getElementById('vAddr').value,
        openingBal: document.getElementById('vOpening').value || 0
    };
    let vendors = JSON.parse(localStorage.getItem('vendors')) || [];
    vendors.push(newVendor);
    localStorage.setItem('vendors', JSON.stringify(vendors));
}

