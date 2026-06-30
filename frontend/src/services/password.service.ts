import api from './api'
import { cryptoService } from './crypto.service'

export interface Password {
    id: string
    name: string
    username: string | null
    encryptedPassword: string
    url: string | null
    notes: string | null
    category: string | null
    createdAt: string
    updatedAt: string
}

export interface PasswordForm {
    name: string
    username: string
    password: string
    url: string
    notes: string
    category: string
}

export const passwordService = {
    getAll: async (masterPassword: string): Promise<(Password & { decryptedPassword: string })[]> => {
        const response = await api.get('/passwords')
        return response.data.passwords.map((p: Password) => ({
            ...p,
            decryptedPassword: cryptoService.decrypt(p.encryptedPassword, masterPassword),
        }))
    },

    create: async (form: PasswordForm, masterPassword: string): Promise<Password> => {
        const encryptedPassword = cryptoService.encrypt(form.password, masterPassword)
        const response = await api.post('/passwords', {
            name: form.name,
            username: form.username || null,
            encryptedPassword,
            url: form.url || null,
            notes: form.notes || null,
            category: form.category || null,
        })
        return response.data.password
    },

    update: async (id: string, form: PasswordForm, masterPassword: string): Promise<Password> => {
        const encryptedPassword = cryptoService.encrypt(form.password, masterPassword)
        const response = await api.put(`/passwords/${id}`, {
            name: form.name,
            username: form.username || null,
            encryptedPassword,
            url: form.url || null,
            notes: form.notes || null,
            category: form.category || null,
        })
        return response.data.password
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/passwords/${id}`)
    },
}