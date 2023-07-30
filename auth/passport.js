const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user');
const { secretKey } = require('../config/jwtConfig');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey,
};

passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
        try {
            const user = await User.findByPk(jwtPayload.id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

module.exports = passport;