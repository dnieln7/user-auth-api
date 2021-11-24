require('dotenv').config({
    path: '../.env'
});

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {tb_users} = require("../models");
const {errorResponse, loginResponse, userResponse} = require("../helpers/utils");
const {applyHeaders} = require("../helpers/utils");

function login(req, res) {
    const authentication = req.body
    const type = req.swagger.params.type.value

    tb_users.findOne({where: {email: authentication.email}})
        .then(user => {
            if (!user) {
                return res.status(404).send(errorResponse(
                    "User not found",
                    "Provided email doesn't exists"
                ));
            }

            if (type === 'E') {
                bcrypt.compare(authentication.password, user.password, (error, matches) => {
                    if (!matches) {
                        return res.status(401).send(errorResponse("Invalid Password", error.toString()));
                    }

                    return res.status(200).send(loginResponse(createToken(user)));
                });
            } else {
                bcrypt.compare(authentication.password, user.google_id, (error, matches) => {
                    if (!matches) {
                        return res.status(401).send(errorResponse("Invalid Google ID", error.toString()));
                    }

                    return res.status(200).send(loginResponse(createToken(user)));
                });
            }
        }).catch(reason => res.status(500).send(errorResponse("Unknown error", reason.toString())))
}

function register(req, res) {
    applyHeaders(res);

    const user = req.body
    let password = user.password;

    bcrypt.genSalt(10, (error, salt) => {
        if (error) {
            return res.status(500).send(errorResponse("Unknown error", error.toString()));
        }

        return bcrypt.hash(password, salt, (error, hash) => {
            user.password = hash;

            tb_users.create(user)
                .then(result => res.status(201).send(userResponse(true, result)))
                .catch(reason => res.status(500).send(errorResponse("Unknown error", reason)));
        })
    });
}

function registerGoogle(req, res) {
    applyHeaders(res);

    const user = req.body;
    let googleId = user.google_id

    bcrypt.genSalt(10, (error, salt) => {
        if (error) {
            return res.status(500).send(errorResponse("Unknown error", error.toString()));
        }

        return bcrypt.hash(googleId, salt, (error, hash) => {
            user.google_id = hash;
            user.password = ""

            tb_users.create(user)
                .then(result => res.status(201).send(userResponse(true, result)))
                .catch(reason => res.status(500).send(errorResponse("Unknown error", reason)));
        })
    });
}

function verifyToken(req, authOrSecDef, header, callback) {
    let currentScopes = req.swagger.operation["x-security-scopes"];

    if (header && header.indexOf("Bearer ") === 0) {
        const token = header.split(" ")[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (error, tokenInfo) => {
            if (error == null && Array.isArray(currentScopes) && tokenInfo && tokenInfo.role) {

                const containsRole = currentScopes.indexOf(tokenInfo.role) !== -1;
                const correctIssuer = tokenInfo.issuer === process.env.ISSUER;

                if (containsRole && correctIssuer) {
                    req.auth = tokenInfo;

                    return callback(null);
                } else {
                    return callback(sendAuthError(req));
                }
            } else {
                return callback(sendAuthError(req));
            }
        });
    } else {
        return callback(sendAuthError(req));
    }
}

function createToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role,
            issuer: process.env.ISSUER
        },
        process.env.TOKEN_SECRET,
        {
            /*expiresIn: "1hr"*/
        },
    );
}

function sendAuthError(req) {
    return req.res.status(403).send(errorResponse("Access Denied", "You are not authorized to see this content"));
}

module.exports = {
    login,
    register,
    registerGoogle,
    verifyToken
};
