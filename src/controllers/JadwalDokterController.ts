import {Request, Response} from "express";
import Helper from "../helpers/Helper";
import JadwalDokter from "../db/models/JadwalDokter";
import dtoHelper from "../helpers/dtoHelper";
import Dokter from "../db/models/Dokter";
import {Op, Sequelize} from "sequelize";

const AddJadwal = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {day, time_start, time_end, quota, status, date_from, date_to} = req.body;
        const doctor_id = res.locals.userId;
        const data = {
            day, time_start, time_end, quota, status, doctor_id
        };
        let dataInsert = {...data};
        const dataDate = Helper.getTotalJadwal(day, date_from, date_to);
        if (dataDate.length > 0) {
            const dataSave = dataDate.map(dm => ({...dataInsert, date: new Date(dm)}));
            await JadwalDokter.bulkCreate(dataSave);
            return res.status(201).send(Helper.responseData(201, 'ok', dataSave));
        }
        return res.status(400).send(Helper.responseData(400, 'bad request, tanggal dan hari tidak ada yang sesuai', ""));
    } catch (err: any) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const GetJadwal = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log(req.query);
        let keyword = req.query.keyword as string;
        keyword = keyword && keyword.toLowerCase();
        const {limit, offset, page} = dtoHelper.getPagination(req.query);
        let include;
        include = {
            model: Dokter,
            as: 'dokter',
            required: true,
            attributes: []
        }
        if (keyword) {
            include = {
                ...include,
                required: true,
                where: {
                    doctor_name: {[Op.like]: `%${keyword}%`}
                }
            }
        }

        const data = await JadwalDokter.findAndCountAll({
            limit, offset,
            attributes: {
                include: [[Sequelize.col('dokter.doctor_name'), 'doctor_name']]
            },
            include: include
        });

        if (data) {
            const response = dtoHelper.getPagingData(data, page, limit);
            return res.status(200).send(Helper.responseData(200, 'ok', response));
        }
        return res.status(400).send(Helper.responseData(400, 'bad request, tanggal dan hari tidak ada yang sesuai', ""));
    } catch (err: any) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const GetJadwalDokter = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {limit, offset, page} = dtoHelper.getPagination(req.query);
        const doctor_id = res.locals.userId;
        const data = await JadwalDokter.findAndCountAll({
            where: {doctor_id: doctor_id},
            limit, offset,
            attributes: {
                include: [[Sequelize.col('dokter.doctor_name'), 'doctor_name']]
            },
            include: {
                model: Dokter,
                as: 'dokter',
                required: false,
                attributes: []
            }
        });
        if (data) {
            const response = dtoHelper.getPagingData(data, page, limit);
            return res.status(200).send(Helper.responseData(200, 'ok', response));
        }
        return res.status(400).send(Helper.responseData(400, 'bad request, tanggal dan hari tidak ada yang sesuai', ""));
    } catch (err: any) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const DeleteJadwal = async (req: Request, res: Response): Promise<Response> => {
    try {
        const doctor_id = res.locals.userId;
        const id = req.params.id;
        const deleteData = await JadwalDokter.destroy({
            where: {
                id: id, doctor_id: doctor_id
            }
        });
        if (deleteData) return res.status(200).send(Helper.responseData(200, 'ok, data deleted', ''));
        return res.status(400).send(Helper.responseData(400, 'bad request, data invalid', ""));
    } catch (err: any) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const GetJadwalDetail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const data = await JadwalDokter.findByPk(id, {
            attributes: {
                include: [[Sequelize.col('dokter.doctor_name'), 'doctor_name']]
            },
            include: {
                model: Dokter,
                as: 'dokter',
                required: false,
                attributes: []
            }
        });
        if (data) return res.status(200).send(Helper.responseData(200, 'ok, data deleted', data));
        return res.status(404).send(Helper.responseData(404, 'data not found', ""));
    } catch (err: any) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

export default {AddJadwal, GetJadwal, GetJadwalDokter, DeleteJadwal, GetJadwalDetail}