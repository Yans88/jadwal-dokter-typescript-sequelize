import {NextFunction, Request, Response} from "express";
import Helper from "../helpers/Helper";

const Authenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authToken = req.headers["authorization"];
        const token = authToken && authToken.split(" ")[1];
        const refresh_token = req.cookies?.refresh_token;
        if (!token) return res.status(401).send(Helper.responseData(401, 'unauthorized', ""));
        if (!refresh_token) return res.status(401).send(Helper.responseData(401, 'unauthorized', ""));
        const result = Helper.getDataToken(token);
        if (!result) return res.status(401).send(Helper.responseData(401, 'unauthorized', ""));
        res.locals.userId = result.id;
        next();
    } catch (err: any) {
        return res.status(500).send(Helper.responseData(500, "internal server error", err));
    }
}

export default {Authenticated};