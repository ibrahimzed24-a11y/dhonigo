import { Request, Response } from 'express';
export declare const createBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadProof: (req: Request, res: Response) => Promise<void>;
export declare const verifyPayment: (req: Request, res: Response) => Promise<void>;
