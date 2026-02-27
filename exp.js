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
    // 1. Initial Load of Heads from Storage
    loadExpenditureHeads();

    // 2. Default Date
    document.getElementById('expenseDate').valueAsDate = new Date();

    // 3. Theme toggle logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 4. Save Expense Submission
    const expenseForm = document.getElementById('expenseForm');
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newEntry = {
            id: Date.now(),
            head: document.getElementById('expHeadInput').value,
            date: document.getElementById('expenseDate').value,
            desc: document.getElementById('expenseDesc').value || "No Description",
            amt: parseFloat(document.getElementById('expenseAmount').value)
        };

        let db = JSON.parse(localStorage.getItem('masterExpenditure')) || [];
        db.push(newEntry);
        localStorage.setItem('masterExpenditure', JSON.stringify(db));

        alert("✅ EXPENSE LOGGED SUCCESSFULLY");
        expenseForm.reset();
        document.getElementById('expenseDate').valueAsDate = new Date();
    });
});

// --- NEW HEAD LOGIC (THE FIX) ---

// Show or Hide the Add Head Form
function toggleHeadForm(show) {
    const box = document.getElementById('newHeadBox');
    box.style.display = show ? 'block' : 'none';
    if(show) document.getElementById('newHeadName').focus();
}

// Save New Category to Database
function saveExpenditureHead() {
    const name = document.getElementById('newHeadName').value.trim();
    
    if(!name) {
        alert("⚠️ Please enter a name for the new head!");
        return;
    }

    // Pull current list
    let heads = JSON.parse(localStorage.getItem('expenditureHeads')) || ["1-LUNCH", "2-TEA"];

    if(heads.includes(name)) {
        alert("❌ This category already exists!");
        return;
    }

    heads.push(name);
    localStorage.setItem('expenditureHeads', JSON.stringify(heads));

    alert(`✨ New Head "${name}" added to dropdown list.`);
    document.getElementById('newHeadName').value = "";
    toggleHeadForm(false);
    loadExpenditureHeads(); // Refresh dropdowns immediately
}

// Update both Dropdowns (Entry and Filter)
function loadExpenditureHeads() {
    const heads = JSON.parse(localStorage.getItem('expenditureHeads')) || ["1-LUNCH", "2-TEA"];
    const entryDropdown = document.getElementById('expHeadInput');
    const filterDropdown = document.getElementById('filterHead');

    // Reset dropdowns
    entryDropdown.innerHTML = '<option value="">Select Head</option>';
    filterDropdown.innerHTML = '<option value="ALL">ALL</option>';

    heads.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h;
        opt.innerText = h;
        entryDropdown.appendChild(opt);

        const filterOpt = document.createElement('option');
        filterOpt.value = h;
        filterOpt.innerText = h;
        filterDropdown.appendChild(filterOpt);
    });
}

// Search Logic
function searchExpenses() {
    const filterHead = document.getElementById('filterHead').value;
    const db = JSON.parse(localStorage.getItem('masterExpenditure')) || [];
    const tbody = document.getElementById('expTableBody');
    const totalDisplay = document.getElementById('totalExpDisplay');
    
    tbody.innerHTML = "";
    let filteredData = (filterHead === "ALL") ? db : db.filter(item => item.head === filterHead);
    
    let grandTotal = 0;
    filteredData.reverse().forEach((item, index) => {
        grandTotal += item.amt;
        const row = `
            <tr class="output-row">
                <td>${index + 1}</td>
                <td>${item.head}</td>
                <td>${item.date}</td>
                <td>${item.desc}</td>
                <td><b>${item.amt.toFixed(2)}</b></td>
            </tr>`;
        tbody.innerHTML += row;
    });

    totalDisplay.innerText = grandTotal.toLocaleString();
}