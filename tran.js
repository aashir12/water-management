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

let selectedId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadAccounts();

    // Theme Toggle logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // Form Submission (Save Logic)
    const bankForm = document.getElementById('bankForm');
    bankForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveAccount();
    });
});

// 1. Save New Account
function saveAccount() {
    const account = {
        id: Date.now(),
        name: document.getElementById('bankName').value.toUpperCase(),
        title: document.getElementById('accTitle').value.toUpperCase(),
        number: document.getElementById('accNumber').value,
        balance: document.getElementById('openBalance').value
    };

    let accounts = JSON.parse(localStorage.getItem('bankDB')) || [];
    accounts.push(account);
    localStorage.setItem('bankDB', JSON.stringify(accounts));

    alert("✅ Bank Account Saved Successfully!");
    resetForm();
    loadAccounts();
}

// 2. Load and Display Data
function loadAccounts() {
    const accounts = JSON.parse(localStorage.getItem('bankDB')) || [];
    const tbody = document.getElementById('bankDataBody');
    tbody.innerHTML = "";

    accounts.forEach((acc, index) => {
        const row = document.createElement('tr');
        if (selectedId === acc.id) row.classList.add('selected-row');

        row.innerHTML = `
            <td class="arrow-cell">${selectedId === acc.id ? '▶' : ''}</td>
            <td>${index + 1}</td>
            <td>${acc.name}</td>
            <td>${acc.title}</td>
            <td>${acc.number}</td>
            <td><b>${acc.balance}</b></td>
        `;

        row.onclick = () => {
            selectedId = acc.id;
            loadAccounts(); // Refresh highlight
        };

        tbody.appendChild(row);
    });
}

// 3. Edit Function (Populate Form)
function editSelected() {
    if (!selectedId) return alert("Select an account from the table first!");
    const accounts = JSON.parse(localStorage.getItem('bankDB'));
    const acc = accounts.find(a => a.id === selectedId);

    document.getElementById('bankName').value = acc.name;
    document.getElementById('accTitle').value = acc.title;
    document.getElementById('accNumber').value = acc.number;
    document.getElementById('openBalance').value = acc.balance;
}

// 4. Update Existing Account
function updateAccount() {
    if (!selectedId) return alert("Select an account to update!");
    let accounts = JSON.parse(localStorage.getItem('bankDB'));
    const index = accounts.findIndex(a => a.id === selectedId);

    accounts[index] = {
        id: selectedId,
        name: document.getElementById('bankName').value.toUpperCase(),
        title: document.getElementById('accTitle').value.toUpperCase(),
        number: document.getElementById('accNumber').value,
        balance: document.getElementById('openBalance').value
    };

    localStorage.setItem('bankDB', JSON.stringify(accounts));
    alert("✨ Account Updated Successfully!");
    resetForm();
    loadAccounts();
}

// 5. Reset Form
function resetForm() {
    selectedId = null;
    document.getElementById('bankForm').reset();
    document.getElementById('bankName').focus();
}