// ==========================================
// CATEGORIES API - VERCEL SERVERLESS FUNCTION
// ==========================================

// Importa i dati di seed
import { SEED_CATEGORIES } from './seed.js';

// Storage simulato - in produzione useresti un database
let categories = [...SEED_CATEGORIES];

export default function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Assicurati che i dati siano inizializzati
    if (categories.length === 0) {
        categories = [...SEED_CATEGORIES];
    }

    switch (req.method) {
        case 'GET':
            return res.status(200).json({
                categories: categories,
                count: categories.length
            });

        case 'POST':
            const { id, name, emoji } = req.body;
            
            if (!id || !name || !emoji) {
                return res.status(400).json({ 
                    error: 'Missing required fields: id, name, emoji' 
                });
            }

            const existingCategory = categories.find(cat => cat.id === id);
            if (existingCategory) {
                existingCategory.name = name;
                existingCategory.emoji = emoji;
                return res.status(200).json({
                    message: 'Category updated successfully',
                    category: existingCategory
                });
            }

            const newCategory = { id, name, emoji };
            categories.push(newCategory);
            return res.status(201).json({
                message: 'Category added successfully',
                category: newCategory
            });

        case 'DELETE':
            const categoryId = req.query.id || req.url.split('/').pop();
            if (!categoryId) {
                return res.status(400).json({ error: 'Category ID is required' });
            }

            const categoryIndex = categories.findIndex(cat => cat.id === decodeURIComponent(categoryId));
            if (categoryIndex === -1) {
                return res.status(404).json({ error: 'Category not found' });
            }

            const deletedCategory = categories.splice(categoryIndex, 1)[0];
            return res.status(200).json({
                message: 'Category deleted successfully',
                category: deletedCategory
            });

        default:
            return res.status(405).json({ error: 'Method not allowed' });
    }
}