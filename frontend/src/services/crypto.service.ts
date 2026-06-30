import CryptoJS from 'crypto-js'

const VERIFICATION_TEXT = 'titiguard_valid'

const getVerificationKey = (userId: string) => `vault_verification_${userId}`

export const cryptoService = {
    encrypt: (text: string, masterPassword: string): string => {
        return CryptoJS.AES.encrypt(text, masterPassword).toString()
    },

    decrypt: (encryptedText: string, masterPassword: string): string => {
        const bytes = CryptoJS.AES.decrypt(encryptedText, masterPassword)
        return bytes.toString(CryptoJS.enc.Utf8)
    },

    saveVerification: (masterPassword: string, userId: string): void => {
        const encrypted = CryptoJS.AES.encrypt(VERIFICATION_TEXT, masterPassword).toString()
        localStorage.setItem(getVerificationKey(userId), encrypted)
    },

    verifyMasterPassword: (masterPassword: string, userId: string): boolean => {
        const stored = localStorage.getItem(getVerificationKey(userId))
        if (!stored) return true

        try {
            const bytes = CryptoJS.AES.decrypt(stored, masterPassword)
            const decrypted = bytes.toString(CryptoJS.enc.Utf8)
            return decrypted === VERIFICATION_TEXT
        } catch {
            return false
        }
    },

    hasVerification: (userId: string): boolean => {
        return localStorage.getItem(getVerificationKey(userId)) !== null
    },
}