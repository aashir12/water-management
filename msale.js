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
    // 1. Theme Persistence
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 2. Initial Run
    generateMonthlyReport();
});

function generateMonthlyReport() {
    const tbody = document.getElementById('monthlyTableBody');
    const fromM = document.getElementById('fromMonth').selectedOptions[0].text;
    const toM = document.getElementById('toMonth').selectedOptions[0].text;
    
    // Update Range Labels
    document.getElementById('dispFrom').innerText = `${fromM}-${document.getElementById('fromYear').value}`;
    document.getElementById('dispTo').innerText = `${toM}-${document.getElementById('toYear').value}`;

    // Mock Data (In a real app, this filters from your shared localStorage 'orderHistory')
    const data = [
        { sno: 1, month: "Jan", year: "2024", prod: "19 LTR Jar", sale: 450, ret: 35, bill: 45000, pay: 40000, tax: 0, person: "2-SALEEM AHMED" },
        { sno: 2, month: "Jan", year: "2024", prod: "600 ML Case", sale: 120, ret: 0, bill: 7200, pay: 7200, tax: 0, person: "2-SALEEM AHMED" },
        { sno: 3, month: "Feb", year: "2024", prod: "19 LTR Jar", sale: 510, ret: 42, bill: 51000, pay: 48000, tax: 100, person: "1-TAHIR QURESHI" }
    ];

    tbody.innerHTML = "";
    let totS = 0, totR = 0, totB = 0, totP = 0;

    data.forEach((row, index) => {
        totS += row.sale; totR += row.ret; totB += row.bill; totP += row.pay;

        const tr = document.createElement('tr');
        if(index === 0) tr.style.background = "#0078D7"; // Blue highlight like image
        if(index === 0) tr.style.color = "white";

        tr.innerHTML = `
            <td>${row.sno}</td>
            <td>${row.month}</td>
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

    // Update Professional Summary Footer
    document.getElementById('totSale').value = totS;
    document.getElementById('totRet').value = totR;
    document.getElementById('totBill').value = totB.toLocaleString();
    document.getElementById('totPay').value = totP.toLocaleString();
    document.getElementById('netBalance').value = (totB - totP).toLocaleString();
}