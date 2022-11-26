import {NextFunction, Request, Response} from "express";
import Validator from "validatorjs";
import Helper from "../../helpers/Helper";

const InputValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const daysArray = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
        const {day, time_start, time_end, quota, status, date_from, date_to} = req.body;
        const data = {
            day, quota, status, date_from, date_to, time_start, time_end
        };
        const start = new Date(date_from);
        const end = new Date(date_to);
        const rules: Validator.Rules = {
            "day": "required|string",
            "time_start": "required|string",
            "time_end": "required|string",
            "quota": "required|numeric",
            "status": "required|boolean",
            "date_from": "required|date",
            "date_to": "required|date",
        };
        const validate = new Validator(data, rules);
        if (validate.fails()) {
            return res.status(400).send(Helper.responseData(400, "bad request", validate.errors));
        }
        if (!daysArray.includes(day.toLowerCase())) {
            const errorData = {
                errors: {
                    day: [
                        "day invalid"
                    ]
                }
            };
            return res.status(400).send(Helper.responseData(400, "bad request", errorData))
        }
        const regexTime = /^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/;
        if (!regexTime.test(time_start)) {
            const errorData = {
                errors: {
                    date_to: [
                        "time start invalid"
                    ]
                }
            };
            return res.status(400).send(Helper.responseData(400, "bad request", errorData))
        }
        if (!regexTime.test(time_end)) {
            const errorData = {
                errors: {
                    date_to: [
                        "time end invalid"
                    ]
                }
            };
            return res.status(400).send(Helper.responseData(400, "bad request", errorData))
        }

        if (new Date() > start) {
            const errorData = {
                errors: {
                    date_to: [
                        "date from invalid"
                    ]
                }
            };
            return res.status(400).send(Helper.responseData(400, "bad request", errorData))
        }
        if (end < start) {
            const errorData = {
                errors: {
                    date_to: [
                        "date to invalid"
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

export default {InputValidation};