module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define('tb_reports', {
        creator_id: DataTypes.INTEGER,
        description: DataTypes.STRING,
        date: DataTypes.STRING,
        picture: DataTypes.STRING,
        location: DataTypes.ARRAY(DataTypes.FLOAT),
        location_description: DataTypes.STRING,
        resolved: DataTypes.BOOLEAN,
    }, {});
    Report.associate = function (models) {
        Report.belongsTo(models.User, {foreignKey: 'creator_id', as: 'creator'})
    };
    return User;
};
