const mongoose = require('mongoose');
const Types = mongoose.Types;
const fetch = require('node-fetch');
const User = require('../models/User/User');
const Collection = require('../models/Collection/Collection');

const resolvers = {
    Query: {
        authenticate: async (_, { email, password }) => {
            return null;
        },

        getUser: async (_, { username }) => {
            const user = await User.findOne({
                username: username,
            }).exec();
            return user || new Error('User does not exist');
        },

        getCollection: async (_, { collectionId }) => {
            const collection = await Collection.findById({
                _id: collectionId,
            }).exec();
            return collection;
        },

        getCollections: async (_, { userId }) => {
            return null;
        },

        searchPlugin: async (_, { query }) => {
            const res = await fetch(
                `${process.env.WP_SEARCH_PLUGIN_URL_BEGIN}${query}${process.env.WP_SEARCH_PLUGIN_URL_END}`,
            );
            const data = await res.json();
            const regex = /(<([^>]+)>)/gi; // used to remove the anchor tags around author

            return data.plugins.map((item) => {
                return {
                    name: item.name,
                    author: item.author.replace(regex, ''),
                    slug: item.slug,
                    homepage: item.homepage || '',
                    downloads: item.downloaded,
                    rating: item.rating,
                    ratings: {
                        one: item.ratings[1],
                        two: item.ratings[2],
                        three: item.ratings[3],
                        four: item.ratings[4],
                        five: item.ratings[5],
                    },
                };
            });
        },

        searchTheme: async (_, { query }) => {
            const res = await fetch(
                `${process.env.WP_SEARCH_THEME_URL}${query}`,
            );
            const data = await res.json();

            return data.themes.map((item) => {
                return {
                    name: item.name,
                    author: item.author,
                    slug: item.slug,
                    homepage: item.homepage,
                    description: item.description,
                    rating: item.rating,
                    screenshot_url: item.screenshot_url,
                    preview_url: item.preview_url,
                };
            });
        },

        getPluginInfo: async (_, { slug }) => {
            const res = await fetch(`${process.env.WP_PLUGIN_INFO_URL}${slug}`);
            const data = await res.json();
            const regex = /(<([^>]+)>)/gi; // used to remove the anchor tags around author

            return {};
        },

        getThemeInfo: async (_, { slug }) => {
            const res = await fetch(`${process.env.WP_THEME_INFO_URL}${slug}`);
            const data = await res.json();
            const regex = /(<([^>]+)>)/gi; // used to remove the anchor tags around author

            return {};
        },
    },

    Mutation: {
        createUser: async (_, { user }) => {
            return null;
        },
        createCollection: async (_, { collection }) => {
            return null;
        },
        updateUser: async (_, { userId, user }) => {
            return null;
        },
        updateCollection: async (_, { collectionId, collection }) => {
            return null;
        },
        deleteUser: async (_, { userId }) => {
            return null;
        },
        deleteCollection: async (_, { projectId }) => {
            return null;
        },
    },
};

module.exports = resolvers;
