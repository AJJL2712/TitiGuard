import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import { authenticate, AuthRequest } from './middlewares/auth.middleware'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

// Ruta protegida de prueba
app.get('/api/me', authenticate, (req: AuthRequest, res) => {
    res.json({ message: 'Ruta protegida', user: req.user })
})

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'TitiGuard API running' })
})

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})