const { gql } = require('apollo-server-express');

const typeDefs = gql`
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
    type Screenshot {
        src: String
        caption: String
    }
    input ScreenshotInput {
        src: String
        caption: String
    }
    type Banner {
        low: String
        high: String
    }
    input BannerInput {
        low: String
        high: String
    }
    type Plugin {
        name: String
        author: String
        slug: String
        homepage: String
        description: String
        short_description: String
        downloads: Int
        rating: Int
        ratings: Ratings
        screenshots: [Screenshot]
        banners: [Banner]
    }
    input PluginInput {
        name: String
        author: String
        slug: String
        homepage: String
        description: String
        short_description: String
        downloads: Int
        rating: Int
        ratings: RatingsInput
        screenshots: [ScreenshotInput]
        banners: [BannerInput]
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
    type Query {
        searchPlugin(query: String!): [Plugin]
        searchTheme(query: String!): [Theme]
        getPluginInfo(slug: String!): Plugin
        getThemeInfo(slug: String!): Theme
    }
`;

module.exports = typeDefs;
