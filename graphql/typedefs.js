const {
    gql
} = require('apollo-server-express');

const typeDefs = gql `
    type Query {
        hello(recipient: String!): String!
    }
`;

module.exports = typeDefs;
