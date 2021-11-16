'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('tb_reports', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            creator_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'tb_users',
                    key: 'id'
                }
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            date: {
                type: Sequelize.STRING,
                allowNull: false
            },
            picture: {
                type: Sequelize.STRING,
                allowNull: true
            },
            location: {
                type: Sequelize.ARRAY(Sequelize.FLOAT),
                allowNull: false
            },
            location_description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            resolved: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('tb_reports');
    }
};
