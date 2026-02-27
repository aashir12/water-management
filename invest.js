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
    // 1. Initial Load from Database
    renderInvestments();

    // 2. Set Default Dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invDate').value = today;
    document.getElementById('searchFromDate').value = "2021-01-01";
    document.getElementById('searchToDate').value = today;

    // 3. Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 4. Save New Investment Logic
    const investForm = document.getElementById('investForm');
    investForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newEntry = {
            id: Date.now(),
            name: document.getElementById('invName').value.toUpperCase(),
            detail: document.getElementById('invDetail').value || "General Investment",
            amount: parseFloat(document.getElementById('invAmount').value),
            date: document.getElementById('invDate').value
        };

        // Shared Storage Key
        let data = JSON.parse(localStorage.getItem('masterInvestments')) || [];
        data.push(newEntry);
        localStorage.setItem('masterInvestments', JSON.stringify(data));

        alert("✅ Investment Record Saved Successfully!");
        investForm.reset();
        document.getElementById('invDate').value = today;
        renderInvestments();
    });
});

// 5. THE SEARCH & OUTPUT ENGINE
function renderInvestments(filtered = null) {
    const data = filtered || JSON.parse(localStorage.getItem('masterInvestments')) || [];
    const tbody = document.getElementById('investDataBody');
    const totalDisplay = document.getElementById('grandTotalOutput');
    
    tbody.innerHTML = "";
    let grandTotal = 0;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; opacity:0.5;">No records found.</td></tr>`;
        totalDisplay.innerText = "0";
        return;
    }

    data.forEach((item, index) => {
        grandTotal += item.amount;
        const row = document.createElement('tr');
        
        // Exact Image logic: Highlight the first row or specific row blue
        if (index === 0) row.classList.add('selected-row');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.date}</td>
            <td><strong>${item.name}</strong></td>
            <td>${item.detail}</td>
            <td><b>${item.amount.toLocaleString()}</b></td>
        `;
        tbody.appendChild(row);
    });

    totalDisplay.innerText = grandTotal.toLocaleString();
}

// 6. Search Filter Function
function searchInvestments() {
    const from = document.getElementById('searchFromDate').value;
    const to = document.getElementById('searchToDate').value;
    const allData = JSON.parse(localStorage.getItem('masterInvestments')) || [];

    const results = allData.filter(item => item.date >= from && item.date <= to);
    
    alert(`🔍 Database Audit: Found ${results.length} entries for the selected range.`);
    renderInvestments(results);
}

function resetForm() {
    document.getElementById('investForm').reset();
}