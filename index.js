import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();
const coverFolder = path.join(__dirname, 'cover');

// Crea la cartella cover se non esiste
if (!fs.existsSync(coverFolder)) {
  fs.mkdirSync(coverFolder);
}

// Serve le immagini statiche
app.use('/cover', express.static('cover'));

app.get('/save-cover', async (req, res) => {
  const { url, filename } = req.query;

  if (!url || !filename) {
    return res.status(400).send('Parametri mancanti');
  }

  const filepath = path.join(coverFolder, filename);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Errore nel download');

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    res.send(`✅ Copertina salvata come ${filename}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Errore nel salvataggio');
  }
});

app.listen(PORT, () => {
  console.log(`Server attivo sulla porta ${PORT}`);
});