const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

const foodSchema = new mongoose.Schema({
  name: String,
  category: String,
  quantity: Number,
  expirationDate: Date,
  price: Number
});

const Food = mongoose.model('Food', foodSchema);

app.get('/api/foods', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food == null) {
      return res.status(404).json({ message: 'Alimento não encontrado' });
    }
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/foods', async (req, res) => {
  const food = new Food({
    name: req.body.name,
    category: req.body.category,
    quantity: req.body.quantity,
    expirationDate: req.body.expirationDate,
    price: req.body.price
  });

  try {
    const newFood = await food.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food == null) {
      return res.status(404).json({ message: 'Alimento não encontrado' });
    }
    Object.assign(food, req.body);
    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food == null) {
      return res.status(404).json({ message: 'Alimento não encontrado' });
    }
    await food.deleteOne();
    res.json({ message: 'Alimento excluído' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
