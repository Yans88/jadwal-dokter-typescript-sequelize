import {DataTypes, Model, Optional} from "sequelize";
import connection from "../../config/dbConnect";

interface DokterAttributes {
    id?: number,
    doctor_name?: string | null,
    email?: string | null,
    username?: string | null,
    password?: string | null,
    phone_number?: string | null,
    code_otp?: number | null,
    verified?: boolean | null,
    created_at?: Date,
    updated_at?: Date
}

export interface DokterInput extends Optional<DokterAttributes, 'id'> {
}

class Dokter extends Model<DokterAttributes, DokterInput> implements DokterAttributes {
    public id!: number;
    public doctor_name!: string;
    public username!: string;
    public email!: string;
    public password!: string;
    public phone_number!: string;
    public code_otp!: number;
    public verified!: boolean;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Dokter.init({
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    doctor_name: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.TEXT
    },
    phone_number: {
        type: DataTypes.STRING,
        unique: true
    },
    verified: {
        type: DataTypes.BOOLEAN
    },
    code_otp: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: connection,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'dokter',
    tableName: 'dokter'
});


export default Dokter;