const fetch = require('node-fetch');

const resolvers = {
    Query: {
        hello: (_, {
            recipient
        }) => `Hello ${recipient}!`,

        searchPlugin: async (_, {
            query
        }) => {
            const res = await fetch(`${process.env.WP_SEARCH_PLUGIN_URL_BEGIN}${query}${process.env.WP_SEARCH_PLUGIN_URL_END}`);
            const data = await res.json();

            return data.plugins.map((item) => {
                return {
                    name: item.name,
                    homepage: item.homepage || "",
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

        searchTheme: async (_, {
            query
        }) => {
            const res = await fetch(`${process.env.WP_SEARCH_THEME_URL}${query}`);
            const data = await res.json();

            return data.themes.map((item) => {
                return {
                    name: item.name,
                    homepage: item.homepage,
                    description: item.description,
                    rating: item.rating,
                    screenshot_url: item.screenshot_url,
                    preview_url: item.preview_url,
                };
            });
        }
    },
};

module.exports = resolvers;
