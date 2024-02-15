const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const AutoIncrement = require('mongoose-sequence')(mongoose);

const todosSchema = new mongoose.Schema({
  userId: {
    type: Number,
    ref: 'Users',
  },
  title: {
    type: String,
    required: true,
    min: [5],
    max: 20,
  },
  status: {
    type: String,
    required: false,
    default: 'to-do',
  },
  tags: {
    type: [String],
    required: false,
    validate: {
      validator(value) {
        return value.length <= 10;
      },
      message: (props) => `${props.value} is not a valid string!`,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Todos = mongoose.model('Todos', todosSchema);

module.exports = Todos;
