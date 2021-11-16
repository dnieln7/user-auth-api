'use strict';

const swaggerTools = require('swagger-tools');
const express = require('express');
const cors = require('cors');
const YAML = require("yamljs");
const {verifyToken} = require('./api/controllers/auth.controller')

const swaggerConfig = YAML.load("./api/swagger/swagger.yaml");
const port = process.env.PORT || 10010;
let app = express();

let options = {
    controllers: './api/controllers',
    useStubs: process.env.NODE_ENV === 'development'
};

let securityOptions = {
    'Bearer': verifyToken
};

swaggerTools.initializeMiddleware(swaggerConfig, function (middleware) {

    app.use(middleware.swaggerMetadata());
    app.use(cors());
    app.use(middleware.swaggerSecurity(securityOptions));
    app.use(middleware.swaggerValidator());
    app.use(middleware.swaggerRouter(options));
    app.use(middleware.swaggerUi());
    app.listen(port);
});
