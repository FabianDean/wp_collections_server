const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const passport = require('passport');
const { buildContext } = require('graphql-passport');
require('dotenv').config();
const { v4: uuid } = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const User = require('./models/User/User');

const init = async () => {
    const PORT = process.env.PORT || 4000;
    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));

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
    require('./auth/auth.js');

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
