require('dotenv').config({
    path: '../.env'
});

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {tb_users} = require("../models");
const {getErrorResponse, getLoginResponse, getUserResponse} = require("../helpers/utils");
const {applyHeaders} = require("../helpers/utils");

function login(req, res) {
    const authentication = req.body
    const type = req.swagger.params.type.value

    tb_users.findOne({where: {email: authentication.email}})
        .then(user => {
            if (!user) {
                return res.status(404).send(getErrorResponse(
                    "User not found",
                    "Provided email doesn't exists"
                ));
            }

            if (type === 'E') {
                bcrypt.compare(authentication.password, user.password, (error, matches) => {
                    if (!matches) {
                        return res.status(401).send(getErrorResponse("Invalid Password", error.toString()));
                    }

                    const token = jwt.sign(
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

                    return res.status(200).send(getLoginResponse(token));
                });
            } else {
                // TODO process for google login
            }
        }).catch(reason => res.status(500).send(getErrorResponse("Unknown error", reason.toString())))
}

function register(req, res) {
    applyHeaders(res);

    const user = req.body
    let password = user.password;

    bcrypt.genSalt(10, (error, salt) => {
        if (error) {
            return res.status(500).send(getErrorResponse("Unknown error", error.toString()));
        }

        return bcrypt.hash(password, salt, (error, hash) => {
            user.password = hash;

            tb_users.create(user)
                .then(result => res.status(201).send(getUserResponse(true, result)))
                .catch(reason => res.status(500).send(getErrorResponse("Unknown error", reason)));
        })
    })
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

function sendAuthError(req) {
    return req.res.status(403).send(getErrorResponse("Access Denied", "You are not authorized to see this content"));
}

module.exports = {
    login,
    register,
    verifyToken
};
