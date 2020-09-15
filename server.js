const express = require("express");
const { ApolloServer } = require("apollo-server-express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers");

const init = async () => {
    const PORT = process.env.PORT || 4000;

    const app = express();
    app.use(cors());

    await mongoose
        .connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        .then(() => {
            console.log("✅ Successfully connected to database.");
        })
        .catch((err) => {
            console.error("❌ Error connecting to database.\n", err);
        });

    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    server.applyMiddleware({
        app
    });

    app.listen({ port: PORT }, () =>
        console.log(
            `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
        )
    );
};

init();
