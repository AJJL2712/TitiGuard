import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface VaultContextType {
    masterPassword: string | null
    setMasterPassword: (password: string) => void
    clearMasterPassword: () => void
}

const VaultContext = createContext<VaultContextType | null>(null)

export function VaultProvider({ children }: { children: ReactNode }) {
    const [masterPassword, setMasterPasswordState] = useState<string | null>(null)

    const setMasterPassword = (password: string) => {
        setMasterPasswordState(password)
    }

    const clearMasterPassword = () => {
        setMasterPasswordState(null)
    }

    return (
        <VaultContext.Provider value={{ masterPassword, setMasterPassword, clearMasterPassword }}>
            {children}
        </VaultContext.Provider>
    )
}

export function useVault() {
    const context = useContext(VaultContext)
    if (!context) throw new Error('useVault must be used within VaultProvider')
    return context
}