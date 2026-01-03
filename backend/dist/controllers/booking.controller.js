"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.uploadProof = exports.createBooking = void 0;
const db_1 = __importDefault(require("../utils/db"));
const zod_1 = require("zod");
const createBooking = async (req, res) => {
    try {
        const { ferryId, seats } = zod_1.z.object({
            ferryId: zod_1.z.string(),
            seats: zod_1.z.number().min(1),
        }).parse(req.body);
        const userId = req.user.id;
        const ferry = await db_1.default.ferry.findUnique({ where: { id: ferryId } });
        if (!ferry || ferry.availableSeats < seats) {
            return res.status(400).json({ success: false, error: 'Insufficient seats' });
        }
        const totalAmount = ferry.pricing * seats;
        const referenceCode = `DBG-${Math.floor(Math.random() * 900000 + 100000)}`;
        const booking = await db_1.default.booking.create({
            data: {
                userId,
                ferryId,
                seats,
                totalAmount,
                referenceCode,
            },
        });
        res.status(201).json({ success: true, booking });
    }
    catch (error) {
        res.status(400).json({ success: false, error: 'Booking failed' });
    }
};
exports.createBooking = createBooking;
const uploadProof = async (req, res) => {
    try {
        const { bookingId, slipUrl } = req.body;
        const booking = await db_1.default.booking.update({
            where: { id: bookingId },
            data: {
                paymentStatus: 'VERIFYING',
                paymentProof: slipUrl,
            },
        });
        res.json({ success: true, booking });
    }
    catch (error) {
        res.status(400).json({ success: false, error: 'Upload failed' });
    }
};
exports.uploadProof = uploadProof;
const verifyPayment = async (req, res) => {
    try {
        const { bookingId, status } = req.body; // status: APPROVED or REJECTED
        const adminId = req.user.id;
        const booking = await db_1.default.booking.update({
            where: { id: bookingId },
            data: {
                paymentStatus: status === 'APPROVED' ? 'PAID' : 'CANCELLED',
            },
            include: { ferry: true }
        });
        if (status === 'APPROVED') {
            await db_1.default.ferry.update({
                where: { id: booking.ferryId },
                data: {
                    availableSeats: { decrement: booking.seats },
                },
            });
        }
        await db_1.default.paymentVerification.create({
            data: {
                bookingId,
                adminId,
                status,
            }
        });
        res.json({ success: true, booking });
    }
    catch (error) {
        res.status(400).json({ success: false, error: 'Verification failed' });
    }
};
exports.verifyPayment = verifyPayment;
