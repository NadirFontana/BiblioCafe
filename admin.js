// Credenziali di default
const ADMIN_CREDENTIALS = {
    username: 'caffetteria',
    password: 'menu2024'
};

// Variabili per i dati del menu
let menuData = null;
let products = [];

// Funzione per mostrare notifiche
function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, duration);
}

// Carica i dati dal file JSON
async function loadMenuData() {
    try {
        const response = await fetch('menuData.json');
        if (!response.ok) {
            throw new Error('Errore nel caricamento dei dati');
        }
        menuData = await response.json();
        products = menuData.products;
        
        // Inizializza l'interfaccia admin
        loadCategories();
        loadProducts();
    } catch (error) {
        showNotification('Errore nel caricamento dei dati: ' + error.message, 5000);
    }
}

// Login handling
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        showNotification('Login effettuato con successo');
        
        // Carica i dati solo dopo il login con successo
        await loadMenuData();
    } else {
        showNotification('Credenziali non valide');
    }
}

function handleLogout() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    showNotification('Logout effettuato con successo');
}

// Category handling
function loadCategories() {
    // Popola la sidebar delle categorie
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = menuData.categories.map(category => `
        <button 
            onclick="filterProducts('${category.id}')" 
            class="btn btn-primary" 
            style="width: 100%; margin-bottom: 0.5rem;">
            ${category.emoji} ${category.name}
        </button>
    `).join('');

    // Popola la barra delle categorie mobile
    const categoryListMobile = document.getElementById('categoryListMobile');
    categoryListMobile.innerHTML = menuData.categories.map(category => `
        <button 
            onclick="filterProducts('${category.id}')" 
            class="btn btn-primary">
            ${category.emoji} ${category.name}
        </button>
    `).join('');

    // Aggiorna anche il select delle categorie nel form
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = menuData.categories.map(category => `
        <option value="${category.id}">${category.emoji} ${category.name}</option>
    `).join('');
}

// Product handling
function loadProducts(category = null) {
    let filteredProducts = category 
        ? products.filter(p => p.category === category)
        : products;

    const productTable = document.getElementById('productTable');
    productTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Descrizione</th>
                    <th>Prezzo</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
                ${filteredProducts.map(product => `
                    <tr>
                        <td>${product.name}</td>
                        <td>${menuData.categories.find(c => c.id === product.category)?.emoji || ''} 
                            ${menuData.categories.find(c => c.id === product.category)?.name || product.category}</td>
                        <td>${product.description}</td>
                        <td>€${product.price.toFixed(2)}</td>
                        <td class="action-buttons">
                            <button onclick="editProduct(${product.id})" class="btn btn-primary">Modifica</button>
                            <button onclick="deleteProduct(${product.id})" class="btn btn-danger">Elimina</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function filterProducts(category) {
    loadProducts(category);
}

function showAddProductForm() {
    document.getElementById('productForm').classList.remove('hidden');
    document.getElementById('productTable').classList.add('hidden');
    document.getElementById('productId').value = '';
    document.getElementById('category').value = menuData.categories[0].id;
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
}

function hideProductForm() {
    document.getElementById('productForm').classList.add('hidden');
    document.getElementById('productTable').classList.remove('hidden');
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('productForm').classList.remove('hidden');
        document.getElementById('productTable').classList.add('hidden');
        document.getElementById('productId').value = product.id;
        document.getElementById('category').value = product.category;
        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description;
        document.getElementById('price').value = product.price;
    }
}

function deleteProduct(id) {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
        products = products.filter(p => p.id !== id);
        saveChangesToFile();
        loadProducts();
        showNotification('Prodotto eliminato con successo');
    }
}

async function saveChangesToFile() {
    try {
        const response = await fetch('http://localhost:3001/admin/api/updateMenu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(menuData)
        });
        
        if (!response.ok) throw new Error('Errore nel salvataggio');
        showNotification('Modifiche salvate con successo');
        loadProducts();
    } catch (error) {
        showNotification('Errore nel salvataggio: ' + error.message);
    }
}

function handleProductSubmit(event) {
    event.preventDefault();
    const productId = document.getElementById('productId').value;
    const newProduct = {
        id: productId ? parseInt(productId) : Math.max(...products.map(p => p.id)) + 1,
        category: document.getElementById('category').value,
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value)
    };

    if (productId) {
        const index = products.findIndex(p => p.id === parseInt(productId));
        products[index] = newProduct;
        menuData.products = products; // Aggiorna menuData
    } else {
        products.push(newProduct);
        menuData.products = products; // Aggiorna menuData
    }

    saveChangesToFile();
    hideProductForm();
    loadProducts();
}