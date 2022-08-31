require('express-router-group');
const express = require('express');

// const auth = require('../middlewares/auth');

const router = express.Router();

const userController = require('../controllers/users');

/* GET users listing. */
router.post('/login', userController.loginUser);
router.post('/refresh-token', userController.refreshUserToken);
router.group('/', (route) => {
    route.get('/:id', userController.getOneUser);
    route.post('/', userController.createUser);
    route.patch('/:id', userController.updateUser);
    route.delete('/:id', userController.deleteUser);
    route.get('/', userController.getAllUsers);
});

module.exports = router;
