const router = require('express').Router();
const {
  addUser, getUsersFirstName, deleteWithId, updateUser, loginUser,
} = require('../controllers/users');

router.post('/signup', addUser);

router.post('/login', loginUser);

router.get('/', getUsersFirstName);

router.delete('/:id', deleteWithId);

router.patch('/:id', updateUser);

module.exports = router;
