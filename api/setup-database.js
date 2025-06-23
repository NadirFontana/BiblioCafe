// ==========================================
// SETUP DATABASE - NEON POSTGRESQL
// ==========================================

import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Carica le variabili d'ambiente
dotenv.config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function setupDatabase() {
    let client;
    
    try {
        console.log('🔧 Connessione al database Neon...');
        client = await pool.connect();
        
        console.log('✅ Connesso al database Neon!');
        console.log('🔧 Creazione tabelle...');

        // Crea tabella categories
        await client.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                emoji VARCHAR(10) NOT NULL,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Tabella categories creata');

        // Crea tabella products
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                available BOOLEAN DEFAULT true,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Tabella products creata');

        // Inserisci le categorie
        console.log('📋 Inserimento categorie...');
        const categories = [
            { id: 'caffe', name: 'Caffè e Bevande Calde', emoji: '☕', order_index: 1 },
            { id: 'bevande-fredde', name: 'Bevande Fredde', emoji: '🥤', order_index: 2 },
            { id: 'dolci', name: 'Dolci e Pasticceria', emoji: '🧁', order_index: 3 },
            { id: 'salati', name: 'Snack Salati', emoji: '🥪', order_index: 4 },
            { id: 'gelati', name: 'Gelati', emoji: '🍦', order_index: 5 },
            { id: 'cocktail', name: 'Cocktail', emoji: '🍹', order_index: 6 }
        ];

        for (const category of categories) {
            await client.query(`
                INSERT INTO categories (id, name, emoji, order_index)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    emoji = EXCLUDED.emoji,
                    order_index = EXCLUDED.order_index,
                    updated_at = CURRENT_TIMESTAMP
            `, [category.id, category.name, category.emoji, category.order_index]);
        }
        console.log(`✅ ${categories.length} categorie inserite`);

        // Pulisci prodotti esistenti per evitare duplicati
        await client.query('DELETE FROM products');
        console.log('🧹 Prodotti esistenti rimossi');

        // Inserisci i prodotti
        console.log('🍽️ Inserimento prodotti...');
        const products = [
            // Caffè e Bevande Calde
            { category_id: 'caffe', name: 'Espresso', description: 'Il nostro caffè signature, tostato artigianalmente', price: 1.20, order_index: 1 },
            { category_id: 'caffe', name: 'Cappuccino', description: 'Espresso con schiuma di latte cremosa', price: 1.80, order_index: 2 },
            { category_id: 'caffe', name: 'Caffè Americano', description: 'Espresso allungato con acqua calda', price: 1.50, order_index: 3 },
            { category_id: 'caffe', name: 'Latte Macchiato', description: 'Latte caldo con un shot di espresso', price: 2.20, order_index: 4 },
            { category_id: 'caffe', name: 'Cioccolata Calda', description: 'Cioccolato fondente con panna montata', price: 2.80, order_index: 5 },
            { category_id: 'caffe', name: 'Tè Verde', description: 'Tè verde biologico selezionato', price: 2.00, order_index: 6 },

            // Bevande Fredde
            { category_id: 'bevande-fredde', name: 'Caffè Freddo', description: 'Espresso ghiacciato dolcificato', price: 2.00, order_index: 1 },
            { category_id: 'bevande-fredde', name: 'Cappuccino Freddo', description: 'Cappuccino servito con ghiaccio', price: 2.50, order_index: 2 },
            { category_id: 'bevande-fredde', name: 'Spremuta d\'Arancia', description: 'Arance fresche spremute al momento', price: 3.50, order_index: 3 },
            { category_id: 'bevande-fredde', name: 'Limonata', description: 'Limoni freschi, acqua e zucchero di canna', price: 2.80, order_index: 4 },
            { category_id: 'bevande-fredde', name: 'Tè Freddo Pesca', description: 'Tè nero aromatizzato alla pesca', price: 2.50, order_index: 5 },
            { category_id: 'bevande-fredde', name: 'Smoothie Frutti Rossi', description: 'Fragole, mirtilli e banana frullati', price: 4.50, order_index: 6 },

            // Dolci e Pasticceria
            { category_id: 'dolci', name: 'Cornetto', description: 'Cornetto artigianale vuoto o con crema', price: 1.80, order_index: 1 },
            { category_id: 'dolci', name: 'Maritozzo', description: 'Dolce romano con panna montata fresca', price: 3.20, order_index: 2 },
            { category_id: 'dolci', name: 'Tiramisù', description: 'Il nostro tiramisù della casa', price: 4.50, order_index: 3 },
            { category_id: 'dolci', name: 'Cannolo Siciliano', description: 'Cannolo con ricotta fresca e gocce di cioccolato', price: 3.80, order_index: 4 },
            { category_id: 'dolci', name: 'Cheesecake ai Frutti di Bosco', description: 'Cheesecake cremosa con coulis di frutti di bosco', price: 5.20, order_index: 5 },
            { category_id: 'dolci', name: 'Biscotti della Casa', description: 'Assortimento di biscotti artigianali (3 pezzi)', price: 2.50, order_index: 6 },

            // Snack Salati
            { category_id: 'salati', name: 'Toast Prosciutto e Formaggio', description: 'Toast con prosciutto cotto e fontina', price: 4.50, order_index: 1 },
            { category_id: 'salati', name: 'Panino Caprese', description: 'Mozzarella, pomodoro, basilico e olio EVO', price: 5.20, order_index: 2 },
            { category_id: 'salati', name: 'Focaccia Rosmarino', description: 'Focaccia calda con rosmarino e sale grosso', price: 2.80, order_index: 3 },
            { category_id: 'salati', name: 'Piadina Crudo e Stracciatella', description: 'Piadina con prosciutto crudo e stracciatella', price: 6.50, order_index: 4 },
            { category_id: 'salati', name: 'Tramezzino Tonno e Carciofini', description: 'Tramezzino fresco con tonno e carciofini', price: 3.80, order_index: 5 },

            // Gelati
            { category_id: 'gelati', name: 'Gelato Artigianale (2 gusti)', description: 'Scegli due gusti tra i nostri disponibili', price: 3.50, order_index: 1 },
            { category_id: 'gelati', name: 'Coppa Gelato (3 gusti)', description: 'Tre gusti a scelta con panna e ciliegia', price: 4.80, order_index: 2 },
            { category_id: 'gelati', name: 'Affogato al Caffè', description: 'Gelato alla vaniglia "affogato" nell\'espresso caldo', price: 4.20, order_index: 3 },
            { category_id: 'gelati', name: 'Granita Siciliana', description: 'Granita tradizionale (limone, caffè o mandorla)', price: 3.20, order_index: 4 },

            // Cocktail
            { category_id: 'cocktail', name: 'Spritz Aperol', description: 'Aperol, Prosecco, soda e arancia', price: 6.50, order_index: 1 },
            { category_id: 'cocktail', name: 'Negroni', description: 'Gin, Campari e Vermouth rosso', price: 8.00, order_index: 2 },
            { category_id: 'cocktail', name: 'Mojito', description: 'Rum bianco, lime, menta e soda', price: 7.50, order_index: 3 },
            { category_id: 'cocktail', name: 'Americano', description: 'Campari, Vermouth rosso e soda', price: 6.00, order_index: 4 },
            { category_id: 'cocktail', name: 'Bellini', description: 'Prosecco e purea di pesca bianca', price: 7.00, order_index: 5 }
        ];

        for (const product of products) {
            await client.query(`
                INSERT INTO products (category_id, name, description, price, order_index)
                VALUES ($1, $2, $3, $4, $5)
            `, [product.category_id, product.name, product.description, product.price, product.order_index]);
        }
        console.log(`✅ ${products.length} prodotti inseriti`);

        // Verifica i dati inseriti
        const categoryCount = await client.query('SELECT COUNT(*) as count FROM categories');
        const productCount = await client.query('SELECT COUNT(*) as count FROM products');
        
        console.log('\n📊 Riepilogo:');
        console.log(`📋 Categorie: ${categoryCount.rows[0].count}`);
        console.log(`🍽️ Prodotti: ${productCount.rows[0].count}`);
        console.log('✅ Database configurato con successo!');
        
    } catch (error) {
        console.error('❌ Errore durante la configurazione del database:', error);
        process.exit(1);
    } finally {
        if (client) {
            client.release();
        }
        await pool.end();
    }
}

setupDatabase();