module.exports = (sequelize, DataTypes) => {
    return sequelize.define('usertable', {
        userid: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        }
    });
};

// 이렇게 정의하고 생성하면, usertables라는 Table이 생성된다.