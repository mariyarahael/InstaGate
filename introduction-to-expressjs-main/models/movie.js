const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Movie = sequelize.define("Movie", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    moviename: { type: DataTypes.STRING, allowNull: false, unique: true },
    
});


module.exports = Movie;
