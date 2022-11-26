import Validator from "validatorjs";
import {NextFunction, Request, Response} from "express";
import Helper from "../../helpers/Helper";
import Dokter from "../../db/models/Dokter";
import {Op} from "sequelize";

const RegisterValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {doctor_name, email, password, username, phone_number} = req.body;

        const data = {
            doctor_name,
            email,
            password,
            username,
            phone_number
        };

        const rules: Validator.Rules = {
            "doctor_name": "required|string|max:50",
            "email": "required|string|email",
            "password": "required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/",
            "phone_number": "required|string|max:15",
            "username": "required|string|min:5"
        };

        const validate = new Validator(data, rules);

        if (validate.fails()) {
            return res.status(400).send(Helper.responseData(400, "bad request", validate.errors));
        }

        const user = await Dokter.findOne({
            where: {
                [Op.or]: [
                    {email: data.email},
                    {username: data.username},
                    {phone_number: data.phone_number}
                ]
            }
        });

        if (user) {
            const errorData = {
                errors: {
                    email: [
                        "user already exist"
                    ]
                }
            };
            return res.status(400).send(Helper.responseData(400, "bad request", errorData))
        }
        next();
    } catch (error: any) {
        return res.status(500).send(Helper.responseData(500, "", error));
    }
};


const EditProfileValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {doctor_name, password, username} = req.body;

        const data = {
            doctor_name,
            username,
        };

        const rules: Validator.Rules = {
            "doctor_name": "required|string|max:50",
            "username": "required|string|min:5"
        };

        const validate = new Validator(data, rules);

        if (validate.fails()) {
            return res.status(400).send(Helper.responseData(400, "bad request", validate.errors));
        }

        const user = await Dokter.findOne({
            where: {
                username: data.username,
                [Op.not]: [{id: res.locals.userId}]
            }
        });

        if (user) {
            const errorData = {
                errors: {
                    email: [
                        "username already exist"
                    ]
                }
            };
            return res.status(400).send(Helper.responseData(400, "bad request", errorData))
        }
        next();
    } catch (error: any) {
        return res.status(500).send(Helper.responseData(500, "", error));
    }

};

const LoginValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {password, username} = req.body;
        const data = {
            password,
            username
        };
        const rules: Validator.Rules = {
            "password": "required|string|min:8",
            "username": "required|string|min:5"
        };
        const validate = new Validator(data, rules);
        if (validate.fails()) {
            return res.status(400).send(Helper.responseData(400, "bad request", validate.errors));
        }
        next();
    } catch (error: any) {
        return res.status(500).send(Helper.responseData(500, "", error));
    }
};

const VerifyOTPValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {code_otp} = req.body;
        const data = {
            code_otp
        };
        const rules: Validator.Rules = {
            "code_otp": "required|numeric|min:4"
        };
        const validate = new Validator(data, rules);
        if (validate.fails()) {
            return res.status(400).send(Helper.responseData(400, "bad request", validate.errors));
        }
        next();
    } catch (error: any) {
        return res.status(500).send(Helper.responseData(500, "", error));
    }
};

const ChangePasswordValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {old_password,new_password,confirm_password} = req.body;
        const data = {
            old_password, new_password,confirm_password
        };
        const rules: Validator.Rules = {
            "old_password": "required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/",
            "new_password": "required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/",
            "confirm_password": "required|same:new_password",
        };
        const validate = new Validator(data, rules);
        if (validate.fails()) {
            return res.status(400).send(Helper.responseData(400, "bad request", validate.errors));
        }
        next();
    } catch (error: any) {
        return res.status(500).send(Helper.responseData(500, "", error));
    }
};

export default {RegisterValidation, LoginValidation, VerifyOTPValidation, EditProfileValidation, ChangePasswordValidation};