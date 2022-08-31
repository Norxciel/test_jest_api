/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRound = 10;

const User = require('../models/users');

const generateToken = (payload, secret, lifeTime) =>
    jwt.sign(payload, secret, { expiresIn: lifeTime });

/**
 *
 * @param {Request} req
 * @param {Respanse} res
 */
exports.getAllUsers = async (req, res) => {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
};
/**
 *
 * @param {Request} req
 * @param {Respanse} res
 */
exports.getOneUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, {
            password: 0,
            __v: 0,
            _id: 0,
        });
        if (!user) {
            res.status(404).json({
                message: 'user not found',
            });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json('user request fail');
    }
};

/**
 *
 * @param {Request} req
 * @param {Respanse} res
 */

exports.createUser = async (req, res) => {
    // on récupère les données envoyées
    const postData = req.body;
    // on chiffre le mot de passe de l'utilisateur
    try {
        const passwordhash = await bcrypt.hash(postData.password, saltRound);
        const user = new User({
            ...postData,
            password: passwordhash,
        });
        await user.save();
        // On converti l'objet mongo en objet JS
        const userObject = JSON.parse(JSON.stringify(user));
        // On supprime le mot de passe de l'objet à renvoyer au client
        delete userObject.password;
        res.status(201).json(userObject);
    } catch (error) {
        res.status(500).json({ message: 'register failed!' });
    }
};

/**
 *
 * @param {Request} req
 * @param {Respanse} res
 */

exports.updateUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, {
            ...req.body,
        });
        const updatedUser = await User.findById(req.params.id);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'register failed!' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'register failed!' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            email,
        });
        if (!user) {
            const error = new Error('email ou mot de passe incorrect');
            error.code = 422;
            throw error;
        }

        const checkPassword = bcrypt.compareSync(password, user.password);
        if (!checkPassword) {
            const error = new Error('email ou mot de passe incorrect');
            error.code = 422;
            throw error;
        }
        const payload = {
            id: user._id,
            name: `${user.firstname} ${user.lastname}`,
        };
        // token
        const token = generateToken(payload, process.env.JWT_SECRET, '15m');
        /* eslint-desable no-underscore-dangle */
        const refreshToken = generateToken(
            payload,
            process.env.JWT_REFRESH_SECRET,
            '7h'
        );
        /* eslint-desable no-underscore-dangle */
        res.status(200).json({
            token,
            refreshToken,
        });
    } catch (error) {
        const statusCode = error.code ?? 500;
        res.status(statusCode).json({
            message:
                "Le service est indisponible pour le moment, merci de résssayer plus tard ou de contacter l'administrateur du site si l'erreur persiste",
        });
    }
};
/**
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.refreshUserToken = async (req, res) => {
    const authHeaders = req.headers?.authorization;

    const autToken = authHeaders.split(' ')[1];

    if (!autToken) {
        res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const user = await jwt.verify(autToken, process.env.JWT_REFRESH_SECRET);
        delete user.iat;
        delete user.exp;
        const token = generateToken(user, process.env.JWT_SECRET, '15m');
        const refreshToken = generateToken(
            user,
            process.env.JWT_REFRESH_SECRET,
            '7h'
        );
        res.status(200).json({
            token,
            refreshToken,
        });
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
