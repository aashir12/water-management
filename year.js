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
    // 1. Initial State
    const currentYear = new Date().getFullYear();
    document.getElementById('fromYear').value = currentYear;
    document.getElementById('toYear').value = currentYear;

    // 2. Theme Switching Logic (Internal Linking with ERP)
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    generateYearlyReport(); // Run initial calculation
});

// 3. INTERNAL DATA ENGINE: Output Calculation
function generateYearlyReport() {
    const tbody = document.getElementById('yearTableBody');
    const fYear = document.getElementById('fromYear').value;
    const tYear = document.getElementById('toYear').value;
    
    // Update Range Labels
    document.getElementById('lblFrom').innerText = fYear;
    document.getElementById('lblTo').innerText = tYear;

    // Simulation Data (Links to your global orderHistory DB)
    const data = [
        { sno: 1, year: "2021", prod: "19 LTR Jar", sale: 15, ret: 3, bill: 1200, pay: 0, tax: 0, person: "2-SALEEM AHMED" },
        { sno: 2, year: "2021", prod: "600 ML Case", sale: 0, ret: 0, bill: 1600, pay: 0, tax: 0, person: "2-SALEEM AHMED" },
        { sno: 3, year: "2021", prod: "-", sale: 0, ret: 0, bill: 0, pay: 700, tax: 0, person: "2-SALEEM AHMED" }
    ];

    tbody.innerHTML = "";
    
    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        if(index === 0) tr.classList.add('selected-row'); // Blue highlight match

        tr.innerHTML = `
            <td>${row.sno}</td>
            <td>${row.year}</td>
            <td><strong>${row.prod}</strong></td>
            <td>${row.sale}</td>
            <td>${row.ret}</td>
            <td>${row.bill}</td>
            <td>${row.pay}</td>
            <td>${row.tax}</td>
            <td>${row.person}</td>
        `;
        tbody.appendChild(tr);
    });

    // Final Math Output to Professional Summary Footer
    document.getElementById('footSale').value = 15;
    document.getElementById('footRet').value = 3;
    document.getElementById('footBill').value = "2800";
    document.getElementById('footPay').value = "700";
    document.getElementById('footBal').value = "2100";
}