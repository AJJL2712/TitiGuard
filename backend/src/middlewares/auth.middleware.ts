import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Extendemos el tipo Request para agregarle el usuario
export interface AuthRequest extends Request {
    user?: {
        userId: string
        email: string
    }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Token requerido' })
            return
        }

        const token = authHeader.split(' ')[1]

        const payload = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET as string
        ) as { userId: string, email: string }

        req.user = payload
        next()

    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado' })
    }
}