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

// Homepage visibile
app.get('/', (req, res) => {
  res.send('✅ Radiotron Cover Service attivo');
});

// Rende pubblica la cartella delle cover
app.use('/cover', express.static('cover'));

// Salva una copertina
app.get('/save-cover', async (req, res) => {
  const { url, filename } = req.query;

  if (!url || !filename) {
    return res.status(400).send('❌ Parametri mancanti: url e filename obbligatori');
  }

  const filepath = path.join(coverFolder, filename);

  try {
    console.log(`➡️ Download da: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`❌ Errore fetch: ${response.status} ${response.statusText}`);
      return res.status(500).send('❌ Errore nel download della copertina');
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.log(`✅ Copertina salvata in: ${filepath}`);

    res.send(`✅ Copertina salvata come ${filename}`);
  } catch (err) {
    console.error('❌ Errore durante il salvataggio:', err);
    res.status(500).send('❌ Errore interno durante il salvataggio');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server attivo sulla porta ${PORT}`);
});
