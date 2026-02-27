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
    // 1. Internal Link: Load Banks from Storage
    loadBanksToDropdown();

    // 2. Theme Toggle logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
});

// 3. Populate Dropdown from bankDB key
function loadBanksToDropdown() {
    const banks = JSON.parse(localStorage.getItem('bankDB')) || [];
    const select = document.getElementById('bankSelect');
    
    banks.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.name;
        opt.innerHTML = `${b.name} (${b.title}) 🏛️`;
        select.appendChild(opt);
    });
}

// 4. THE OUTPUT LOGIC: Generate Table exactly like Image
function performBankSearch() {
    const bank = document.getElementById('bankSelect').value;
    if(!bank) return alert("Please select a bank account first!");

    const tbody = document.getElementById('transBody');
    tbody.innerHTML = ""; // Clear loader

    document.getElementById('tableLabel').innerText = `Bank Transaction | ${bank}`;

    // Static Mock Data to match your image precisely
    const records = [
        { sno: 1, date: "31-Dec-2020", inv: "-", chq: "-", desc: "Opening Balance", deb: "0", cred: "0", bal: "20000", type: "blue" },
        { sno: 2, date: "09-Jan-2021", inv: "S-09020211914001", chq: "12324567", desc: "Vendor: 1-SHEHZAD", deb: "0", cred: "5000", bal: "15000", type: "pink" }
    ];

    records.forEach(r => {
        const row = document.createElement('tr');
        row.className = r.type === "blue" ? "row-blue" : "row-pink";
        
        row.innerHTML = `
            <td>${r.sno}</td>
            <td>${r.date}</td>
            <td>${r.inv}</td>
            <td>${r.chq}</td>
            <td>${r.desc}</td>
            <td>${r.deb}</td>
            <td>${r.cred}</td>
            <td>${r.bal}</td>
            <td>-</td>
        `;
        tbody.appendChild(row);
    });

    // 5. Update Bottom Stats (Live Output)
    document.getElementById('prevBal').value = "20000";
    document.getElementById('totalDeb').value = "0";
    document.getElementById('totalCred').value = "5000";
    document.getElementById('finalBal').value = "15000";

    alert("📊 Ledger Scanned: Output for " + bank + " Generated.");
}