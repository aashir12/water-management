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
    // Theme Toggle Persistence
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });
});

// 1. Modal Controls
function openAdvanceSearch() {
    document.getElementById('searchModal').style.display = 'flex';
}

function closeAdvanceSearch() {
    document.getElementById('searchModal').style.display = 'none';
}

// 2. Search Logic (Simulates your database from image)
function simulateSearch() {
    const tbody = document.getElementById('modalTableBody');
    // Pre-populating with data from your image
    tbody.innerHTML = `
        <tr onclick="redirectCustomer(1, 'ALI', 'Lakrachi', 24.947322, 67.058370)">
            <td>1</td>
            <td>1</td>
            <td>ALI</td>
            <td>Lakrachi</td>
            <td>+9231234567</td>
            <td>24.947322...</td>
            <td>67.058370...</td>
        </tr>
        <tr onclick="redirectCustomer(2, 'Tahir', 'Gulshan', 24.9180, 67.0971)">
            <td>2</td>
            <td>2</td>
            <td>Tahir</td>
            <td>Gulshan-e-Iqbal</td>
            <td>+92333111222</td>
            <td>24.9180...</td>
            <td>67.0971...</td>
        </tr>
    `;
}

// 3. THE REDIRECT LOGIC (Key part you asked for)
function redirectCustomer(id, name, addr, lat, lng) {
    // Fill the Main Workspace Fields
    document.getElementById('targetId').value = id;
    document.getElementById('targetName').value = name;
    document.getElementById('targetAddr').value = addr;
    document.getElementById('gpsCoords').value = `${lat}, ${lng}`;

    // UPDATE THE MAP LIVE
    // We update the iframe source with the new coordinates
    const mapIframe = document.getElementById('mapIframe');
    const newMapUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=es;z=14&output=embed`;
    mapIframe.src = newMapUrl;

    // Close Modal and notify
    alert(`📍 Location Redirected to: ${name} (${addr})`);
    closeAdvanceSearch();
}

function saveCustomerPin() {
    const coords = document.getElementById('gpsCoords').value;
    if(!coords) return alert("Select a customer from Advance Search first!");
    alert("✅ SUCCESS: GPS Pin linked to Customer Profile in database.");
}

function pasteCoordinates() {
    document.getElementById('gpsCoords').value = "24.947322, 67.058370";
}