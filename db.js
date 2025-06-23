// ==========================================
// DATABASE MANAGER - CORREZIONI PER VERCEL
// ==========================================

class MenuDatabase {
    constructor() {
        // Base URL per le API
        this.API_BASE = '/api';
        this.initialized = false;
    }

    // Inizializza la connessione alle API
    async init() {
        try {
            // Test della connessione con health check semplificato
            console.log('🔄 Inizializzazione database...');
            
            // Prova a caricare le categorie per testare la connessione
            const categoriesTest = await this.getAllCategories();
            const productsTest = await this.getAllProducts();
            
            console.log(`✅ Database inizializzato: ${categoriesTest.length} categorie, ${productsTest.length} prodotti`);
            
            this.initialized = true;
            return true;

        } catch (error) {
            console.error('❌ Errore inizializzazione API:', error);
            this.initialized = true; // Permetti di continuare comunque
            return false;
        }
    }

    // ==========================================
    // OPERAZIONI SULLE CATEGORIE
    // ==========================================

    async getAllCategories() {
        try {
            console.log('📂 Recupero categorie...');
            const response = await fetch(`${this.API_BASE}/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Categorie caricate:', data.categories?.length || 0);
            return data.categories || [];

        } catch (error) {
            console.error('❌ Errore nel recupero delle categorie:', error);
            showNotification?.('Errore caricamento categorie, uso dati di backup');
            return this.getFallbackCategories();
        }
    }

    async createCategory(categoryData) {
        try {
            console.log('➕ Creazione categoria:', categoryData);
            const response = await fetch(`${this.API_BASE}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Categoria creata:', result);
            return result;

        } catch (error) {
            console.error('❌ Errore creazione categoria:', error);
            throw error;
        }
    }

    // ==========================================
    // OPERAZIONI SUI PRODOTTI
    // ==========================================

    async getAllProducts() {
        try {
            console.log('🛒 Recupero prodotti...');
            const response = await fetch(`${this.API_BASE}/products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Prodotti caricati:', data.products?.length || 0);
            return data.products || [];

        } catch (error) {
            console.error('❌ Errore nel recupero dei prodotti:', error);
            showNotification?.('Errore caricamento prodotti, uso dati di backup');
            return this.getFallbackProducts();
        }
    }

    async getProductsByCategory(categoryId) {
        try {
            console.log('🔍 Recupero prodotti per categoria:', categoryId);
            const response = await fetch(`${this.API_BASE}/products?category=${encodeURIComponent(categoryId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`✅ Prodotti categoria ${categoryId}:`, data.products?.length || 0);
            return data.products || [];

        } catch (error) {
            console.error('❌ Errore nel recupero dei prodotti per categoria:', error);
            const allProducts = this.getFallbackProducts();
            return allProducts.filter(product => product.category_id === categoryId);
        }
    }

    async createProduct(productData) {
        try {
            console.log('➕ Creazione prodotto:', productData);
            
            // Validazione dati
            if (!productData.category_id || !productData.name || !productData.description || productData.price == null) {
                throw new Error('Dati prodotto incompleti');
            }

            const response = await fetch(`${this.API_BASE}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Prodotto creato:', result);
            return result;

        } catch (error) {
            console.error('❌ Errore creazione prodotto:', error);
            throw error;
        }
    }

    async updateProduct(productId, productData) {
        try {
            console.log('✏️ Aggiornamento prodotto:', productId, productData);
            
            const response = await fetch(`${this.API_BASE}/products?id=${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Prodotto aggiornato:', result);
            return result;

        } catch (error) {
            console.error('❌ Errore aggiornamento prodotto:', error);
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            console.log('🗑️ Eliminazione prodotto:', productId);
            
            const response = await fetch(`${this.API_BASE}/products?id=${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Prodotto eliminato:', result);
            return result;

        } catch (error) {
            console.error('❌ Errore eliminazione prodotto:', error);
            throw error;
        }
    }

    // ==========================================
    // DATI DI FALLBACK (aggiornati con category_id)
    // ==========================================

    getFallbackCategories() {
        return [
            { id: 'caffe', name: 'Caffè e Bevande Calde', emoji: '☕', order_index: 1 },
            { id: 'bevande-fredde', name: 'Bevande Fredde', emoji: '🥤', order_index: 2 },
            { id: 'dolci', name: 'Dolci e Pasticceria', emoji: '🧁', order_index: 3 },
            { id: 'salati', name: 'Snack Salati', emoji: '🥪', order_index: 4 },
            { id: 'gelati', name: 'Gelati', emoji: '🍦', order_index: 5 },
            { id: 'cocktail', name: 'Cocktail', emoji: '🍹', order_index: 6 }
        ];
    }

    getFallbackProducts() {
        return [
            // Caffè e Bevande Calde
            { id: 1, category_id: 'caffe', name: 'Espresso', description: 'Il nostro caffè signature, tostato artigianalmente', price: 1.20, available: true, order_index: 1 },
            { id: 2, category_id: 'caffe', name: 'Cappuccino', description: 'Espresso con schiuma di latte cremosa', price: 1.80, available: true, order_index: 2 },
            { id: 3, category_id: 'caffe', name: 'Caffè Americano', description: 'Espresso allungato con acqua calda', price: 1.50, available: true, order_index: 3 },
            { id: 4, category_id: 'caffe', name: 'Latte Macchiato', description: 'Latte caldo con un shot di espresso', price: 2.20, available: true, order_index: 4 },
            { id: 5, category_id: 'caffe', name: 'Cioccolata Calda', description: 'Cioccolato fondente con panna montata', price: 2.80, available: true, order_index: 5 },

            // Bevande Fredde
            { id: 6, category_id: 'bevande-fredde', name: 'Caffè Freddo', description: 'Espresso ghiacciato dolcificato', price: 2.00, available: true, order_index: 1 },
            { id: 7, category_id: 'bevande-fredde', name: 'Spremuta d\'Arancia', description: 'Arance fresche spremute al momento', price: 3.50, available: true, order_index: 2 },
            { id: 8, category_id: 'bevande-fredde', name: 'Limonata', description: 'Limoni freschi, acqua e zucchero di canna', price: 2.80, available: true, order_index: 3 },

            // Dolci
            { id: 9, category_id: 'dolci', name: 'Cornetto', description: 'Cornetto artigianale vuoto o con crema', price: 1.80, available: true, order_index: 1 },
            { id: 10, category_id: 'dolci', name: 'Tiramisù', description: 'Il nostro tiramisù della casa', price: 4.50, available: true, order_index: 2 },

            // Snack Salati
            { id: 11, category_id: 'salati', name: 'Toast Prosciutto e Formaggio', description: 'Toast con prosciutto cotto e fontina', price: 4.50, available: true, order_index: 1 },
            { id: 12, category_id: 'salati', name: 'Panino Caprese', description: 'Mozzarella, pomodoro, basilico e olio EVO', price: 5.20, available: true, order_index: 2 }
        ];
    }

    // ==========================================
    // UTILITY E DEBUG
    // ==========================================

    async getStats() {
        try {
            const [categories, products] = await Promise.all([
                this.getAllCategories(),
                this.getAllProducts()
            ]);

            return {
                categories: categories.length,
                products: products.length,
                connected: true,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Errore nel recupero delle statistiche:', error);
            return {
                categories: this.getFallbackCategories().length,
                products: this.getFallbackProducts().length,
                connected: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Test di connessione semplificato
    async testConnection() {
        try {
            const stats = await this.getStats();
            console.log('🔍 Test connessione:', stats);
            return stats.connected;
        } catch (error) {
            console.error('❌ Test connessione fallito:', error);
            return false;
        }
    }
}

// Istanza globale del database
const menuDB = new MenuDatabase();

// Debug: esponi il database globalmente per i test
if (typeof window !== 'undefined') {
    window.menuDB = menuDB;
    
    // Funzione di debug globale
    window.debugDB = async () => {
        console.log('🔍 DEBUG DATABASE');
        console.log('Inizializzato:', menuDB.initialized);
        
        try {
            const categories = await menuDB.getAllCategories();
            const products = await menuDB.getAllProducts();
            const stats = await menuDB.getStats();
            
            console.log('📊 Statistiche:', stats);
            console.log('📂 Categorie:', categories);
            console.log('🛒 Prodotti:', products);
            
            return { categories, products, stats };
        } catch (error) {
            console.error('❌ Errore debug:', error);
            return { error: error.message };
        }
    };
}
