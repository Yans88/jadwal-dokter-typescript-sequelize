import {Request, Response} from "express";
import Helper from "../helpers/Helper";
import Dokter from "../db/models/Dokter";
import PasswordHelper from "../helpers/PasswordHelper";
import dtoHelper from "../helpers/dtoHelper";
import {Op} from "sequelize";
import fs from "fs";
import { v2 as cloudinary }  from "cloudinary";

const Register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {password, doctor_name, phone_number} = req.body;
        const username = req.body.username.toLowerCase();
        const email = req.body.email.toLowerCase();
        const passEncrypt = await PasswordHelper.encrypt(password);

        const code_otp = await Helper.generateOTP() as number;
        const user = await Dokter.create({
            username, doctor_name, email, password: passEncrypt, verified: false, phone_number, code_otp
        });
        return res.status(201).send(Helper.responseData(201, 'ok', user));
    } catch (err: any) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const UserLogin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {username, password} = req.body;
        const data = await Dokter.findOne({
            where: {username: username}
        });
        if (data) {
            if (!data.verified) return res.status(200).send(Helper.responseData(200, 'not verified', "Silahkan verifikasi kode OTP"));
            const matched = await PasswordHelper.decrypt(password, data.password);
            if (matched) {
                const dataUser = {
                    id: data.id,
                    doctor_name: data.doctor_name,
                    email: data.email,
                    phone_number: data.phone_number,
                    username: data.username,
                    verified: data.verified,
                }
                const token = Helper.generateToken(dataUser);
                const refreshToken = Helper.generateRefreshToken(dataUser);

                await data.save();
                res.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                const responseUser = {
                    ...dataUser,
                    token: token
                }
                return res.status(200).send(Helper.responseData(200, 'ok', responseUser));
            }
        }
        return res.status(401).send(Helper.responseData(401, 'unauthorized', ""));
    } catch (err: any) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const RefreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refresh_token = req.cookies?.refresh_token;
        if (!refresh_token) return res.status(401).send(Helper.responseData(401, 'unauthorized', ""));
        const decodeUser = Helper.getDataRefreshToken(refresh_token);
        if (decodeUser) {
            const dataUser = {
                id: decodeUser.id,
                name: decodeUser.doctor_name,
                email: decodeUser.email,
                phone_number: decodeUser.phone_number,
                verified: decodeUser.verified,
            }
            const token = Helper.generateToken(dataUser);
            const refreshToken = Helper.generateRefreshToken(dataUser);
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            const responseUser = {
                ...dataUser,
                token: token
            }
            return res.status(200).send(Helper.responseData(200, 'ok', responseUser));
        }
        return res.status(401).send(Helper.responseData(401, 'unauthorized', ""));
    } catch (err) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const VerifyOTP = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {code_otp} = req.body;
        const data = await Dokter.findOne({
            where: {code_otp: code_otp},
            attributes: {
                exclude: ['password']
            }
        });
        if (data) {
            data.code_otp = 1;
            data.verified = true;
            await data.save();
            return res.status(200).send(Helper.responseData(200, 'success', data));
        }
        return res.status(404).send(Helper.responseData(404, 'data not found', ""));
    } catch (err) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const Profile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = res.locals.userId;
        const data = await Dokter.findByPk(id, {
            attributes: {
                exclude: ['password']
            }
        });
        if (data) {
            return res.status(200).send(Helper.responseData(200, 'berhasil', data));
        }
        return res.status(404).send(Helper.responseData(404, 'data not found', ""));
    } catch (err) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const EditProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = res.locals.userId;
        const {doctor_name} = req.body;
        const username = req.body.username.toLowerCase();
        const data = await Dokter.findOne({
            where: {id: id},
            attributes: {
                exclude: ['password']
            }
        });
        if (data) {
            data.username = username;
            data.doctor_name = doctor_name;
            await data.save();
            return res.status(200).send(Helper.responseData(200, 'berhasil', data));
        }
        return res.status(404).send(Helper.responseData(404, 'data not found', ""));
    } catch (err) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const UserLogout = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refresh_token = req.cookies?.refresh_token;
        res.clearCookie("refresh_token");
        return res.status(200).send(Helper.responseData(200, 'logout', ""));
    } catch (err) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const GetAllDokter = async (req: Request, res: Response): Promise<Response> => {
    try {
        let keyword = req.query.keyword as string;
        keyword = keyword && keyword.toLowerCase();
        const {limit, offset, page} = dtoHelper.getPagination(req.query);
        let data;
        if (keyword) {
            data = await Dokter.findAndCountAll({
                where: {
                    doctor_name: {[Op.like]: `%${keyword}%`}
                },
                limit, offset,
                attributes: {
                    exclude: ['password']
                }
            });
        } else {
            data = await Dokter.findAndCountAll({
                limit, offset,
                attributes: {
                    exclude: ['password']
                }
            });
        }
        if (data) {
            const response = dtoHelper.getPagingData(data, page, limit);
            return res.status(200).send(Helper.responseData(200, 'berhasil', response));
        }
        return res.status(404).send(Helper.responseData(404, 'data not found', ""));
    } catch (err) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const DokterDetail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.query.id as string;
        if (!id) return res.status(400).send(Helper.responseData(400, 'bad request, id required', ""));
        const data = await Dokter.findByPk(id, {
            attributes: {
                exclude: ['password']
            }
        });
        if (data) return res.status(200).send(Helper.responseData(200, 'berhasil', data));
        return res.status(404).send(Helper.responseData(404, 'data not found', ""));
    } catch (err) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const ChangePassword = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = res.locals.userId;
        const {old_password, new_password} = req.body;
        const data = await Dokter.findByPk(id);
        if (data) {
            const matched = await PasswordHelper.decrypt(old_password, data.password);

            if (matched) {
                const matched_new = await PasswordHelper.decrypt(new_password, data.password);
                if(matched_new) return res.status(400).send(Helper.responseData(400, 'bad request, new password harus berbeda dengan password anda sebelumnya', ""));
                data.password = await PasswordHelper.encrypt(new_password);
                data.save();
            }else{
                return res.status(400).send(Helper.responseData(400, 'bad request, old password not match', ""));
            }
            return res.status(200).send(Helper.responseData(200, 'berhasil', data));
        }
        return res.status(404).send(Helper.responseData(404, 'data not found', ""));
    } catch (err) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }
}

const UploadPhoto = async (req:Request, res :Response):Promise<Response>=>{
    try{
        const data = await cloudinary.uploader.upload("img.jpg");
        console.log(data);
        return res.status(200).send(Helper.responseData(200, 'berhasil', data));
    }catch (err) {
        if (err != null && err instanceof Error) {
            return res.status(500).send(Helper.responseData(500, err.message, err));
        } else {
            return res.status(500).send(Helper.responseData(500, "internal server error", err));
        }
    }

}

export default {
    Register,
    UserLogin,
    RefreshToken,
    VerifyOTP,
    Profile,
    UserLogout,
    EditProfile,
    GetAllDokter,
    DokterDetail,
    ChangePassword
};