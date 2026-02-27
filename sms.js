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
    // 1. Initial Link: Load Customers from CRM Database
    loadCustomers();
    renderSMSLog();

    // Theme Toggle logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 2. Form Submission (Storage Data)
    const smsForm = document.getElementById('smsForm');
    smsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const customerName = document.getElementById('custSelect').selectedOptions[0].text;
        const phone = document.getElementById('phoneDisplay').value;
        const message = document.getElementById('smsBody').value;

        const newLog = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            name: customerName,
            phone: phone,
            msg: message,
            status: "✅ Sent"
        };

        // Save to LocalStorage 'smsSentHistory'
        let logs = JSON.parse(localStorage.getItem('smsSentHistory')) || [];
        logs.push(newLog);
        localStorage.setItem('smsSentHistory', JSON.stringify(logs));

        alert(`📱 SMS Sent to ${customerName} successfully!`);
        smsForm.reset();
        document.getElementById('phoneDisplay').value = "";
        renderSMSLog();
    });
});

// 3. INTERNAL LINKING: Fetch customers from 'myCustomers' key
function loadCustomers() {
    const customers = JSON.parse(localStorage.getItem('myCustomers')) || [];
    const select = document.getElementById('custSelect');
    
    customers.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.phone; // Store phone in value for easy access
        opt.dataset.name = c.name;
        opt.innerHTML = `${c.name} 👤`;
        select.appendChild(opt);
    });
}

function updatePhone() {
    const select = document.getElementById('custSelect');
    document.getElementById('phoneDisplay').value = select.value;
}

// 4. SMS Templates logic
function applyTemplate() {
    const temp = document.getElementById('templateSelect').value;
    const body = document.getElementById('smsBody');
    const name = document.getElementById('custSelect').selectedOptions[0].text.replace(' 👤', '');

    if (temp === 'bill') {
        body.value = `Dear ${name}, your monthly water bill has been generated. Please check your dashboard to pay. Thank you!`;
    } else if (temp === 'pay') {
        body.value = `Thank you ${name}! We have received your payment. Your balance has been updated in our records.`;
    } else if (temp === 'stock') {
        body.value = `Attention ${name}: Your current jar stock is running low. Please book a refill soon to avoid interruption.`;
    } else {
        body.value = "";
    }
}

// 5. Output: Render sent logs from Storage
function renderSMSLog() {
    const logs = JSON.parse(localStorage.getItem('smsSentHistory')) || [];
    const tbody = document.getElementById('smsLogBody');
    tbody.innerHTML = "";

    logs.slice().reverse().forEach((log, index) => {
        const row = `<tr>
            <td>${logs.length - index}</td>
            <td>${log.date}</td>
            <td><strong>${log.name}</strong></td>
            <td>${log.phone}</td>
            <td><small>${log.msg.substring(0, 40)}...</small></td>
            <td><span style="color:green; font-weight:bold;">${log.status}</span></td>
        </tr>`;
        tbody.innerHTML += row;
    });

    if(logs.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' style='text-align:center; padding:20px; opacity:0.5;'>No SMS records found.</td></tr>";
    }
}