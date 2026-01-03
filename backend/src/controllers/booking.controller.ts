import { Request, Response } from 'express';
import prisma from '../utils/db';
import { z } from 'zod';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { ferryId, seats } = z.object({
            ferryId: z.string(),
            seats: z.number().min(1),
        }).parse(req.body);

        const userId = (req as any).user.id;
        const ferry = await prisma.ferry.findUnique({ where: { id: ferryId } });

        if (!ferry || ferry.availableSeats < seats) {
            return res.status(400).json({ success: false, error: 'Insufficient seats' });
        }

        const totalAmount = ferry.pricing * seats;
        const referenceCode = `DBG-${Math.floor(Math.random() * 900000 + 100000)}`;

        const booking = await prisma.booking.create({
            data: {
                userId,
                ferryId,
                seats,
                totalAmount,
                referenceCode,
            },
        });

        res.status(201).json({ success: true, booking });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Booking failed' });
    }
};

export const uploadProof = async (req: Request, res: Response) => {
    try {
        const { bookingId, slipUrl } = req.body;
        const booking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                paymentStatus: 'VERIFYING',
                paymentProof: slipUrl,
            },
        });
        res.json({ success: true, booking });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Upload failed' });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { bookingId, status } = req.body; // status: APPROVED or REJECTED
        const adminId = (req as any).user.id;

        const booking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                paymentStatus: status === 'APPROVED' ? 'PAID' : 'CANCELLED',
            },
            include: { ferry: true }
        });

        if (status === 'APPROVED') {
            await prisma.ferry.update({
                where: { id: booking.ferryId },
                data: {
                    availableSeats: { decrement: booking.seats },
                },
            });
        }

        await prisma.paymentVerification.create({
            data: {
                bookingId,
                adminId,
                status,
            }
        });

        res.json({ success: true, booking });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Verification failed' });
    }
};
