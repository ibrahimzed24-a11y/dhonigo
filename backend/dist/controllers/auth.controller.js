"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRole = exports.verifyOtp = exports.requestOtp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = __importDefault(require("../utils/db"));
const logger_1 = require("../utils/logger");
// Mock OTP storage
const otps = {};
const phoneSchema = zod_1.z.object({
    phone: zod_1.z.string().min(7),
});
const verifySchema = zod_1.z.object({
    phone: zod_1.z.string().min(7),
    otp: zod_1.z.string().length(6),
    role: zod_1.z.enum(['TRAVELER', 'OPERATOR', 'ADMIN']).optional(),
});
const requestOtp = async (req, res) => {
    try {
        const { phone } = phoneSchema.parse(req.body);
        const otp = "123456"; // Hardcoded for testing
        otps[phone] = otp;
        logger_1.logger.info(`OTP for ${phone}: ${otp}`);
        res.status(200).json({ success: true, message: 'OTP sent' });
    }
    catch (error) {
        res.status(400).json({ success: false, error: 'Invalid phone number' });
    }
};
exports.requestOtp = requestOtp;
const verifyOtp = async (req, res) => {
    try {
        const { phone, otp, role } = verifySchema.parse(req.body);
        if (otps[phone] !== otp) {
            return res.status(400).json({ success: false, error: 'Invalid OTP' });
        }
        delete otps[phone];
        let user = await db_1.default.user.findUnique({ where: { phone } });
        if (!user) {
            user = await db_1.default.user.create({
                data: {
                    phone,
                    role: role || 'TRAVELER',
                },
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, phone: user.phone, role: user.role }, process.env.JWT_SECRET || 'dbonigo_secret_key', { expiresIn: '30d' });
        res.status(200).json({ success: true, token, user });
    }
    catch (error) {
        res.status(400).json({ success: false, error: 'Verification failed' });
    }
};
exports.verifyOtp = verifyOtp;
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = zod_1.z.object({ role: zod_1.z.enum(['TRAVELER', 'OPERATOR']) }).parse(req.body);
        const user = await db_1.default.user.update({
            where: { id },
            data: { role },
        });
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        res.status(400).json({ success: false, error: 'Update failed' });
    }
};
exports.updateRole = updateRole;
