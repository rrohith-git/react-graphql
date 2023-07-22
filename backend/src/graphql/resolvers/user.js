const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const ENVIRONMENT = 'DEV';

module.exports = {
    createUser: ({ userInput }) => {
        return User.findOne({ email: userInput.email }).then(user => {
            if (user) {
                throw new Error('User exists already.');
            }
            return bcrypt.hash(userInput.password, 12);
        }).then(hashedPassword => {
            const user = new User({ ...userInput, password: hashedPassword });
            return user.save();
        }).then(result => {
            return { ...result._doc, _id: result.id };
        }).catch(err => {
            throw err;
        })
    },
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({ email })
            if (!user) {
                throw new Error('User does not exist');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Invalid credentials');
            }
            const token = jwt.sign({ userId: user.id, email: user.email }, process.env[`${ENVIRONMENT}_JWT_SECRET`], { algorithm: 'HS512', expiresIn: '1h' });
            return {
                userId: user.id,
                token,
                tokenExpiration: 1
            }
        } catch (err) {
            throw err;
        }
    }
}