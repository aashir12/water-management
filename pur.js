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


let currentBillItems = [];

document.addEventListener('DOMContentLoaded', () => {
    renderHistory(); // Page load hote hi output table dikhao
    
    // Theme Switcher
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const html = document.documentElement;
        const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
    });
});

// 1. Add Item to Session (Temporary List)
function addItemToList() {
    const select = document.getElementById('prodSelect');
    const name = select.options[select.selectedIndex].dataset.name;
    const price = parseFloat(select.value);
    const qty = parseInt(document.getElementById('pQty').value);

    if (!name || qty <= 0) return alert("Select product and valid Quantity!");

    const total = price * qty;
    currentBillItems.push({ name, price, qty, total });

    updateBillTable();
}

function updateBillTable() {
    const tbody = document.getElementById('billBody');
    let grandTotal = 0;
    tbody.innerHTML = "";

    currentBillItems.forEach(item => {
        grandTotal += item.total;
        tbody.innerHTML += `<tr>
            <td><strong>${item.name}</strong></td>
            <td>${item.price}</td>
            <td>${item.qty}</td>
            <td><b>${item.total.toFixed(2)}</b></td>
        </tr>`;
    });
    document.getElementById('grandTotal').innerText = grandTotal.toFixed(2);
}

// 2. MASTER SAVE LOGIC (Saves to History and Updates Stock)
function saveFullPurchase() {
    if (currentBillItems.length === 0) return alert("Bill is empty!");
    const vendor = document.getElementById('dispVName').value || "Walk-in Vendor";

    const billData = {
        id: "PUR-" + Math.floor(Math.random() * 90000),
        date: new Date().toLocaleDateString(),
        vendor: vendor,
        total: document.getElementById('grandTotal').innerText,
        items: currentBillItems.map(i => `${i.qty}x ${i.name}`).join(", ")
    };

    // SAVE TO HISTORY (Output)
    let history = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    history.push(billData);
    localStorage.setItem('purchaseHistory', JSON.stringify(history));

    // INTERNAL LINK: Update Stock Balance (Check.html database)
    // We use the 'myInventory' key which is standard in your software
    let inventory = JSON.parse(localStorage.getItem('myInventory')) || [];
    
    currentBillItems.forEach(item => {
        const idx = inventory.findIndex(inv => inv.name.includes(item.name));
        if (idx !== -1) {
            // Agar product hai toh qty barhao
            inventory[idx].qty = (parseInt(inventory[idx].qty) || 0) + item.qty;
        } else {
            // Naya item add karo
            inventory.push({
                id: Date.now(),
                name: item.name,
                qty: item.qty,
                cat: "Water Supply"
            });
        }
    });
    localStorage.setItem('myInventory', JSON.stringify(inventory));

    alert("✅ SUCCESS: Stock level updated in Database & History Logged.");
    
    // Clear Session
    currentBillItems = [];
    updateBillTable();
    closeModal();
    renderHistory(); // Refresh Output Log
}

// 3. RENDER OUTPUT HISTORY
function renderHistory() {
    const history = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    const tbody = document.getElementById('historyLogBody');
    tbody.innerHTML = "";

    history.slice().reverse().forEach(log => {
        tbody.innerHTML += `
            <tr>
                <td><b style="color:var(--primary)">${log.id}</b></td>
                <td>${log.date}</td>
                <td><strong>${log.vendor}</strong></td>
                <td><small>${log.items}</small></td>
                <td><b>$ ${log.total}</b></td>
                <td><span style="color:green; font-weight:bold;">Synced ●</span></td>
            </tr>
        `;
    });

    if (history.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' style='text-align:center; padding:20px; opacity:0.5;'>No purchase records found in database.</td></tr>";
    }
}

// Modal and Search Simulation
function openPaymentModal() { document.getElementById('paymentModal').style.display = 'flex'; }
function closeModal() { document.getElementById('paymentModal').style.display = 'none'; }
function searchVendor() { document.getElementById('dispVName').value = "Ali Ahmed (ID:1)"; alert("Vendor Linked"); }