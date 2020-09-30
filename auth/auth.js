const passport = require('passport');
const {
    Strategy: JWTstrategy,
    ExtractJwt: ExtractJWT,
} = require('passport-jwt');
const FacebookStrategy = require('passport-facebook');
const { GraphQLLocalStrategy } = require('graphql-passport');
const { DateTime } = require('luxon');
const User = require('../models/User/User');

passport.use(
    new GraphQLLocalStrategy(async (email, password, done) => {
        const users = await User.schema.statics.getUsers();
        const matchingUser = await User.schema.methods.matchingUser(
            email,
            password,
        );
        const error = matchingUser
            ? null
            : new Error('Username/password is incorrect');
        done(error, matchingUser);
    }),
);

const facebookOptions = {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/auth/facebook/callback',
    profileFields: ['id', 'email', 'first_name', 'last_name'],
};

const facebookCallback = async (accessToken, refreshToken, profile, done) => {
    const users = await User.schema.statics.getUsers();
    const matchingUser = await users.find(
        (user) => user.facebook_id === profile.id,
    );

    if (matchingUser) {
        done(null, matchingUser);
        return;
    }

    const newUserConfig = {
        _id: uuid(),
        username: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.emails && profile.emails[0] && profile.emails[0].value,
        password: null,
        facebook_id: profile.id,
    };

    const newUser = await User.create({
        ...newUserConfig,
        premium: false,
        collection_ids: [],
        date_created: DateTime.utc().toISODate(),
    });

    done(null, newUser);
};

passport.use(new FacebookStrategy(facebookOptions, facebookCallback));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const users = await User.schema.statics.getUsers();
    const matchingUser = await users.find((user) => {
        return user._id === id;
    });
    done(null, matchingUser);
});
