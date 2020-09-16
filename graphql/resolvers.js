const mongoose = require('mongoose');
const Types = mongoose.Types;
const fetch = require('node-fetch');
const User = require('../models/User/User');
const Collection = require('../models/Collection/Collection');

const resolvers = {
    Query: {
        /** @summary Authenticate a User
         * @param email
         * @param password TODO: encrypt
         * @returns The requested User if they exist or null if the User doesn't exist
         */
        authenticate: async (_, { email, password }) => {
            return null;
        },

        /** @summary Get a specific User
         * @param username
         * @returns The requested User if they exist or null if the User doesn't exist
         */
        getUser: async (_, { username }) => {
            const user = await User.findOne({
                username: username,
            }).exec();
            return user || new Error('User does not exist');
        },

        /** @summary Get a specific collection
         * @param collectionId
         * @returns The requested Collection if it exists or null if it doesn't exist
         */
        getCollection: async (_, { collectionId }) => {
            const collection = await Collection.findById({
                _id: collectionId,
            }).exec();
            return collection;
        },

        /** @summary Get collections belonging to a certain user.
         * @param userId
         * @returns A list of all a user's collections
         */
        getCollections: async (_, { userId }) => {
            return null;
        },

        /** @summary Search for a plugin
         * @param query
         * @returns A list of Plugins matching the query
         */
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

        /** @summary Search for a theme
         * @param query
         * @returns A list of Themes matching the query
         */
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

        /** @summary Get information about a specific plugin.
         * @param slug The plugin's slug
         */
        getPluginInfo: async (_, { slug: String }) => {
            const res = await fetch(`${process.env.WP_PLUGIN_INFO_URL}${slug}`);
            const data = await res.json();
            const regex = /(<([^>]+)>)/gi; // used to remove the anchor tags around author

            return {};
        },

        /** @summary Get information about a specific theme.
         * @param slug The theme's slug
         */
        getThemeInfo: async (_, { slug }) => {
            const res = await fetch(`${process.env.WP_THEME_INFO_URL}${slug}`);
            const data = await res.json();
            const regex = /(<([^>]+)>)/gi; // used to remove the anchor tags around author

            return {};
        },
    },

    Mutation: {
        /** @summary Create a new User
         * @param user username, email, password, premium, collectionIds, date_created
         * @returns The newly created User if successful or null if unsuccessful
         */
        createUser: async (_, { user }) => {
            return null;
        },

        /** @summary Create a new Collection
         * @param collection name, owner_id, date_created, type, plugins, themes
         * @returns The newly created Collection if successful or null if unsuccessful
         */
        createCollection: async (_, { collection }) => {
            return null;
        },

        /** @summary Update a User
         * @param userId
         * @param user username, email, password, premium, collectionIds, date_created
         * @returns The updated User if successful or null if unsuccessful
         */
        updateUser: async (_, { userId, user }) => {
            return null;
        },

        /** @summary Update a Collection
         * @param collectionId
         * @param collection name, owner_id, date_created, type, plugins, themes
         * @returns The updated Collection if successful or null if unsuccessful
         */
        updateCollection: async (_, { collectionId, collection }) => {
            return null;
        },

        /** @summary Delete a User
         * @param userId The ID of the user to delete
         * @returns True if successful or false if unsuccessful
         */
        deleteUser: async (_, { userId }) => {
            return null;
        },

        /** @summary Delete a Collection
         * @param collectionId The ID of the collection to delete
         * @returns True if successful or false if unsuccessful
         */
        deleteCollection: async (_, { collectionId }) => {
            return null;
        },
    },
};

module.exports = resolvers;
