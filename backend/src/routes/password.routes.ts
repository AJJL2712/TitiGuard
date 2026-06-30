import { Router } from 'express'
import { getPasswords, createPassword, updatePassword, deletePassword } from '../controllers/password.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()

router.use(authenticate)

router.get('/', getPasswords)
router.post('/', createPassword)
router.put('/:id', updatePassword)
router.delete('/:id', deletePassword)

export default router