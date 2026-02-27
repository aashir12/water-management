document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Load
    initCurrentDate();
    loadEmployeesToDropdown();
    seedAreaAssignments(); // Initial data for testing

    // 2. Button Event Listener (Fixing the "Buttons not working" issue)
    const selectBtn = document.getElementById('btnSelectArea'); 
    if (selectBtn) {
        selectBtn.addEventListener('click', generateAreaOutput);
    }
});

// --- HELPER: Set Professional Date ---
function initCurrentDate() {
    const today = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const dateInput = document.getElementById('currentDate');
    if (dateInput) {
        dateInput.value = today.toLocaleDateString('en-GB', options).replace(/ /g, '-');
    }
}

// --- INTERNAL LINK: Fetch Staff from employeeDB ---
function loadEmployeesToDropdown() {
    const empSelect = document.getElementById('employeeSelect');
    const employeeDB = JSON.parse(localStorage.getItem('employeeDB')) || [];
    
    empSelect.innerHTML = '<option value="">SELECT EMPLOYEE 👤</option>';

    employeeDB.filter(emp => emp.status === 'Active').forEach(emp => {
        let opt = document.createElement('option');
        opt.value = emp.id; // Linked Unique ID
        opt.textContent = `${emp.fName} ${emp.lName} (${emp.accNo})`;
        empSelect.appendChild(opt);
    });
}

// --- UI SYNC: Update labels as you select ---
function syncLabels() {
    const empSelect = document.getElementById('employeeSelect');
    const daySelect = document.getElementById('daySelect');
    
    const selectedText = empSelect.options[empSelect.selectedIndex].text;
    const empNameOnly = selectedText.split(' (')[0];

    document.getElementById('displayEmpName').value = empSelect.value ? empNameOnly : "";
    document.getElementById('displayDay').value = daySelect.value;
}

// --- MAIN OUTPUT LOGIC: Generate Employee Area List ---
function generateAreaOutput() {
    const tbody = document.getElementById('areaTableBody');
    const empId = document.getElementById('employeeSelect').value;
    const day = document.getElementById('daySelect').value;

    if (!empId || !day) {
        alert("⚠️ Please select Employee and Day first!");
        return;
    }

    // Retrieve from "Database"
    const areaAssignments = JSON.parse(localStorage.getItem('areaAssignmentsDB')) || [];
    
    // Filter logic: Match selected employee and selected day
    const filteredResults = areaAssignments.filter(item => item.empId == empId && item.day == day);

    // Clear Table
    tbody.innerHTML = "";
    let totalRequired = 0;

    if (filteredResults.length === 0) {
        tbody.innerHTML = `<tr><td colspan="15" style="text-align:center; padding:100px; color:#888;">
            No Area Assignments Found for this Employee on ${day}. 🔍
        </td></tr>`;
    } else {
        filteredResults.forEach((row, index) => {
            totalRequired += parseInt(row.reqBottles);
            
            const tr = document.createElement('tr');
            // Professional row highlight for the first entry
            if(index === 0) tr.classList.add('selected-row-blue');

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${row.areaName}</td>
                <td>${row.custId}</td>
                <td><strong>${row.custName.toUpperCase()}</strong></td>
                <td>${row.address}</td>
                <td>${row.contact}</td>
                <td class="req-cell">${row.reqBottles}</td>
                <td>${row.price}.00</td>
                <td></td> <!-- Sale Bottle (Manual) -->
                <td></td> <!-- Return Bottle (Manual) -->
                <td></td> <!-- Bill No (Manual) -->
                <td></td> <!-- Payment (Manual) -->
                <td class="bal-amt">${row.balanceAmt}</td>
                <td></td> <!-- Received (Manual) -->
                <td></td> <!-- Balance Bottle (Manual) -->
            `;
            tbody.appendChild(tr);
        });
    }

    // Update Bottom Footer Total
    document.getElementById('totalBottles').innerText = totalRequired;
}

// --- DATABASE STORE: MOCK DATA SEEDER ---
function seedAreaAssignments() {
    if (!localStorage.getItem('areaAssignmentsDB')) {
        const mockData = [
            { 
                empId: "1709043232145", // Match an ID from your employeeDB
                day: "Monday", 
                areaName: "North Karachi", 
                custId: "1001", 
                custName: "SHEHZAD", 
                address: "House 12, Sector 11", 
                contact: "+9231234567", 
                reqBottles: 10, 
                price: 80, 
                balanceAmt: "450.00" 
            },
            { 
                empId: "1709043232145", 
                day: "Monday", 
                areaName: "North Karachi", 
                custId: "1002", 
                custName: "Ahmed Ali", 
                address: "Street 4, Block H", 
                contact: "+92300112233", 
                reqBottles: 5, 
                price: 80, 
                balanceAmt: "0.00" 
            }
        ];
        localStorage.setItem('areaAssignmentsDB', JSON.stringify(mockData));
    }
}