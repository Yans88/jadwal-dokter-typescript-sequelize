import {Sequelize} from "sequelize";

import dotenv from "dotenv";

dotenv.config();

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbDialect = "mysql";

const {DB_PASSWORD, DB_HOST} = process.env;

const sequelizeConnection = new Sequelize(dbName, dbUser, DB_PASSWORD, {
    host: DB_HOST,
    dialect: dbDialect,
    sync: {force: false},
    define: {
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        deletedAt: 'deleted_at'
    },
});
export default sequelizeConnection;