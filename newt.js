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
    loadBanks();

    // 1. Theme Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 2. Form Submission (Storage Data)
    const transForm = document.getElementById('transactionForm');
    transForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const transaction = {
            id: Date.now(),
            type: document.querySelector('input[name="payType"]:checked').value,
            mode: document.getElementById('transMode').value,
            bank: document.getElementById('bankSelect').value,
            cheque: document.getElementById('chequeNo').value,
            amount: document.getElementById('transAmount').value,
            remarks: document.getElementById('remarks').value,
            date: new Date().toLocaleDateString()
        };

        // Internal Linking: Save to 'bankTransactions' key
        let history = JSON.parse(localStorage.getItem('bankTransactions')) || [];
        history.push(transaction);
        localStorage.setItem('bankTransactions', JSON.stringify(history));

        alert("✅ TRANSACTION ADDED!\nLedger updated in master database.");
        transForm.reset();
    });
});

// 3. INTERNAL LINKING: Load existing banks from your Bank Registration page
function loadBanks() {
    const banks = JSON.parse(localStorage.getItem('bankDB')) || [];
    const select = document.getElementById('bankSelect');
    
    // Default mock data if DB empty
    if(banks.length === 0) {
        select.innerHTML += `<option value="HBL">1-HBL 🏛️</option>`;
        select.innerHTML += `<option value="MCB">2-MCB 🏛️</option>`;
    }

    banks.forEach((b, index) => {
        const opt = document.createElement('option');
        opt.value = b.name;
        opt.innerHTML = `${index + 1}-${b.name} 🏛️`;
        select.appendChild(opt);
    });
}