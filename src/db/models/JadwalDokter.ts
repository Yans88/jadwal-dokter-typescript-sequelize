import {DataTypes, Model, Optional} from "sequelize";
import connection from "../../config/dbConnect";
import Dokter from "./Dokter";

interface JadwalDokterAttributes {
    id?: number,
    doctor_id?: number,
    day?: string | null,
    time_start?: string | null,
    time_end?: string | null,
    quota?: number | null,
    status?: boolean | null,
    date?: Date,
    date_from?: Date | null,
    date_to?: Date | null,

    created_at?: Date,
    updated_at?: Date
}

export interface JadwalDokterInput extends Optional<JadwalDokterAttributes, 'id'> {
}

class JadwalDokter extends Model<JadwalDokterAttributes, JadwalDokterInput> implements JadwalDokterAttributes {
    public id!: number;
    public doctor_id!: number;
    public day!: string;
    public time_start!: string;
    public time_end!: string;
    public quota!: number;
    public status!: boolean;
    public date!: Date;
    public date_from!: Date;
    public date_to!: Date;

    public created_at!: Date;
    public updated_at!: Date;
}

JadwalDokter.init({
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    day: {
        type: DataTypes.STRING
    },
    time_start: {
        type: DataTypes.TIME
    },
    time_end: {
        type: DataTypes.TIME
    },
    quota: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    date: {
        type: DataTypes.DATE
    },
    doctor_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'Dokter',
            key: 'id'
        }
    },
}, {
    sequelize: connection,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'JadwalDokter',
    tableName: 'jadwal_dokter'
})


JadwalDokter.belongsTo(Dokter, {as: 'dokter', foreignKey: "doctor_id"});

export default JadwalDokter;