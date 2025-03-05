const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_NAME, // Use SQLite database file
    logging: false, // Disable logging
});

sequelize.authenticate()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("Error: " + err));

module.exports = sequelize;
