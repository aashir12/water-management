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
    // 1. Initial Load of Data
    generateProdReport();

    // 2. Theme Switching Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // Set Default Dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fromDate').value = "2021-01-01";
    document.getElementById('toDate').value = "2021-01-31";
});

// 3. INTERNAL LINKING ENGINE
function generateProdReport() {
    const tbody = document.getElementById('reportTableBody');
    tbody.innerHTML = "";

    // Mock Data reflecting the Image's exact content
    const mockData = [
        { sno: 1, date: "07-Jan-2021", salesman: "2-SALEEM AHMED", product: "19 LTR", qty: 10, amount: 800 },
        { sno: 2, date: "09-Jan-2021", salesman: "2-SALEEM AHMED", product: "19 LTR", qty: 5, amount: 400 }
    ];

    mockData.forEach((row, index) => {
        const tr = document.createElement('tr');
        
        // Add blue selection to the first row as seen in the image
        if(index === 0) tr.classList.add('selected-row');

        tr.innerHTML = `
            <td><span class="yellow-marker">${index === 0 ? '▶' : ''}</span></td>
            <td>${row.sno}</td>
            <td>${row.date}</td>
            <td>${row.salesman}</td>
            <td><strong>${row.product}</strong></td>
            <td>${row.qty}</td>
            <td>${row.amount}</td>
        `;
        tbody.appendChild(tr);
    });

    // Update bottom summary totals
    document.getElementById('totalAmt').value = "1200";
    document.getElementById('totalQty').value = "15";
}