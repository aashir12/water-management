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
    loadTableData();

    // 1. Theme Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // 2. Set Default Date
    document.getElementById('fillingDate').valueAsDate = new Date();

    // 3. Handle Update Logic
    const fillingForm = document.getElementById('fillingForm');
    fillingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const pName = document.getElementById('targetProductName').value;
        const addQty = parseInt(document.getElementById('fillingQty').value);

        if (!pName) {
            alert("Please select a product from the table first!");
            return;
        }

        let products = JSON.parse(localStorage.getItem('waterInventory')) || [];
        const index = products.findIndex(p => p.name === pName);

        if (index !== -1) {
            // Internal Logic: Add new filling to existing stock
            let currentFilling = parseInt(products[index].qty || 0);
            products[index].qty = currentFilling + addQty;
            
            localStorage.setItem('waterInventory', JSON.stringify(products));
            alert(`✅ Stock Updated: ${pName} increased by ${addQty}`);
            
            fillingForm.reset();
            document.getElementById('fillingDate').valueAsDate = new Date();
            loadTableData();
        }
    });
});

// 4. Load Data from Storage
function loadTableData() {
    const products = JSON.parse(localStorage.getItem('waterInventory')) || [];
    const tbody = document.getElementById('fillingTableBody');
    tbody.innerHTML = "";

    products.forEach((p, index) => {
        const row = document.createElement('tr');
        
        // Match columns in image: SNO, Name, Price, Type, Filling, Empty, Total
        const fillingStock = p.qty || 0;
        const emptyStock = Math.floor(Math.random() * 500); // Simulated data
        const total = parseInt(fillingStock) + emptyStock;

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.type}</td>
            <td>${fillingStock}</td>
            <td>${emptyStock}</td>
            <td>${total}</td>
        `;

        // Row Selection Linking: Click table to fill form
        row.onclick = () => {
            document.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
            row.classList.add('selected-row');
            document.getElementById('targetProductName').value = p.name;
            document.getElementById('fillingQty').focus();
        };

        tbody.appendChild(row);
    });
}