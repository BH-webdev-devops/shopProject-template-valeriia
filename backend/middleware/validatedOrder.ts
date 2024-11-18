import { Request, Response, NextFunction } from "express";

export const validateOrderRequest = (req: Request, res: Response, next: NextFunction) : void => {
    const { userId, items } = req.body;

    if (!userId || typeof userId !== 'number') {
        res.status(500).json({ message: "Invalid or missing 'userId" });
    }

    if (!Array.isArray(items) || items.length === 0) {
        res.status(500).json({ message: "products' should be a non-empty array" });
    }

    for (const item of items) {
        if (typeof item.product.id !== 'number' || typeof item.count !== 'number') {
            res.status(500).json({ message: "Each product must have a valid 'id' and 'count' (both numbers)"});
        }
    }
    next();
};