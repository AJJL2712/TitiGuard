import axios from 'axios'

const API_URL = 'http://localhost:3001/api/auth'

export const authService = {
    register: async (email: string, password: string) => {
        const response = await axios.post(`${API_URL}/register`, { email, password })
        return response.data
    },

    login: async (email: string, password: string) => {
        const response = await axios.post(`${API_URL}/login`, { email, password })
        return response.data
    },

    logout: async (refreshToken: string) => {
        const response = await axios.post(`${API_URL}/logout`, { refreshToken })
        return response.data
    }
}