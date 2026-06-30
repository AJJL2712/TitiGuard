import { useState } from 'react'
import { cryptoService } from '../services/crypto.service'

interface Props {
    onUnlock: (masterPassword: string) => void
}

function getUserIdFromToken(): string {
    try {
        const token = localStorage.getItem('accessToken')
        if (!token) return ''
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.userId || ''
    } catch {
        return ''
    }
}

export default function MasterPassword({ onUnlock }: Props) {
    const [masterPassword, setMasterPassword] = useState('')
    const [error, setError] = useState('')
    const userId = getUserIdFromToken()
    const isFirstTime = !cryptoService.hasVerification(userId)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (masterPassword.length < 8) {
            setError('La contraseña maestra debe tener al menos 8 caracteres')
            return
        }

        if (!cryptoService.verifyMasterPassword(masterPassword, userId)) {
            setError('Contraseña maestra incorrecta')
            return
        }

        if (isFirstTime) {
            cryptoService.saveVerification(masterPassword, userId)
        }

        onUnlock(masterPassword)
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
            style={{ backgroundColor: '#0a0a0c', fontFamily: "'Inter', sans-serif" }}
        >
            <div className="absolute inset-0 pointer-events-none">
                <div style={{ position: 'absolute', width: 600, height: 600, top: '-15%', left: '5%', background: 'radial-gradient(circle, rgba(110, 86, 207, 0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                <div style={{ position: 'absolute', width: 500, height: 500, bottom: '-15%', right: '5%', background: 'radial-gradient(circle, rgba(147, 112, 219, 0.25) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            </div>

            <div
                className="relative z-10 w-full max-w-md p-8 rounded-3xl"
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                }}
            >
                <div className="flex items-center gap-2 mb-8">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z" stroke="#a896e8" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M9 12L11 14L15 10" stroke="#a896e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-semibold text-base" style={{ color: '#f5f5f7' }}>TitiGuard</span>
                </div>

                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto" style={{ background: 'rgba(110, 86, 207, 0.15)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <rect x="5" y="11" width="14" height="9" rx="2" stroke="#a896e8" strokeWidth="1.5" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#a896e8" strokeWidth="1.5" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold mb-1 text-center" style={{ color: '#f5f5f7', letterSpacing: '-0.02em' }}>
                    {isFirstTime ? 'Crea tu contraseña maestra' : 'Desbloquea tu bóveda'}
                </h1>
                <p className="text-sm mb-8 text-center" style={{ color: '#86868b' }}>
                    {isFirstTime
                        ? 'Esta contraseña cifra todos tus datos. Nunca la guardamos — si la olvidas, pierdes acceso a tu bóveda.'
                        : 'Ingresa tu contraseña maestra para acceder a tus contraseñas.'
                    }
                </p>

                {error && (
                    <div className="px-4 py-3 rounded-xl mb-6 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-medium block mb-1.5" style={{ color: '#86868b' }}>
                            Contraseña maestra
                        </label>
                        <input
                            type="password"
                            value={masterPassword}
                            onChange={e => setMasterPassword(e.target.value)}
                            className="w-full text-sm rounded-xl px-4 py-3 outline-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5f5f7' }}
                            onFocus={e => e.currentTarget.style.border = '1px solid rgba(110, 86, 207, 0.6)'}
                            onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'}
                            placeholder={isFirstTime ? 'Crea una contraseña maestra' : 'Tu contraseña maestra'}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={masterPassword.length < 8}
                        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 mt-2"
                        style={{ background: '#6e56cf', color: '#ffffff', boxShadow: '0 0 30px rgba(110, 86, 207, 0.4)' }}
                    >
                        {isFirstTime ? 'Crear bóveda' : 'Desbloquear bóveda'}
                    </button>
                </form>

                <p className="text-xs text-center mt-6" style={{ color: '#86868b' }}>
                    ⚠️ Si olvidas esta contraseña, no podrás recuperar tus datos.
                </p>
            </div>
        </div>
    )
}