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
    // 1. Initial Load from Shared Storage
    loadVendorData();

    // 2. Theme Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
});

// 3. INTERNAL LINKING ENGINE: Fetch from vendorDB
function loadVendorData() {
    const vendors = JSON.parse(localStorage.getItem('vendorDB')) || [];
    const tbody = document.getElementById('vendorBalanceBody');
    const grandTotalInput = document.getElementById('grandTotalBalance');
    
    tbody.innerHTML = "";
    let totalBalance = 0;

    if (vendors.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px;">No Vendor Records found in system.</td></tr>`;
        return;
    }

    vendors.forEach((v, index) => {
        const row = document.createElement('tr');
        const bal = parseFloat(v.balance) || 0;
        totalBalance += bal;

        // Auto-select the first row to match your image highlight
        if(index === 0) row.classList.add('selected-row');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${v.accNo || (index + 1)}</td>
            <td><strong>${v.name}</strong></td>
            <td>${v.address || 'N/A'}</td>
            <td>${v.phone || 'N/A'}</td>
            <td><b>${bal.toFixed(2)}</b></td>
        `;

        row.onclick = () => {
            document.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
            row.classList.add('selected-row');
        };

        tbody.appendChild(row);
    });

    // Update the bottom Grand Total Amount
    grandTotalInput.value = totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
}

// 4. Search Filter Logic
function filterVendors() {
    const val = document.getElementById('vSearchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#vendorBalanceBody tr');
    
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(val) ? "" : "none";
    });
}