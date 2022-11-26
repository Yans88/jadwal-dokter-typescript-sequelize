import bcrypt from "bcrypt";

const encrypt = async (pass: string): Promise<string> => {
    const result = await bcrypt.hash(pass, 10);
    return result;
}

const decrypt = async (pass: string, passEncrypt: string): Promise<boolean> => {
    const matched = await bcrypt.compare(pass, passEncrypt);
    return matched;
}

export default {encrypt, decrypt};