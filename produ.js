// Global variable for Editing
let editId = null;

document.addEventListener('DOMContentLoaded', () => {
    displayProducts();

    // 1. Theme Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // 2. Form Submit (Save Logic)
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProduct();
    });
});

// A. SAVE Function
function saveProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const type = document.getElementById('pType').value;

    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        type: type
    };

    let products = JSON.parse(localStorage.getItem('waterInventory')) || [];
    products.push(newProduct);
    localStorage.setItem('waterInventory', JSON.stringify(products));

    alert("✅ Product Stored Successfully!");
    resetForm();
    displayProducts();
}

// B. DISPLAY Function (Output)
function displayProducts() {
    const products = JSON.parse(localStorage.getItem('waterInventory')) || [];
    const tbody = document.getElementById('productData');
    tbody.innerHTML = "";

    products.forEach((p, index) => {
        const row = document.createElement('tr');
        if(editId === p.id) row.classList.add('selected-row');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.type}</td>
            <td style="text-align:center;">
                <i class="fas fa-trash-can" style="color:red; cursor:pointer;" onclick="deleteProduct(${p.id})"></i>
            </td>
        `;

        row.onclick = () => selectRow(p.id, row);
        tbody.appendChild(row);
    });
}

// C. EDIT & UPDATE Logic
function selectRow(id, element) {
    editId = id;
    document.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
    element.classList.add('selected-row');
}

function prepareEdit() {
    if (!editId) return alert("⚠️ Pehle Table se koi Product select karein!");
    
    const products = JSON.parse(localStorage.getItem('waterInventory')) || [];
    const p = products.find(item => item.id === editId);

    document.getElementById('pName').value = p.name;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pType').value = p.type;
}

function updateProduct() {
    if (!editId) return alert("⚠️ Edit mode on karne ke liye pehle row select karein!");

    let products = JSON.parse(localStorage.getItem('waterInventory')) || [];
    const index = products.findIndex(p => p.id === editId);

    products[index].name = document.getElementById('pName').value;
    products[index].price = document.getElementById('pPrice').value;
    products[index].type = document.getElementById('pType').value;

    localStorage.setItem('waterInventory', JSON.stringify(products));
    alert("✨ Product Details Updated!");
    resetForm();
    displayProducts();
}

// D. DELETE Logic
function deleteProduct(id) {
    if (confirm("Delete this product?")) {
        let products = JSON.parse(localStorage.getItem('waterInventory')) || [];
        products = products.filter(p => p.id !== id);
        localStorage.setItem('waterInventory', JSON.stringify(products));
        displayProducts();
    }
}

// E. UTILITY Functions
function resetForm() {
    editId = null;
    document.getElementById('productForm').reset();
}