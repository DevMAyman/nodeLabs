const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const addUser = async (req, res, next) => {
  const reqBody = req.body;
  try {
    //! recommended to use this way not req.body to make sure that user will add the required data
    const user = await Users.create({
      userName: reqBody.userName,
      firstName: reqBody.firstName,
      lastName: reqBody.lastName,
      dob: reqBody.dob,
      password: reqBody.password,
    });
    //! just you sign up you logged in
    //! It is recommended to use this command to generate random secret👇
    //* node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    // eslint-disable-next-line no-underscore-dangle
    const token = jwt.sign({ id: user._id, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      token,
      data: {
        user,
      },

    });
  } catch (error) {
    next(error);
  }
};

const getUsersFirstName = async (req, res, next) => {
  try {
    const users = await Users.find({});
    const firstNames = users.map((user) => user.firstName);
    res.json({ firstNames });
  } catch (error) {
    next(error);
  }
};

const deleteWithId = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await Users.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    next(error);
  }
  return true;
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const {
      userName, firstName, lastName, dob, password,
    } = req.body;
    // Find the user by ID and update their information
    const updatedUser = await Users.findByIdAndUpdate(userId, {
      userName,
      firstName,
      lastName,
      dob,
      password,
    }, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
  return true;
};

const loginUser = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(404).json({ message: 'not valid object' });
  }
  //! password in schema has select : false by defult so explicitly put it in output
  const userNoPassword = await Users.findOne({ userName });
  const user = await Users.findOne({ userName }).select('+password');

  const isPassword = await user.correctpassword(password, user.password);
  if (!user || !isPassword) {
    return res.status(401).json({
      message: 'Incorrect email or password',
    });
  }
  // eslint-disable-next-line no-underscore-dangle
  const token = jwt.sign({ id: user._id, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(201).json({
    token,
    data: {
      user: userNoPassword,
    },

  });
};
const protectSystem = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }
  if (!token) {
    return res.status(401).json({ message: 'You are not logged in!' });
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await Users.findById(decodedData.id);
  req.currentUserId = currentUser._id;
  next();
};
module.exports = {
  addUser, getUsersFirstName, deleteWithId, updateUser, loginUser, protectSystem,
};
