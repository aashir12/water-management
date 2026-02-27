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
    // 1. Initial Load: Populate Area Dropdown from Data Store
    loadAreas();

    // 2. Set Today's Date automatically
    document.getElementById('openDate').valueAsDate = new Date();

    // 3. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 4. Save Customer Logic (Data Storage)
    const customerForm = document.getElementById('customerForm');
    customerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect Schedule
        const schedule = [];
        document.querySelectorAll('#deliverySchedule input:checked').forEach(cb => {
            schedule.push(cb.value);
        });

        const customerData = {
            id: Date.now(),
            name: document.getElementById('cName').value,
            phone: document.getElementById('cPhone').value,
            area: document.getElementById('cArea').value,
            schedule: schedule,
            balance: document.getElementById('openBalance').value,
            bottles: document.getElementById('openBottle').value
        };

        // Internal Link Storage: Store in shared 'myCustomers' key
        let customers = JSON.parse(localStorage.getItem('myCustomers')) || [];
        customers.push(customerData);
        localStorage.setItem('myCustomers', JSON.stringify(customers));

        alert(`✅ SUCCESS: Customer "${customerData.name}" has been registered.`);
        customerForm.reset();
        document.getElementById('openDate').valueAsDate = new Date();
    });

    // 5. Password visibility logic
    document.getElementById('showPass').addEventListener('change', function() {
        document.getElementById('cPass').type = this.checked ? 'text' : 'password';
    });
});

// Load areas from your separate Area Management module data
function loadAreas() {
    const areas = JSON.parse(localStorage.getItem('globalAreas')) || ["Gulshan", "DHA", "North Nazimabad"];
    const select = document.getElementById('cArea');
    areas.forEach(area => {
        const opt = document.createElement('option');
        opt.value = area;
        opt.innerHTML = area + " 🚩";
        select.appendChild(opt);
    });
}

function searchCustomer() {
    alert("🔍 Searching Database... (Linked to localStorage)");
}