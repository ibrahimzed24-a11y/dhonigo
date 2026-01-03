import { Request, Response } from 'express';
export declare const requestOtp: (req: Request, res: Response) => Promise<void>;
export declare const verifyOtp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateRole: (req: Request, res: Response) => Promise<void>;
