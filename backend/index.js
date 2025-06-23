const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Чтение данных из result.json
function getData() {
  const filePath = path.join(__dirname, 'result.json');
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Эндпоинт для получения всех категорий с подкатегориями и планами
app.get('/api/categories', (req, res) => {
  res.json(getData());
});

app.listen(PORT, () => {
  console.log(`Backend started on http://localhost:${PORT}`);
}); 