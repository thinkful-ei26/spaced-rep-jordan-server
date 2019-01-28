const { Strategy: LocalStrategy } = require('passport-local');
const User = require('./userschema');

const LocalStrategy = new LocalStrategy((username, password, done)
    => {
        let user; 
        User.findOne({ username })
            .then(results => {
                user = results;
                if (!results){
                    return Promise.reject({
                        reason: 'LoginError',
                        message: 'Incorrect username',
                        location: 'username'
                    })
            }
        const isValid = user.validatePassword(password);
            if (!isValid){
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect password',
                    location: 'password'
                });
            }
            return done(null,user);
        })
        .catch(err => {
            if (err.reason === 'LoginError'){
                return done(null, false);
            }
            return done(err);
        });
    });
