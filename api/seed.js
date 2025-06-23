// ==========================================
// SEED DATABASE - VERCEL SERVERLESS FUNCTION
// ==========================================

// Dati di esempio per il BiblioCafè
export const SEED_CATEGORIES = [
    { id: 'caffe', name: 'Caffè e Bevande Calde', emoji: '☕' },
    { id: 'bevande-fredde', name: 'Bevande Fredde', emoji: '🥤' },
    { id: 'dolci', name: 'Dolci e Pasticceria', emoji: '🧁' },
    { id: 'salati', name: 'Snack Salati', emoji: '🥪' },
    { id: 'gelati', name: 'Gelati', emoji: '🍦' },
    { id: 'cocktail', name: 'Cocktail', emoji: '🍹' }
];

export const SEED_PRODUCTS = [
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
    { id: 12, category: 'bevande-fredde', name: 'Smoothie Frutti Rossi', description: 'Fragole, mirtilli e banana frullati', price: 4.50 },

    // Dolci e Pasticceria
    { id: 13, category: 'dolci', name: 'Cornetto', description: 'Cornetto artigianale vuoto o con crema', price: 1.80 },
    { id: 14, category: 'dolci', name: 'Maritozzo', description: 'Dolce romano con panna montata fresca', price: 3.20 },
    { id: 15, category: 'dolci', name: 'Tiramisù', description: 'Il nostro tiramisù della casa', price: 4.50 },
    { id: 16, category: 'dolci', name: 'Cannolo Siciliano', description: 'Cannolo con ricotta fresca e gocce di cioccolato', price: 3.80 },
    { id: 17, category: 'dolci', name: 'Cheesecake ai Frutti di Bosco', description: 'Cheesecake cremosa con coulis di frutti di bosco', price: 5.20 },
    { id: 18, category: 'dolci', name: 'Biscotti della Casa', description: 'Assortimento di biscotti artigianali (3 pezzi)', price: 2.50 },

    // Snack Salati
    { id: 19, category: 'salati', name: 'Toast Prosciutto e Formaggio', description: 'Toast con prosciutto cotto e fontina', price: 4.50 },
    { id: 20, category: 'salati', name: 'Panino Caprese', description: 'Mozzarella, pomodoro, basilico e olio EVO', price: 5.20 },
    { id: 21, category: 'salati', name: 'Focaccia Rosmarino', description: 'Focaccia calda con rosmarino e sale grosso', price: 2.80 },
    { id: 22, category: 'salati', name: 'Piadina Crudo e Stracciatella', description: 'Piadina con prosciutto crudo e stracciatella', price: 6.50 },
    { id: 23, category: 'salati', name: 'Tramezzino Tonno e Carciofini', description: 'Tramezzino fresco con tonno e carciofini', price: 3.80 },

    // Gelati
    { id: 24, category: 'gelati', name: 'Gelato Artigianale (2 gusti)', description: 'Scegli due gusti tra i nostri disponibili', price: 3.50 },
    { id: 25, category: 'gelati', name: 'Coppa Gelato (3 gusti)', description: 'Tre gusti a scelta con panna e ciliegia', price: 4.80 },
    { id: 26, category: 'gelati', name: 'Affogato al Caffè', description: 'Gelato alla vaniglia "affogato" nell\'espresso caldo', price: 4.20 },
    { id: 27, category: 'gelati', name: 'Granita Siciliana', description: 'Granita tradizionale (limone, caffè o mandorla)', price: 3.20 },

    // Cocktail
    { id: 28, category: 'cocktail', name: 'Spritz Aperol', description: 'Aperol, Prosecco, soda e arancia', price: 6.50 },
    { id: 29, category: 'cocktail', name: 'Negroni', description: 'Gin, Campari e Vermouth rosso', price: 8.00 },
    { id: 30, category: 'cocktail', name: 'Mojito', description: 'Rum bianco, lime, menta e soda', price: 7.50 },
    { id: 31, category: 'cocktail', name: 'Americano', description: 'Campari, Vermouth rosso e soda', price: 6.00 },
    { id: 32, category: 'cocktail', name: 'Bellini', description: 'Prosecco e purea di pesca bianca', price: 7.00 }
];

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight reqs
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('🌱 Seeding database with sample data...');
        
        // Simula il seeding
        const seedResult = {
            categories: SEED_CATEGORIES.length,
            products: SEED_PRODUCTS.length,
            timestamp: new Date().toISOString()
        };

        return res.status(200).json({
            message: 'Database seeded successfully',
            seeded: seedResult,
            categories: SEED_CATEGORIES,
            products: SEED_PRODUCTS
        });

    } catch (error) {
        console.error('Seed Error:', error);
        return res.status(500).json({ 
            error: 'Failed to seed database',
            details: error.message 
        });
    }
}