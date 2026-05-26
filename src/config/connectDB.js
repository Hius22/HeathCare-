
const Sequelize = require('sequelize');
const config = require(__dirname + '/config.json')[process.env.NODE_ENV || 'development'];

// Use the same config as models/index.js
const sequelize = new Sequelize(config.database, config.username, config.password, config);

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;