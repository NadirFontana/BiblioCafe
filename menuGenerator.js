async function generateMenu(containerId, mainContentId) {
    let currentCategoryIndex = 0;
    let menuData;

    try {
        // Carica i dati dal JSON
        const response = await fetch('menuData.json');
        if (!response.ok) {
            throw new Error('Errore nel caricamento dei dati del menu');
        }
        menuData = await response.json();

        // Genera la navigazione
        const navContainer = document.getElementById(containerId);
        menuData.categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'nav-button';
            button.setAttribute('data-category', category.id);
            button.textContent = category.name;
            navContainer.appendChild(button);
        });

        // Genera le sezioni del menu
        const mainContent = document.getElementById(mainContentId);
        menuData.categories.forEach(category => {
            const section = document.createElement('section');
            section.className = 'category';
            section.id = category.id;

            const title = document.createElement('h2');
            title.className = 'category-title';
            title.textContent = category.name;
            section.appendChild(title);

            const grid = document.createElement('div');
            grid.className = 'menu-grid';

            const categoryProducts = menuData.products.filter(product => 
                product.category === category.id
            );
            
            categoryProducts.forEach(product => {
                const item = document.createElement('div');
                item.className = 'item';
                item.innerHTML = `
                    <div class="item-name">${product.name}</div>
                    <div class="item-description">${product.description}</div>
                    <div class="item-price">€${product.price.toFixed(2)}</div>
                `;
                grid.appendChild(item);
            });

            section.appendChild(grid);
            mainContent.appendChild(section);
        });

        function switchCategory(categoryId) {
            const currentCategory = document.querySelector('.category.active');
            const targetCategory = document.getElementById(categoryId);
            
            if (currentCategory === targetCategory) return;

            document.querySelectorAll('.category').forEach(cat => {
                if (cat !== targetCategory) {
                    cat.style.display = 'none';
                    cat.classList.remove('active');
                }
            });

            targetCategory.style.display = 'block';
            targetCategory.classList.add('active');
        }

        const buttons = document.querySelectorAll('.nav-button');
        
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                
                switchCategory(button.dataset.category);
                currentCategoryIndex = index;
            });
        });

        // Attiva la prima categoria
        buttons[0]?.click();

    } catch (error) {
        console.error('Errore nel caricamento del menu:', error);
        const mainContent = document.getElementById(mainContentId);
        mainContent.innerHTML = `
            <div class="error-message">
                Si è verificato un errore nel caricamento del menu. 
                Riprova più tardi.
            </div>
        `;
    }
}

// Uso della funzione
document.addEventListener('DOMContentLoaded', () => {
    generateMenu('menu-nav', 'menu-content');
});