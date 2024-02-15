const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const Todos = require('./models/todos');
// ! 1) get environment variable from configration file
dotenv.config({ path: './config.env' });
const app = express(); // create server
const connectionString = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(connectionString);

app.use(express.json());
app.use('/', routes);

app.use((err, req, res, next) => {
  res.status(404).json({ error: err.message });
});

//! uniques route
app.get('/:userId/todos', async (req, res) => {
  try {
    const { userId } = req.params;
    const userTodos = await Todos.find({ userId });
    res.json({ todos: userTodos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Running ...');
});
