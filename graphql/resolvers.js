const resolvers = {
    Query: {
        hello: (_, args) => `Hello ${args.recipient}!`
    },
};

module.exports = resolvers;
