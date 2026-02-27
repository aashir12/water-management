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
    // Shared Internal Databases
    loadEmployees();
    loadAreasToDropdown();
    renderAssignmentsTable();

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
});

// 1. LINK: Pull Employees from Staff module
function loadEmployees() {
    // Storage key: employeeDB (used in Staff.js)
    const employees = JSON.parse(localStorage.getItem('employeeDB')) || [];
    const select = document.getElementById('empSelect');
    
    employees.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.fName + " " + emp.lName;
        opt.innerHTML = `${emp.fName} ${emp.lName} 👤`;
        select.appendChild(opt);
    });
}

// 2. MODAL LOGIC: Toggle the Add Area Popup
function toggleAreaModal(show) {
    const modal = document.getElementById('areaModal');
    modal.style.display = show ? 'flex' : 'none';
    if(show) document.getElementById('newAreaInput').focus();
}

// 3. STORAGE LOGIC: Save New Area
function addNewAreaToStorage() {
    const areaName = document.getElementById('newAreaInput').value.trim();
    if(!areaName) return alert("Please enter Area Name!");

    let areas = JSON.parse(localStorage.getItem('globalAreas')) || [];
    if(areas.includes(areaName)) return alert("Area already exists!");

    areas.push(areaName);
    localStorage.setItem('globalAreas', JSON.stringify(areas));
    
    alert(`✅ Area "${areaName}" Stored in System.`);
    toggleAreaModal(false);
    document.getElementById('newAreaInput').value = "";
    loadAreasToDropdown();
}

// 4. DISPLAY LOGIC: Update Dropdown from Storage
function loadAreasToDropdown() {
    const areas = JSON.parse(localStorage.getItem('globalAreas')) || ["Gulshan", "DHA", "North Nazimabad"];
    const select = document.getElementById('areaSelect');
    select.innerHTML = '<option value="">SELECT AREA 🗺️</option>';

    areas.forEach(area => {
        const opt = document.createElement('option');
        opt.value = area;
        opt.innerHTML = area + " 🚩";
        select.appendChild(opt);
    });
}

// 5. ASSIGN LOGIC: Link Employee with Area
function assignAreaToEmployee() {
    const emp = document.getElementById('empSelect').value;
    const area = document.getElementById('areaSelect').value;

    if(!emp || !area) return alert("Select both Employee and Area!");

    let assignments = JSON.parse(localStorage.getItem('areaAssignments')) || [];
    assignments.push({
        id: Date.now(),
        employee: emp,
        area: area,
        customers: Math.floor(Math.random() * 50) + 1 // Simulated data
    });

    localStorage.setItem('areaAssignments', JSON.stringify(assignments));
    alert("✅ Area Assigned Successfully!");
    renderAssignmentsTable();
}

// 6. OUTPUT LOGIC: Render History Table
function renderAssignmentsTable() {
    const data = JSON.parse(localStorage.getItem('areaAssignments')) || [];
    const tbody = document.getElementById('areaTableBody');
    tbody.innerHTML = "";

    data.reverse().forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${item.employee}</strong></td>
                <td>${item.area}</td>
                <td><b style="color:var(--primary)">${item.customers} Customers</b></td>
            </tr>
        `;
    });

    if(data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:20px;'>No areas assigned yet.</td></tr>";
    }
}