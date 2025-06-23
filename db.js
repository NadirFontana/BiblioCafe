// ==========================================
// DATABASE MANAGER - VERCEL SIMPLIFIED
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
            // Test della connessione
            const response = await fetch(`${this.API_BASE}/health`);
            
            if (!response.ok) {
                throw new Error(`API non disponibile: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Connessione alle API stabilita:', data.message);
            
            this.initialized = true;
            return true;

        } catch (error) {
            console.error('❌ Errore inizializzazione API:', error);
            // Non fare throw, continua comunque
            this.initialized = true; // Permetti di continuare anche se health check fallisce
            return false;
        }
    }

    // ==========================================
    // OPERAZIONI SULLE CATEGORIE
    // ==========================================

    async getAllCategories() {
        try {
            const response = await fetch(`${this.API_BASE}/categories`);
            
            if (!response.ok) {
                throw new Error(`Errore recupero categorie: ${response.status}`);
            }

            const data = await response.json();
            return data.categories || [];

        } catch (error) {
            console.error('Errore nel recupero delle categorie:', error);
            // Ritorna dati di fallback
            return this.getFallbackCategories();
        }
    }

    // ==========================================
    // OPERAZIONI SUI PRODOTTI
    // ==========================================

    async getAllProducts() {
        try {
            const response = await fetch(`${this.API_BASE}/products`);
            
            if (!response.ok) {
                throw new Error(`Errore recupero prodotti: ${response.status}`);
            }

            const data = await response.json();
            return data.products || [];

        } catch (error) {
            console.error('Errore nel recupero dei prodotti:', error);
            // Ritorna dati di fallback
            return this.getFallbackProducts();
        }
    }

    async getProductsByCategory(categoryId) {
        try {
            const response = await fetch(`${this.API_BASE}/products?category=${encodeURIComponent(categoryId)}`);
            
            if (!response.ok) {
                throw new Error(`Errore recupero prodotti per categoria: ${response.status}`);
            }

            const data = await response.json();
            return data.products || [];

        } catch (error) {
            console.error('Errore nel recupero dei prodotti per categoria:', error);
            // Ritorna dati di fallback filtrati
            const allProducts = this.getFallbackProducts();
            return allProducts.filter(product => product.category === categoryId);
        }
    }

    // ==========================================
    // DATI DI FALLBACK (se le API non funzionano)
    // ==========================================

    getFallbackCategories() {
        return [
            { id: 'caffe', name: 'Caffè e Bevande Calde', emoji: '☕' },
            { id: 'bevande-fredde', name: 'Bevande Fredde', emoji: '🥤' },
            { id: 'dolci', name: 'Dolci e Pasticceria', emoji: '🧁' },
            { id: 'salati', name: 'Snack Salati', emoji: '🥪' },
            { id: 'gelati', name: 'Gelati', emoji: '🍦' },
            { id: 'cocktail', name: 'Cocktail', emoji: '🍹' }
        ];
    }

    getFallbackProducts() {
        return [
            // Caffè e Bevande Calde
            { id: 1, category: 'caffe', name: 'Espresso', description: 'Il nostro caffè signature, tostato artigianalmente', price: 1.20 },
            { id: 2, category: 'caffe', name: 'Cappuccino', description: 'Espresso con schiuma di latte cremosa', price: 1.80 },
            { id: 3, category: 'caffe', name: 'Caffè Americano', description: 'Espresso allungato con acqua calda', price: 1.50 },
            { id: 4, category: 'caffe', name: 'Latte Macchiato', description: 'Latte caldo con un shot di espresso', price: 2.20 },
            { id: 5, category: 'caffe', name: 'Cioccolata Calda', description: 'Cioccolato fondente con panna montata', price: 2.80 },
            { id: 6, category: 'caffe', name: 'Tè Verde', description: 'Tè verde biologico selezionato', price: 2.00 },

            // Bevande Fredde
            { id: 7, category: 'bevande-fredde', name: 'Caffè Freddo', description: 'Espresso ghiacciato dolcificato', price: 2.00 },
            { id: 8, category: 'bevande-fredde', name: 'Cappuccino Freddo', description: 'Cappuccino servito con ghiaccio', price: 2.50 },
            { id: 9, category: 'bevande-fredde', name: 'Spremuta d\'Arancia', description: 'Arance fresche spremute al momento', price: 3.50 },
            { id: 10, category: 'bevande-fredde', name: 'Limonata', description: 'Limoni freschi, acqua e zucchero di canna', price: 2.80 },
            { id: 11, category: 'bevande-fredde', name: 'Tè Freddo Pesca', description: 'Tè nero aromatizzato alla pesca', price: 2.50 },

            // Dolci e Pasticceria
            { id: 12, category: 'dolci', name: 'Cornetto', description: 'Cornetto artigianale vuoto o con crema', price: 1.80 },
            { id: 13, category: 'dolci', name: 'Maritozzo', description: 'Dolce romano con panna montata fresca', price: 3.20 },
            { id: 14, category: 'dolci', name: 'Tiramisù', description: 'Il nostro tiramisù della casa', price: 4.50 },
            { id: 15, category: 'dolci', name: 'Cannolo Siciliano', description: 'Cannolo con ricotta fresca e gocce di cioccolato', price: 3.80 },

            // Snack Salati
            { id: 16, category: 'salati', name: 'Toast Prosciutto e Formaggio', description: 'Toast con prosciutto cotto e fontina', price: 4.50 },
            { id: 17, category: 'salati', name: 'Panino Caprese', description: 'Mozzarella, pomodoro, basilico e olio EVO', price: 5.20 },
            { id: 18, category: 'salati', name: 'Focaccia Rosmarino', description: 'Focaccia calda con rosmarino e sale grosso', price: 2.80 },

            // Gelati
            { id: 19, category: 'gelati', name: 'Gelato Artigianale (2 gusti)', description: 'Scegli due gusti tra i nostri disponibili', price: 3.50 },
            { id: 20, category: 'gelati', name: 'Coppa Gelato (3 gusti)', description: 'Tre gusti a scelta con panna e ciliegia', price: 4.80 },

            // Cocktail
            { id: 21, category: 'cocktail', name: 'Spritz Aperol', description: 'Aperol, Prosecco, soda e arancia', price: 6.50 },
            { id: 22, category: 'cocktail', name: 'Negroni', description: 'Gin, Campari e Vermouth rosso', price: 8.00 },
            { id: 23, category: 'cocktail', name: 'Mojito', description: 'Rum bianco, lime, menta e soda', price: 7.50 }
        ];
    }

    // ==========================================
    // UTILITY
    // ==========================================

    async getStats() {
        try {
            const response = await fetch(`${this.API_BASE}/stats`);
            
            if (!response.ok) {
                throw new Error(`Errore recupero statistiche: ${response.status}`);
            }

            const data = await response.json();
            return {
                categories: data.categories || 0,
                products: data.products || 0,
                connected: true,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('Errore nel recupero delle statistiche:', error);
            return {
                categories: this.getFallbackCategories().length,
                products: this.getFallbackProducts().length,
                connected: false,
                error: error.message
            };
        }
    }

    // Metodo semplificato per il seeding (non necessario per il funzionamento base)
    async seedDatabase() {
        console.log('🌱 Seeding non necessario, dati già disponibili');
        return { message: 'Dati già disponibili' };
    }
}

// Istanza globale del database
const menuDB = new MenuDatabase();

// Debug: esponi il database globalmente per i test
if (typeof window !== 'undefined') {
    window.menuDB = menuDB;
}