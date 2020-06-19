const { buildSchema } = require('graphql');

const { getUserToken, requireUserAuth, validatePassword } = require('./auth')
const { cloudinaryConfig, uploader } = require('./config/cloudinary')
const { asyncHandler, dataUri, handleValidationErrors, multerUploads } = require('./utils');
const db = require('./db/models');

const { User } = db;

const schema = buildSchema(`
    type User {
        id: ID!
        display_name: String!
        profile_img: String!
    }

    type Query {
        currentUser: User!
    }

    type Mutation {
        login(username: String, email: String, password: String!): LoginRes!
    }
    
    type LoginRes {
        user: User
        token: String
    }
`);

const resolvers = {
    login: async ({ username, email, password }) => {

        let user;

        if (username) {
            user = await User.findOne({
                where: { username }
            });
        } else {
            user = await User.findOne({
                where: { email }
            });
        }

        if (!user || !validatePassword(password, user.hashed_password)) {
            const err = new Error('Failed to log in.');
            err.errors = ['The provided credentials were invalid'];
            err.status = 401;
            err.title = 'Login failed.';
            return next(err);
        }

        const token = getUserToken(user);

        return ({ user, token })
    }
}

module.exports = {
    schema,
    resolvers
}