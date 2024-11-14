import {DataTypes} from "sequelize";
import {sequelize} from "../config/database.js";

const TrainingModel = sequelize.define(
    "Training",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        external_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        sport: {
            type: DataTypes.STRING,
            allowNull: false
        },
        distance: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        location: {
            type: DataTypes.JSON,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    },
    {
        timestamps: true,
        tableName: "Trainings"
    }
);

export default TrainingModel;
