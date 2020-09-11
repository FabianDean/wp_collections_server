const fetch = require('node-fetch');

const resolvers = {
    Query: {
        hello: (_, { recipient }) => `Hello ${recipient}!`,

        searchPlugin: async (_, { query }) => {
            const res = await fetch(`${process.env.WP_SEARCH_URL_BEGIN}${query}${process.env.WP_SEARCH_URL_END}`);
            const data = await res.json();
            return [{
                name: data.plugins[0].name,
                homepage: data.plugins[0].homepage || "",
                downloads: data.plugins[0].downloaded,
                rating: data.plugins[0].rating,
                ratings: {
                    one: data.plugins[0].ratings[1],
                    two: data.plugins[0].ratings[2],
                    three: data.plugins[0].ratings[3],
                    four: data.plugins[0].ratings[4],
                    five: data.plugins[0].ratings[5],
                },
            }];
        },
    },
};

module.exports = resolvers;
