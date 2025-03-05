const sequelize = require("../config/database");
const User = require("./User");
const Movie = require("./movie");
const Address = require("./address");

sequelize.sync({ force: false }) // Set true for development to reset tables
    .then(() => console.log("Tables synced"))
    .catch(err => console.log("Sync error: ", err));

module.exports = { User,Movie,Address };
