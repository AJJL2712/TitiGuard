import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware'
import { register, login, refresh, logout, generate2FA, verify2FA, validate2FA, getProfile } from '../controllers/auth.controller'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)

// 2FA — generate y verify requieren estar autenticado
router.post('/2fa/generate', authenticate, generate2FA)
router.post('/2fa/verify', authenticate, verify2FA)

// validate no requiere auth porque es parte del flujo de login
router.post('/2fa/validate', validate2FA)

export default router

router.get('/profile', authenticate, getProfile)