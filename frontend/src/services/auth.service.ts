import api from './api'

const API_URL = '/auth'

export const authService = {
    register: async (email: string, password: string) => {
        const response = await api.post(`${API_URL}/register`, { email, password })
        return response.data
    },

    login: async (email: string, password: string) => {
        const deviceToken = localStorage.getItem('deviceToken')
        const response = await api.post(`${API_URL}/login`, { email, password, deviceToken })
        return response.data
    },

    logout: async (refreshToken: string) => {
        const response = await api.post(`${API_URL}/logout`, { refreshToken })
        return response.data
    },

    validate2FA: async (userId: string, code: string) => {
        const response = await api.post(`${API_URL}/2fa/validate`, { userId, code })
        if (response.data.deviceToken) {
            localStorage.setItem('deviceToken', response.data.deviceToken)
        }
        return response.data
    },
}