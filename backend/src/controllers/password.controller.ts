import { Response } from 'express'
import prisma from '../utils/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export const getPasswords = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const passwords = await prisma.password.findMany({
            where: { userId: req.user?.userId },
            orderBy: { createdAt: 'desc' },
        })
        res.json({ passwords })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export const createPassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, username, encryptedPassword, url, notes, category } = req.body

        if (!name || !encryptedPassword) {
            res.status(400).json({ error: 'Nombre y contraseña son requeridos' })
            return
        }

        const password = await prisma.password.create({
            data: {
                userId: req.user?.userId as string,
                name,
                username: username ?? null,
                encryptedPassword,
                url: url ?? null,
                notes: notes ?? null,
                category: category ?? null,
            },
        })

        res.status(201).json({ password })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export const updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string }
        const { name, username, encryptedPassword, url, notes, category } = req.body

        const existing = await prisma.password.findFirst({
            where: { id, userId: req.user?.userId },
        })

        if (!existing) {
            res.status(404).json({ error: 'Contraseña no encontrada' })
            return
        }

        const password = await prisma.password.update({
            where: { id },
            data: {
                name,
                username: username ?? null,
                encryptedPassword,
                url: url ?? null,
                notes: notes ?? null,
                category: category ?? null,
            },
        })

        res.json({ password })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export const deletePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string }

        const existing = await prisma.password.findFirst({
            where: { id, userId: req.user?.userId },
        })

        if (!existing) {
            res.status(404).json({ error: 'Contraseña no encontrada' })
            return
        }

        await prisma.password.delete({ where: { id } })
        res.json({ message: 'Contraseña eliminada' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}