import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma'

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