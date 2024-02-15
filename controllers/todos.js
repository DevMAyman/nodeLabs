const Todos = require('../models/todos');

const getTodos = async (req, res, next) => {
  try {
    let { limit = 10, skip = 0, status } = req.query;
    limit = parseInt(limit, 10);
    skip = parseInt(skip, 10);

    const query = {};

    if (status) {
      query.status = status;
    }
    query.userId = req.currentUserId;

    const todos = await Todos.find(query)
      .limit(limit)
      .skip(skip)
      .exec();

    res.json({ todos });
  } catch (error) {
    next(error);
  }
};

const addTodo = async (req, res, next) => {
  try {
    req.body.userId = req.currentUserId;
    const newTodo = await Todos.create(req.body);
    res.json(newTodo);
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const todos = await Todos.findById(todoId);
    if (todos.userId !== req.currentUserId) {
      return res.status(404).json({ message: 'permission denied' });
    }

    const {
      title, status, tags,
    } = req.body;

    const updateObj = {};
    if (req.currentUserId !== undefined) updateObj.userId = req.currentUserId;
    if (title !== undefined) updateObj.title = title;
    if (status !== undefined) updateObj.status = status;
    if (tags !== undefined) updateObj.tags = tags;
    updateObj.updatedAt = Date.now();

    const updatedTodo = await Todos.findByIdAndUpdate(
      todoId,
      updateObj,
      { new: true, runValidators: true },
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ todo: updatedTodo });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;

    // Find the todo by ID and delete it
    const deletedTodo = await Todos.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully', deletedTodo });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos, addTodo, updateTodo, deleteTodo,
};
