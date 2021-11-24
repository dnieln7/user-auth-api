module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('tb_users', {
        type: DataTypes.STRING(1),
        email: DataTypes.STRING,
        google_id: DataTypes.STRING,
        password: DataTypes.STRING,
        role: DataTypes.STRING
    }, {});
    User.associate = function (models) {

    };
    return User;
};
