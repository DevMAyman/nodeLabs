const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    min: 8,
  },
  firstName: {
    type: String,
    required: true,
    min: 3,
    max: 15,
  },
  lastName: {
    type: String,
    required: true,
    min: 3,
    max: 15,
  },
  dob: {
    type: Date,
    required: false,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  _id: {
    type: Number,
  },
});
//! must make collection name when use mongoose sequence in two different schemas
//! as mongoose-sequence has just one counter  by default and when
//! use it in two different schema with same field
//! it will throw an error, so you must define two custom counter like this
usersSchema.plugin(AutoIncrement, {
  id: 'users', inc_field: '_id', start_seq: 0, collection_name: 'users_counters',
});

usersSchema.pre('save', async function (next) {
  // console.log('mo');
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
  return true;
});

usersSchema.methods.correctpassword = async function (uncheckedPassword, truepassword) {
  return bcrypt.compare(uncheckedPassword, truepassword);
};
const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
