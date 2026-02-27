/**
 * AQUAFLOW PRO - DAILY SALES REPORT (Integrated Version)
 * Internal Link: employeeDB (emp.js) -> salesDB (sale.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Permission Security Check
    checkUserPermissions();

    // 2. Initial UI Setup
    initTheme();
    setDefaultDates();
    
    // 3. INTERNAL LINK: Load Employees from 'employeeDB' (saved by emp.js)
    syncEmployeeList();

    // 4. Attach logic to the Search Button
    const searchBtn = document.getElementById('btnSearch'); // Ensure ID is btnSearch in HTML
    if (searchBtn) {
        searchBtn.addEventListener('click', generateReport);
    }

    // Initial load
    generateReport();
});

// --- 1. INTERNAL LINKING: FETCH STAFF FROM employeeDB ---
function syncEmployeeList() {
    const empSelect = document.getElementById('empSelect');
    if (!empSelect) return;

    // DataManager pattern use karte hue employee database fetch karein
    const employeeDB = JSON.parse(localStorage.getItem('employeeDB')) || [];
    
    // Reset Dropdown
    empSelect.innerHTML = '<option value="all">All Employees 👥</option>';

    // Sirf 'Active' employees ko dropdown mein link karein
    employeeDB.forEach(emp => {
        if (emp.status === 'Active') {
            const option = document.createElement('option');
            option.value = emp.id; // Internal Primary Key
            option.textContent = `${emp.fName} ${emp.lName} (Acc: ${emp.accNo})`;
            empSelect.appendChild(option);
        }
    });
}

// --- 2. THE OUTPUT LOGIC: GENERATE REPORT FROM salesDB ---
function generateReport() {
    const tbody = document.getElementById('salesTableBody');
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const selectedEmpId = document.getElementById('empSelect').value;

    // Internal Link: Real sales data fetch karein (Assumes you save orders in 'salesDB')
    const salesDB = JSON.parse(localStorage.getItem('salesDB')) || [];
    const employeeDB = JSON.parse(localStorage.getItem('employeeDB')) || [];

    // Filtering Logic: Date Range + Selected Employee Link
    let filteredData = salesDB.filter(item => {
        const dateInRange = item.date >= dateFrom && item.date <= dateTo;
        const employeeMatch = (selectedEmpId === 'all') || (item.empId.toString() === selectedEmpId.toString());
        return dateInRange && employeeMatch;
    });

    tbody.innerHTML = "";
    let totalItemsSold = 0;
    let totalRevenue = 0;

    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12" style="text-align:center; padding:50px; opacity:0.5;">No sales found for selected criteria. 🔍</td></tr>';
    } else {
        filteredData.forEach((row, index) => {
            // Summary Calculations
            totalItemsSold += parseInt(row.sale || 0);
            totalRevenue += parseFloat(row.bill || 0);

            // DATA JOIN: Employee ka naam ID ke zariye dhoondna
            const empRecord = employeeDB.find(e => e.id.toString() === row.empId.toString());
            const empName = empRecord ? empRecord.fName : "Admin";

            const tr = document.createElement('tr');
            if(index === 0) tr.classList.add('selected-row'); // Highlighting top row

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${row.acc}</td>
                <td>${formatDate(row.date)}</td>
                <td><strong>${row.cust}</strong></td>
                <td>${row.addr}</td>
                <td>${row.phone}</td>
                <td style="color:green; font-weight:bold;">● ${row.status}</td>
                <td>${row.prod}</td>
                <td>${row.price}</td>
                <td>${row.sale}</td>
                <td>${row.ret}</td>
                <td><b>${parseFloat(row.bill).toLocaleString()}</b></td>
                <!-- Linked Employee Badge -->
                <td style="background: #f0f9ff; font-weight: bold;">👤 ${empName}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // --- SUMMARY FOOTER (Matches your image layout) ---
    updateSummaryUI(totalItemsSold, totalRevenue, dateFrom, dateTo);
}

// --- 3. UI HELPERS ---

function updateSummaryUI(qty, revenue, from, to) {
    // Totals logic
    document.getElementById('totalSale').value = qty;
    document.getElementById('grandTotalAmt').value = revenue.toLocaleString(); // Agar ye ID footer mein hai
    
    // Header labels update
    document.getElementById('dispFrom').innerText = `[${formatDate(from)}]`;
    document.getElementById('dispTo').innerText = `[${formatDate(to)}]`;
}

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options).replace(/ /g, '-');
}

function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateFrom').value = today;
    document.getElementById('dateTo').value = today;
}

function checkUserPermissions() {
    const currentUser = "2"; 
    const permissions = JSON.parse(localStorage.getItem(`userRoles_${currentUser}`));
    if (permissions && permissions['view-reports'] === false) {
        document.body.innerHTML = "<h1 style='text-align:center; margin-top:20%; color:red;'>🚫 ACCESS DENIED</h1>";
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}