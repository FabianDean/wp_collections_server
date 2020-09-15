const { gql } = require("apollo-server-express");

const typeDefs = gql`
    enum CollectionType {
        PLUGIN
        THEME
        MIXED
    }
    type Ratings {
        one: Int
        two: Int
        three: Int
        four: Int
        five: Int
    }
    input RatingsInput {
        one: Int
        two: Int
        three: Int
        four: Int
        five: Int
    }
    type Plugin {
        name: String
        author: String
        slug: String
        homepage: String
        downloads: Int
        rating: Int
        ratings: Ratings
    }
    input PluginInput {
        name: String
        author: String
        slug: String
        homepage: String
        downloads: Int
        rating: Int
        ratings: RatingsInput
    }
    type Theme {
        name: String
        author: String
        slug: String
        homepage: String
        description: String
        downloads: Int
        rating: Int
        screenshot_url: String
        preview_url: String
    }
    input ThemeInput {
        name: String
        author: String
        slug: String
        homepage: String
        description: String
        downloads: Int
        rating: Int
        screenshot_url: String
        preview_url: String
    }
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        premium: Boolean!
        collection_ids: [ID]
        date_created: String
    }
    input UserInput {
        username: String!
        email: String!
        password: String!
        premium: Boolean!
        collection_ids: [ID]
        date_created: String
    }
    type Collection {
        _id: ID!
        name: String!
        owner_id: ID!
        date_created: String
        type: CollectionType
        plugins: [Plugin]
        themes: [Theme]
    }
    input CollectionInput {
        name: String!
        owner_id: ID!
        date_created: String
        type: CollectionType
        plugins: [PluginInput]
        themes: [ThemeInput]
    }
    type Query {
        authenticate(email: String!, password: String!): User
        getUser(username: String!): User
        getCollection(collectionId: ID!): Collection
        getCollections(userId: ID!): [Collection]
        searchPlugin(query: String!): [Plugin]
        searchTheme(query: String!): [Theme]
        getPluginInfo(slug: String!): Plugin
        getThemeInfo(slug: String!): Theme
    }
    type Mutation {
        createUser(user: UserInput!): User!
        createCollection(collection: CollectionInput!): Collection!
        updateUser(userId: ID!, user: UserInput!): User!
        updateCollection(
            collectionId: ID!
            collection: CollectionInput!
        ): Collection!
        deleteUser(userId: ID!): Boolean!
        deleteCollection(projectId: ID!): Boolean!
    }
`;

module.exports = typeDefs;
