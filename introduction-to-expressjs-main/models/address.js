const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Address = sequelize.define("Address", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    housename: { type: DataTypes.STRING, allowNull: false, unique: true },
    
});


module.exports = Address;
