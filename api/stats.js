
// ==========================================
// STATS API - api/stats.js
// ==========================================

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // In un ambiente reale, qui recupereresti le statistiche dal database
        // Per ora restituisce statistiche simulate
        
        return res.status(200).json({
            categories: 6, // Numero di categorie
            products: 27, // Numero di prodotti
            status: 'running',
            timestamp: new Date().toISOString(),
            uptime: process.uptime ? process.uptime() : 0
        });

    } catch (error) {
        console.error('Stats Error:', error);
        return res.status(500).json({ 
            error: 'Failed to get stats',
            details: error.message 
        });
    }
}