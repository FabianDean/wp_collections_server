const resolvers = {
    Query: {
        hello: (_, args) => `Hello ${args.recipient}!`
    },
};

module.export = resolvers;
