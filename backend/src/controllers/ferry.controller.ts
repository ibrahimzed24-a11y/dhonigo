import { Request, Response } from 'express';
import prisma from '../utils/db';
import { z } from 'zod';

const ferrySchema = z.object({
    route: z.string(),
    timing: z.string(),
    totalSeats: z.number(),
    pricing: z.number(),
});

export const getFerries = async (req: Request, res: Response) => {
    try {
        const { from, to, date } = req.query;
        const ferries = await prisma.ferry.findMany();
        res.json({ success: true, ferries });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Database error' });
    }
};

export const createFerry = async (req: Request, res: Response) => {
    try {
        const body = ferrySchema.parse(req.body);
        const operatorId = (req as any).user.id;

        const ferry = await prisma.ferry.create({
            data: {
                ...body,
                availableSeats: body.totalSeats,
                operatorId,
            },
        });
        res.status(201).json({ success: true, ferry });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Invalid input' });
    }
};
