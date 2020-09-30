const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { DateTime } = require('luxon');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const { GraphQLLocalStrategy, buildContext } = require('graphql-passport');
const { v4: uuid } = require('uuid');
const cors = require('cors');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const User = require('./models/User/User');

const init = async () => {
    const PORT = process.env.PORT || 4000;
    const app = express();

    /**
     * Configure CORS
     */
    const corsConfig = {
        methods: ['GET', 'POST', 'PUT', 'PATCH'],
        origin: process.env.CLIENT_URL,
        credentials: true,
    };

    app.use(cors(corsConfig));

    /**
     * Configure express-session with uuid
     */
    app.use(
        session({
            genid: (req) => uuid(),
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
        }),
    );

    /**
     * Configure Mongoose and connect to db
     */

    await mongoose
        .connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        .then(() => {
            console.log('✅ Successfully connected to database.');
        })
        .catch((err) => {
            console.error('❌ Error connecting to database.\n', err);
        });

    /**
     * Configure Passport
     */
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new GraphQLLocalStrategy(async (email, password, done) => {
            const users = await User.schema.statics.getUsers();
            const matchingUser = await User.schema.methods.matchingUser(
                email,
                password,
            );
            const error = matchingUser
                ? null
                : new Error('Username/password is incorrect');
            done(error, matchingUser);
        }),
    );

    const facebookOptions = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: 'http://localhost:4000/auth/facebook/callback',
        profileFields: ['id', 'email', 'first_name', 'last_name'],
    };

    const facebookCallback = async (
        accessToken,
        refreshToken,
        profile,
        done,
    ) => {
        const users = await User.schema.statics.getUsers();
        const matchingUser = await users.find(
            (user) => user.facebook_id === profile.id,
        );

        if (matchingUser) {
            done(null, matchingUser);
            return;
        }

        const newUserConfig = {
            _id: uuid(),
            username: `${profile.name.givenName} ${profile.name.familyName}`,
            email:
                profile.emails && profile.emails[0] && profile.emails[0].value,
            password: null,
            facebook_id: profile.id,
        };

        const newUser = await User.create({
            ...newUserConfig,
            premium: false,
            collection_ids: [],
            date_created: DateTime.utc().toISODate(),
        });

        done(null, newUser);
    };

    passport.use(new FacebookStrategy(facebookOptions, facebookCallback));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const users = await User.schema.statics.getUsers();
        const matchingUser = await users.find((user) => {
            return user._id === id;
        });
        done(null, matchingUser);
    });

    app.get(
        '/auth/facebook',
        passport.authenticate('facebook', { scope: ['email'] }),
    );
    app.get(
        '/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: 'http://localhost:4000/graphql',
            failureRedirect: 'http://localhost:4000/graphql',
        }),
    );

    /**
     * Configure Apollo Server
     */
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => {
            return buildContext({
                req,
                res,
                User,
                getUser: () => req.user,
                logout: () => req.logout(),
            });
        },
        playground: {
            settings: {
                'request.credentials': 'include',
            },
        },
    });

    server.applyMiddleware({ app });

    /**
     * Start server
     */
    app.listen({ port: PORT }, () =>
        console.log(
            `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
        ),
    );
};

init();
