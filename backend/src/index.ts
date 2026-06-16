import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares globales
app.use(helmet())        // Headers de seguridad
app.use(cors())          // Permite peticiones del frontend
app.use(express.json())  // Parsea el body de las peticiones como JSON

// Ruta de prueba
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'TitiGuard API running' })
})

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})