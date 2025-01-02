const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/admin/api/updateMenu', async (req, res) => {
    try {
        await fs.writeFile('menuData.json', JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Errore:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => console.log('API server su porta 3001'));