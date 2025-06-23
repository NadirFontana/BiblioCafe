// ==========================================
// CLEAR DATABASE - VERCEL EDGE FUNCTION
// ==========================================

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // In un ambiente reale, qui puliresti il database
        // Per ora simula la pulizia
        console.log('🧹 Clearing database...');
        
        return res.status(200).json({
            message: 'Database cleared successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Clear Error:', error);
        return res.status(500).json({ 
            error: 'Failed to clear database',
            details: error.message 
        });
    }
}