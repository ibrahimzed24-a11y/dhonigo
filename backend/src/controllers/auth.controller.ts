import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../utils/db';
import { logger } from '../utils/logger';

// Mock OTP storage
const otps: Record<string, string> = {};

const phoneSchema = z.object({
    phone: z.string().min(7),
});

const verifySchema = z.object({
    phone: z.string().min(7),
    otp: z.string().length(6),
    role: z.enum(['TRAVELER', 'OPERATOR', 'ADMIN']).optional(),
});

export const requestOtp = async (req: Request, res: Response) => {
    try {
        const { phone } = phoneSchema.parse(req.body);
        const otp = "123456"; // Hardcoded for testing
        otps[phone] = otp;

        logger.info(`OTP for ${phone}: ${otp}`);
        res.status(200).json({ success: true, message: 'OTP sent' });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Invalid phone number' });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { phone, otp, role } = verifySchema.parse(req.body);

        if (otps[phone] !== otp) {
            return res.status(400).json({ success: false, error: 'Invalid OTP' });
        }

        delete otps[phone];

        let user = await prisma.user.findUnique({ where: { phone } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    phone,
                    role: role || 'TRAVELER',
                },
            });
        }

        const token = jwt.sign(
            { id: user.id, phone: user.phone, role: user.role },
            process.env.JWT_SECRET || 'dbonigo_secret_key',
            { expiresIn: '30d' }
        );

        res.status(200).json({ success: true, token, user });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Verification failed' });
    }
};

export const updateRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = z.object({ role: z.enum(['TRAVELER', 'OPERATOR']) }).parse(req.body);

        const user = await prisma.user.update({
            where: { id },
            data: { role },
        });

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Update failed' });
    }
};
