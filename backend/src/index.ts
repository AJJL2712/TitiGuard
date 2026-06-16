import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares globales
app.use(helmet())
app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)

// Ruta de prueba
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'TitiGuard API running' })
})

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})