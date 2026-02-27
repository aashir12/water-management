let selectedEmployeeId = null;

document.addEventListener('DOMContentLoaded', () => {
    renderEmployeeTable();
    document.getElementById('joinDate').valueAsDate = new Date();

    // Theme Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // Save/Update Submission
    const form = document.getElementById('employeeForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveOrUpdateEmployee();
    });

    // Password Toggle
    document.getElementById('showPass').addEventListener('change', function() {
        document.getElementById('uPass').type = this.checked ? 'text' : 'password';
    });
});

// 1. DATA STORAGE LOGIC (Create & Update)
function saveOrUpdateEmployee() {
    const data = {
        id: selectedEmployeeId || Date.now(),
        accNo: selectedEmployeeId ? getAccNo(selectedEmployeeId) : Math.floor(100 + Math.random() * 900),
        date: document.getElementById('joinDate').value,
        fName: document.getElementById('fName').value.toUpperCase(),
        lName: document.getElementById('lName').value.toUpperCase(),
        nic: document.getElementById('nic').value,
        contact: document.getElementById('contact').value,
        address: document.getElementById('address').value,
        designation: document.getElementById('designation').value,
        status: document.getElementById('status').value,
        uName: document.getElementById('uName').value
    };

    let db = JSON.parse(localStorage.getItem('employeeDB')) || [];

    if (selectedEmployeeId) {
        // Update Logic
        const index = db.findIndex(e => e.id === selectedEmployeeId);
        db[index] = data;
        alert("✨ Employee Profile Updated Successfully!");
    } else {
        // New Save Logic
        db.push(data);
        alert("✅ New Employee Record Stored!");
    }

    localStorage.setItem('employeeDB', JSON.stringify(db));
    location.reload();
}

// 2. OUTPUT RENDER LOGIC
function renderEmployeeTable(filterData = null) {
    const db = filterData || JSON.parse(localStorage.getItem('employeeDB')) || [];
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = "";

    db.forEach((emp, index) => {
        const row = document.createElement('tr');
        if (emp.id === selectedEmployeeId) row.classList.add('selected-row');

        // Status Logic: If Inactive, text color turns grey
        const statusStyle = emp.status === 'Inactive' ? 'opacity: 0.5' : '';

        row.innerHTML = `
            <td class="arrow-mark">${emp.id === selectedEmployeeId ? '▶' : ''}</td>
            <td>${index + 1}</td>
            <td>${emp.accNo}</td>
            <td style="${statusStyle}">${emp.fName}</td>
            <td style="${statusStyle}">${emp.lName}</td>
        `;

        row.onclick = () => selectEmployee(emp, row);
        tbody.appendChild(row);
    });
}

// 3. INTERNAL LINKING: Populate form for EDIT/UPDATE
function selectEmployee(emp, row) {
    selectedEmployeeId = emp.id;
    document.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
    row.classList.add('selected-row');

    // Fill form fields
    document.getElementById('joinDate').value = emp.date;
    document.getElementById('fName').value = emp.fName;
    document.getElementById('lName').value = emp.lName;
    document.getElementById('nic').value = emp.nic;
    document.getElementById('contact').value = emp.contact;
    document.getElementById('address').value = emp.address;
    document.getElementById('designation').value = emp.designation;
    document.getElementById('status').value = emp.status;
    document.getElementById('uName').value = emp.uName;

    // Change Button Text to signal Update Mode
    document.getElementById('mainBtn').innerText = "Update Employee Details";
}

function getAccNo(id) {
    const db = JSON.parse(localStorage.getItem('employeeDB'));
    return db.find(e => e.id === id).accNo;
}

// 4. SEARCH LOGIC
function searchEmployees() {
    const val = document.getElementById('empSearchInput').value.toLowerCase();
    const db = JSON.parse(localStorage.getItem('employeeDB')) || [];
    const filtered = db.filter(e => e.fName.toLowerCase().includes(val) || e.accNo.toString().includes(val));
    renderEmployeeTable(filtered);
}


// Employee save karne wala function (emp.js mein)
function saveEmployee() {
    const employeeData = {
        id: Date.now(), // Unique ID linking ke liye
        fName: document.getElementById('fName').value,
        lName: document.getElementById('lName').value,
        accNo: document.getElementById('accNo').value,
        status: "Active"
    };

    let db = JSON.parse(localStorage.getItem('employeeDB')) || [];
    db.push(employeeData);
    localStorage.setItem('employeeDB', JSON.stringify(db)); // 'employeeDB' hamari main key hai
}
