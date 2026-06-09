'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor_Clinic_Specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Doctor_Clinic_Specialty.belongsTo(models.User, { foreignKey: 'doctorId' });
            Doctor_Clinic_Specialty.belongsTo(models.Specialty, { foreignKey: 'specialtyId', as: 'specialtyData' });
        }
    };
    Doctor_Clinic_Specialty.init({

        doctorId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,


    }, {
        sequelize,
        modelName: 'Doctor_Clinic_Specialty',
        freezeTableName: true,
        tableName: 'doctor_clinic_specialty'
    });
    return Doctor_Clinic_Specialty;
};