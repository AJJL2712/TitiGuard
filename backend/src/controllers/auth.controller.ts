import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { AuthRequest } from '../middlewares/auth.middleware'

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ error: 'Email y contraseña son requeridos' })
            return
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            res.status(400).json({ error: 'El email ya está registrado' })
            return
        }

        const passwordHash = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: { email, passwordHash }
        })

        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: '15m' }
        )

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            accessToken,
            user: { id: user.id, email: user.email }
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ error: 'Email y contraseña son requeridos' })
            return
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            res.status(401).json({ error: 'Credenciales incorrectas' })
            return
        }

        const passwordValid = await bcrypt.compare(password, user.passwordHash)

        if (!passwordValid) {
            res.status(401).json({ error: 'Credenciales incorrectas' })
            return
        }

        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: '15m' }
        )

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: '7d' }
        )

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt
            }
        })

        res.json({
            message: 'Login exitoso',
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email }
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            res.status(400).json({ error: 'Refresh token requerido' })
            return
        }

        // Eliminar el refresh token de la base de datos
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken }
        })

        res.json({ message: 'Logout exitoso' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export const refresh = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            res.status(400).json({ error: 'Refresh token requerido' })
            return
        }

        // Verificar que el token es válido
        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET as string
        ) as { userId: string }

        // Verificar que existe en la base de datos y no ha expirado
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        })

        if (!storedToken || storedToken.expiresAt < new Date()) {
            res.status(401).json({ error: 'Refresh token inválido o expirado' })
            return
        }

        // Buscar el usuario
        const user = await prisma.user.findUnique({
            where: { id: payload.userId }
        })

        if (!user) {
            res.status(401).json({ error: 'Usuario no encontrado' })
            return
        }

        // Generar nuevo access token
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: '15m' }
        )

        res.json({ accessToken })

    } catch (error) {
        res.status(401).json({ error: 'Refresh token inválido' })
    }
}

export const generate2FA = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId

        const secret = speakeasy.generateSecret({
            name: `TitiGuard (${req.user?.email})`,
            length: 20,
        })

        await prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret.base32 },
        })

        const qrCode = await QRCode.toDataURL(secret.otpauth_url as string)

        res.json({
            secret: secret.base32,
            qrCode,
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export const verify2FA = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId
        const { code } = req.body

        if (!code) {
            res.status(400).json({ error: 'Código requerido' })
            return
        }

        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!user?.twoFactorSecret) {
            res.status(400).json({ error: '2FA no iniciado' })
            return
        }

        const valid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
            window: 1,
        })

        if (!valid) {
            res.status(400).json({ error: 'Código inválido' })
            return
        }

        await prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true },
        })

        res.json({ message: '2FA activado correctamente' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export const validate2FA = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, code } = req.body

        if (!userId || !code) {
            res.status(400).json({ error: 'userId y código son requeridos' })
            return
        }

        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!user?.twoFactorSecret) {
            res.status(400).json({ error: '2FA no configurado' })
            return
        }

        const valid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
            window: 1,
        })

        if (!valid) {
            res.status(400).json({ error: 'Código inválido' })
            return
        }

        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: '15m' }
        )

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: '7d' }
        )

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        await prisma.refreshToken.create({
            data: { token: refreshToken, userId: user.id, expiresAt }
        })

        res.json({
            message: 'Login exitoso',
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email },
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}