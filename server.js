const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();
const cors = require('cors');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');

const init = async () => {
    const PORT = process.env.PORT || 4000;
    const app = express();

    /**
     * Configure CORS
     */
    const corsConfig = {
        methods: ['GET', 'POST', 'PUT', 'PATCH'],
        origin: process.env.CLIENT_URL,
    };

    app.use(cors(corsConfig));

    /**
     * Configure Apollo Server
     */
    const server = new ApolloServer({
        typeDefs,
        resolvers,
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
