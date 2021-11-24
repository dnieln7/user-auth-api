'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const {Sequelize} = require('sequelize');

const basename = path.basename(__filename);
const database = {};
const sequelize = getSequelize();

function getSequelize() {
    const env = process.env.SEQUELIZE_ENV || "development"

    if (env === "development") {
        return new Sequelize(
            process.env.DB_DATABASE,
            process.env.DB_USERNAME,
            process.env.DB_PASSWORD,
            {
                port: process.env.DB_PORT,
                host: process.env.DB_HOST,
                dialect: 'postgres'
            }
        );
    } else {
        new Sequelize(
            process.env.DB_DATABASE,
            process.env.DB_USERNAME,
            process.env.DB_PASSWORD,
            {
                port: process.env.DB_PORT,
                host: process.env.DB_HOST,
                dialect: 'postgres',
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                }
            }
        );
    }
}

async function connect() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connect().then(_ => console.log('Connection verification finished'));

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        database[model.name] = model;
    });

Object.keys(database).forEach(modelName => {
    if (database[modelName].associate) {
        database[modelName].associate(database);
    }
});

database.sequelize = sequelize;
database.Sequelize = Sequelize;

module.exports = database;
