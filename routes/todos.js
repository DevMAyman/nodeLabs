const router = require('express').Router();
const {
  getTodos, addTodo, updateTodo, deleteTodo,
} = require('../controllers/todos');

const {
  protectSystem,
} = require('../controllers/users');

router.get('/', protectSystem, getTodos);

router.post('/', protectSystem, addTodo);

router.patch('/:id', protectSystem, updateTodo);

router.delete('/:id', protectSystem, deleteTodo);

module.exports = router;
