const User =  require('../models/User');
const jwt =  require('jsonwebtoken');
const passport =  require('passport');

const jwtSecret =  require('../config/jwtConfig');

module.exports = app => {
    app.post('/auth', (req, res, next) => {
        passport.authenticate('login', (err, user, info) => {
            if (err) {
                console.log(err);
            }
            if (info != undefined) {
                console.log(info.message);
                res.send(info.message);
            } else {
                req.logIn(user, err => {
                    User.findOne({
                        where: {
                            username: user.username,
                        },
                    }).then(user => {
                        const token = jwt.sign({ id: user.username }, jwtSecret.secret);
                        res.status(200).send({
                            auth: true,
                            token: token,
                            message: 'user found & logged in',
                        });
                    });
                });
            }
        })(req, res, next);
    });
};