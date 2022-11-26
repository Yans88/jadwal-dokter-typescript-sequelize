import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Dokter from "../db/models/Dokter";

dotenv.config();

interface UserData {
    id: number | null,
    doctor_name: string | null,
    username: string | null,
    email: string | null,
    phone_number: string | null,
    verified: boolean | null
}

const responseData = (status: number, message: string | null, data: any | null) => {
    const response = {
        status: status,
        message: message,
        body: data
    }
    return response;
}

const generateToken = (data: any): string => {
    return jwt.sign(data, process.env.JWT_KEY as string, {expiresIn: "120m"});
}

const generateRefreshToken = (data: any): string => {
    return jwt.sign(data, process.env.JWT_KEY_REFRESH_TOKEN as string, {expiresIn: "1d"});
}

const getDataToken = (token: string): UserData | null => {
    const secretKey: string = process.env.JWT_KEY as string;
    let resData: any;
    jwt.verify(token, secretKey, (err: any, decode: any) => {
        if (!err) {
            resData = decode;
        } else {
            resData = "";
        }
    });
    if (resData) {
        const result: UserData = <UserData>(resData);
        return result;
    }
    return null;
}

const getDataRefreshToken = (token: string): UserData | null => {
    const secretKey: string = process.env.JWT_KEY_REFRESH_TOKEN as string;
    let resData: any;
    jwt.verify(token, secretKey, (err: any, decode: any) => {
        if (!err) {
            resData = decode;
        } else {
            resData = "";
        }
    });
    if (resData) {
        const result: UserData = <UserData>(resData);
        return result;
    }
    return null;
}
const generateOTP = async (): Promise<number> => {
    let otpStatus = false;
    let otp = 0;
    while (!otpStatus) {
        otp = Math.floor(1000 + Math.random() * 9000);
        const res = await Dokter.findOne({where: {code_otp: otp}});
        if (!res) otpStatus = true;
    }
    return otp;
}

const getTotalJadwal = (day: string, dateFrom: Date, dateTo: Date): string[] => {
    const daysArray = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    let arr = [];
    for (let dt = new Date(dateFrom); dt <= new Date(dateTo); dt.setDate(dt.getDate() + 1)) {
        let date = new Date(dt).getDay();
        if (daysArray[date] === day.toLowerCase()) {
            arr.push(new Date(dt).toString());
        }
    }
    return arr;
}

export default {
    responseData,
    generateToken,
    generateRefreshToken,
    getDataToken,
    getDataRefreshToken,
    generateOTP,
    getTotalJadwal
};