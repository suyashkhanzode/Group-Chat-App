const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();

const secretKey = process.env.TOKEN_SECRET_KEY;

exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        User.findOne({
            where: {
                id: decoded.user.id
            }
        })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            req.user = user; 
            next();
        })
        .catch(err => {
            res.status(500).json({
                message: 'An error occurred while searching for the user.',
                error: err
            });
        });
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject(new Error('No token provided'));
        }

        try {
            const decoded = jwt.verify(token, secretKey);
            User.findOne({
                where: {
                    id: decoded.user.id
                }
            })
            .then(user => {
                if (!user) {
                    return reject(new Error('User not found'));
                }
                resolve(user); 
            })
            .catch(err => {
                reject(new Error('An error occurred while searching for the user'));
            });
        } catch (err) {
            reject(new Error('Invalid token'));
        }
    });
};