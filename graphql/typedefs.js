const {
    gql
} = require('apollo-server-express');

const typeDefs = gql`
    type Ratings {
        one: Int
        two: Int
        three: Int
        four: Int
        five: Int
    }
    type Plugin {
        name: String
        homepage: String
        downloads: Int
        rating: Int
        ratings: Ratings
    }
    type Query {
        hello(recipient: String!): String!
        searchPlugin(query: String!): [Plugin]
    }
`;

module.exports = typeDefs;
