import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = (user) => {
    return jsonwebtoken.sign({
        cardUID: user.cardUID,
        authority: user.authority,
    }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

export const verifyToken = (token) => {
    try {
        return jsonwebtoken.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
};

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 15);
};

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};