const fetch = require('node-fetch');
const htmlToText = require('html-to-text');

const resolvers = {
    Query: {
        /** @summary Search for a plugin
         * @param {string} query
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
                    description: htmlToText.fromString(item.description),
                    //.replace(/\n/g, ' '),
                    short_description: item.short_description,
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
         * @param {string} query
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
         * @param {string} slug The plugin's slug
         */
        getPluginInfo: async (_, { slug }) => {
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
};

module.exports = resolvers;
