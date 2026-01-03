"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFerry = exports.getFerries = void 0;
const db_1 = __importDefault(require("../utils/db"));
const zod_1 = require("zod");
const ferrySchema = zod_1.z.object({
    route: zod_1.z.string(),
    timing: zod_1.z.string(),
    totalSeats: zod_1.z.number(),
    pricing: zod_1.z.number(),
});
const getFerries = async (req, res) => {
    try {
        const { from, to, date } = req.query;
        const ferries = await db_1.default.ferry.findMany();
        res.json({ success: true, ferries });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Database error' });
    }
};
exports.getFerries = getFerries;
const createFerry = async (req, res) => {
    try {
        const body = ferrySchema.parse(req.body);
        const operatorId = req.user.id;
        const ferry = await db_1.default.ferry.create({
            data: {
                ...body,
                availableSeats: body.totalSeats,
                operatorId,
            },
        });
        res.status(201).json({ success: true, ferry });
    }
    catch (error) {
        res.status(400).json({ success: false, error: 'Invalid input' });
    }
};
exports.createFerry = createFerry;
