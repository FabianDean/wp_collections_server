const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();


const init = async () => {
    const PORT = process.env.PORT || 4000;
    const app = express();

    /**
     * Configure CORS
     */
    app.use(cors());

    /**
     * Basic landing page
     */
    app.get('/', (req, res) => {
        res.status(200).send('WP Collections (server) - GitHub: https://github.com/FabianDean/wp_collections_server');
    });

    /**
     * Configure Apollo Server
     */
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        playground: true,
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
