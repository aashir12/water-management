// --- 1. GLOBAL DATA MANAGER (Shared across all ERP files) ---
const DataManager = {
    // Standardized key names to match your other files
    VENDORS_KEY: 'vendorDB', 
    TRANS_KEY: 'vendor_transactions',

    getVendors: () => JSON.parse(localStorage.getItem(DataManager.VENDORS_KEY)) || [],
    getTransactions: () => JSON.parse(localStorage.getItem(DataManager.TRANS_KEY)) || [],
    
    findVendor: (id) => DataManager.getVendors().find(v => (v.acc || v.id || v.accNo).toString() === id.toString()),

    saveVendor: (vendorObj) => {
        let vendors = DataManager.getVendors();
        const index = vendors.findIndex(v => (v.acc || v.id) === (vendorObj.acc || vendorObj.id));
        index > -1 ? vendors[index] = vendorObj : vendors.push(vendorObj);
        localStorage.setItem(DataManager.VENDORS_KEY, JSON.stringify(vendors));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Initial UI check
    initProfessionalLook();

    // --- INTERNAL LINKING: Handle URL Parameters ---
    // If coming from vens.html or Vendor.html?id=101
    const params = new URLSearchParams(window.location.search);
    const linkedId = params.get('id') || params.get('acc');
    if (linkedId) {
        document.getElementById('vSearchId').value = linkedId;
        searchVendorById(linkedId);
    }

    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.onclick = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        };
    }
});

// --- 2. VENDOR SEARCH LOGIC (Manual Entry) ---
function searchVendor() {
    const searchId = document.getElementById('vSearchId').value.trim();
    if (!searchId) {
        // If empty, open the Advance Search Modal (Professional UI behavior)
        openAdvanceSearch();
        return;
    }
    searchVendorById(searchId);
}

function searchVendorById(id) {
    const vendor = DataManager.findVendor(id);
    if (vendor) {
        populateMainUI(vendor);
        generateLedgerOutput();
    } else {
        alert("❌ Vendor Account Not Found in Database.");
    }
}

// --- 3. ADVANCE SEARCH MODAL LOGIC (The Popup) ---
function openAdvanceSearch() {
    document.getElementById('advanceSearchModal').style.display = 'flex';
    // Fetch real data from DataManager instead of hardcoded array
    renderModalResults(DataManager.getVendors());
}

function closeAdvanceSearch() {
    document.getElementById('advanceSearchModal').style.display = 'none';
}

function renderModalResults(data) {
    const tbody = document.getElementById('modalTableBody');
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">No Vendors Found. Create one in Vendor Management.</td></tr>`;
        return;
    }

    data.forEach((v, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${v.acc || v.id}</td>
            <td><strong>${v.name}</strong></td>
            <td>${v.address || v.addr || '---'}</td>
            <td>${v.phone || v.contact || '---'}</td>
        `;
        row.onclick = () => {
            populateMainUI(v);
            generateLedgerOutput();
            closeAdvanceSearch();
        };
        tbody.appendChild(row);
    });
}

function filterModalResults() {
    const query = document.getElementById('modalInput').value.toLowerCase();
    const filtered = DataManager.getVendors().filter(v => 
        v.name.toLowerCase().includes(query) || 
        (v.acc || v.id).toString().includes(query)
    );
    renderModalResults(filtered);
}

// --- 4. DATA TRANSFER & LEDGER GENERATION ---
function populateMainUI(vendor) {
    // Fill Sidebar
    document.getElementById('vSearchId').value = vendor.acc || vendor.id;
    document.getElementById('sideVName').value = vendor.name;

    // Fill Main Pane
    document.getElementById('dispId').value = vendor.acc || vendor.id;
    document.getElementById('dispName').value = vendor.name;
    document.getElementById('dispAddr').value = vendor.address || vendor.addr || "N/A";
    document.getElementById('dispContact').value = vendor.phone || vendor.contact || "N/A";
    document.getElementById('topBalance').value = parseFloat(vendor.balance || vendor.openingBal || 0).toFixed(2);
    
    // Status color
    document.querySelector('.status-right span').style.color = "#22c55e";
}

function generateLedgerOutput() {
    const vId = document.getElementById('dispId').value;
    const allTrans = DataManager.getTransactions();
    
    // Internal Linking: Filter transactions by selected vendor
    let filtered = allTrans.filter(t => (t.vId || t.acc).toString() === vId.toString());

    const tbody = document.getElementById('ledgerOutputBody');
    tbody.innerHTML = "";
    
    let totalBill = 0, totalPay = 0;

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:30px; opacity:0.5;">No transactions logged for this vendor.</td></tr>';
    } else {
        filtered.forEach((t, index) => {
            totalBill += parseFloat(t.amt || 0);
            totalPay += parseFloat(t.pay || 0);

            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${t.date}</td>
                    <td>${t.invoice || t.inv || '-'}</td>
                    <td>${t.bill || '-'}</td>
                    <td>${t.prod || 'General'}</td>
                    <td>${t.price || '-'}</td>
                    <td>${t.qty || '-'}</td>
                    <td>${parseFloat(t.amt || 0).toLocaleString()}</td>
                    <td>${parseFloat(t.pay || 0).toLocaleString()}</td>
                </tr>`;
        });
    }

    updateFooterCalculations(totalBill, totalPay);
}

function updateFooterCalculations(bill, pay) {
    const openingBal = parseFloat(document.getElementById('topBalance').value) || 0;
    const finalBalance = (openingBal + bill) - pay;

    document.getElementById('outBillAmt').value = bill.toLocaleString();
    document.getElementById('outTotalAmt').value = (openingBal + bill).toLocaleString();
    document.getElementById('outPaid').value = pay.toLocaleString();
    document.getElementById('outFinalBal').value = finalBalance.toLocaleString();
}

function initProfessionalLook() {
    // Styling green/red boxes as per your image
    const billBox = document.getElementById('outBillAmt');
    const balBox = document.getElementById('outFinalBal');
    if(billBox) billBox.style.backgroundColor = "#dcfce7";
    if(balBox) balBox.style.backgroundColor = "#fee2e2";
}