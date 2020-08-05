module.exports = (sequelize, DataTypes) => {
    return sequelize.define('content', {
        subject: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        contents: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING(20),
            allowNull: false,
        }
    });
};