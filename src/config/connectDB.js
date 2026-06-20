
const Sequelize = require('sequelize');
const config = require(__dirname + '/config.json')[process.env.NODE_ENV || 'development'];

// Use the same config as models/index.js
const sequelize = new Sequelize(config.database, config.username, config.password, config);

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // 1. Seed role R4 (RECEPTIONIST) if not exists
        const [results] = await sequelize.query("SELECT * FROM allcodes WHERE keyMap = 'R4' AND type = 'ROLE'");
        if (results.length === 0) {
            await sequelize.query("INSERT INTO allcodes (keyMap, type, valueVi, valueEn, createdAt, updatedAt) VALUES ('R4', 'ROLE', 'Lễ tân / Nhân viên y tế', 'Receptionist', NOW(), NOW())");
            console.log('Seeded role R4 successfully.');
        }

        // 2. Check and dynamically add vitals columns to bookings table
        const queryInterface = sequelize.getQueryInterface();
        const tableInfo = await queryInterface.describeTable('bookings');

        if (!tableInfo.weight) {
            await queryInterface.addColumn('bookings', 'weight', {
                type: Sequelize.STRING,
                allowNull: true
            });
            console.log('Added column weight to bookings table.');
        }
        if (!tableInfo.height) {
            await queryInterface.addColumn('bookings', 'height', {
                type: Sequelize.STRING,
                allowNull: true
            });
            console.log('Added column height to bookings table.');
        }
        if (!tableInfo.bloodPressure) {
            await queryInterface.addColumn('bookings', 'bloodPressure', {
                type: Sequelize.STRING,
                allowNull: true
            });
            console.log('Added column bloodPressure to bookings table.');
        }
        if (!tableInfo.temperature) {
            await queryInterface.addColumn('bookings', 'temperature', {
                type: Sequelize.STRING,
                allowNull: true
            });
            console.log('Added column temperature to bookings table.');
        }
        if (!tableInfo.symptoms) {
            await queryInterface.addColumn('bookings', 'symptoms', {
                type: Sequelize.TEXT,
                allowNull: true
            });
            console.log('Added column symptoms to bookings table.');
        }
    } catch (error) {
        console.error('Unable to connect or initialize the database:', error);
    }
}

module.exports = connectDB;