import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Settings() {
    const navigate = useNavigate()
    const [user, setUser] = useState<{ email: string; twoFactorEnabled: boolean } | null>(null)
    const [loading, setLoading] = useState(true)
    const [qrCode, setQrCode] = useState('')
    const [secret, setSecret] = useState('')
    const [code, setCode] = useState('')
    const [step, setStep] = useState<'idle' | 'scanning' | 'confirming'>('idle')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [verifying, setVerifying] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await api.get('/auth/profile')
            setUser(response.data.user)
        } catch {
            navigate('/login')
        } finally {
            setLoading(false)
        }
    }

    const handleGenerate2FA = async () => {
        try {
            setError('')
            const response = await api.post('/auth/2fa/generate')
            setQrCode(response.data.qrCode)
            setSecret(response.data.secret)
            setStep('scanning')
        } catch {
            setError('Error al generar el QR')
        }
    }

    const handleVerify2FA = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setVerifying(true)
        try {
            await api.post('/auth/2fa/verify', { code })
            setSuccess('2FA activado correctamente')
            setStep('idle')
            setCode('')
            fetchProfile()
        } catch (err: any) {
            setError(err.response?.data?.error || 'Código inválido')
        } finally {
            setVerifying(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0c' }}>
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#6e56cf', borderTopColor: 'transparent' }} />
            </div>
        )
    }

    return (
        <div
            className="min-h-screen px-6 py-8 relative"
            style={{ backgroundColor: '#0a0a0c', fontFamily: "'Inter', sans-serif" }}
        >
            {/* Fondo aurora */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div style={{ position: 'absolute', width: 500, height: 500, top: '-10%', right: '10%', background: 'radial-gradient(circle, rgba(110, 86, 207, 0.2) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#f5f5f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#f5f5f7', letterSpacing: '-0.02em' }}>Configuración</h1>
                        <p className="text-sm" style={{ color: '#86868b' }}>{user?.email}</p>
                    </div>
                </div>

                {success && (
                    <div className="px-4 py-3 rounded-xl mb-6 text-sm" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#86efac' }}>
                        {success}
                    </div>
                )}

                {error && (
                    <div className="px-4 py-3 rounded-xl mb-6 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                        {error}
                    </div>
                )}

                {/* Sección 2FA */}
                <div
                    className="p-6 rounded-2xl mb-4"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(110, 86, 207, 0.15)' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <rect x="6" y="3" width="12" height="18" rx="2" stroke="#a896e8" strokeWidth="1.5" />
                                    <circle cx="12" cy="17" r="1" fill="#a896e8" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold" style={{ color: '#f5f5f7' }}>Autenticación en dos pasos</p>
                                <p className="text-xs" style={{ color: '#86868b' }}>Protege tu cuenta con Google Authenticator</p>
                            </div>
                        </div>
                        <span
                            className="text-xs font-medium px-3 py-1 rounded-full"
                            style={{
                                background: user?.twoFactorEnabled ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.06)',
                                color: user?.twoFactorEnabled ? '#86efac' : '#86868b',
                                border: user?.twoFactorEnabled ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
              {user?.twoFactorEnabled ? 'Activo' : 'Inactivo'}
            </span>
                    </div>

                    {!user?.twoFactorEnabled && step === 'idle' && (
                        <button
                            onClick={handleGenerate2FA}
                            className="mt-4 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                            style={{ background: '#6e56cf', color: '#ffffff' }}
                        >
                            Activar 2FA
                        </button>
                    )}

                    {step === 'scanning' && (
                        <div className="mt-6">
                            <p className="text-sm mb-4" style={{ color: '#86868b' }}>
                                Escanea este código QR con Google Authenticator:
                            </p>
                            <div className="flex justify-center mb-4">
                                <img src={qrCode} alt="QR Code" className="w-48 h-48 rounded-xl" />
                            </div>
                            <p className="text-xs text-center mb-2" style={{ color: '#86868b' }}>
                                O ingresa el código manualmente:
                            </p>
                            <p
                                className="text-xs text-center font-mono mb-6 px-3 py-2 rounded-lg"
                                style={{ background: 'rgba(255,255,255,0.04)', color: '#a896e8', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                                {secret}
                            </p>

                            <button
                                onClick={() => setStep('confirming')}
                                className="w-full py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                                style={{ background: '#6e56cf', color: '#ffffff' }}
                            >
                                Ya escaneé el código →
                            </button>
                        </div>
                    )}

                    {step === 'confirming' && (
                        <form onSubmit={handleVerify2FA} className="mt-6">
                            <p className="text-sm mb-4" style={{ color: '#86868b' }}>
                                Ingresa el código de 6 dígitos de Google Authenticator para confirmar:
                            </p>
                            <input
                                type="text"
                                value={code}
                                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full text-sm rounded-xl px-4 py-3 outline-none text-center tracking-widest text-lg mb-4"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5f5f7' }}
                                onFocus={e => e.currentTarget.style.border = '1px solid rgba(110, 86, 207, 0.6)'}
                                onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'}
                                placeholder="000000"
                                maxLength={6}
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep('scanning')}
                                    className="flex-1 py-3 rounded-xl text-sm font-medium"
                                    style={{ background: 'rgba(255,255,255,0.06)', color: '#f5f5f7', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    ← Volver
                                </button>
                                <button
                                    type="submit"
                                    disabled={verifying || code.length !== 6}
                                    className="flex-1 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
                                    style={{ background: '#6e56cf', color: '#ffffff' }}
                                >
                                    {verifying ? 'Verificando...' : 'Confirmar'}
                                </button>
                            </div>
                        </form>
                    )}

                    {user?.twoFactorEnabled && (
                        <p className="text-xs mt-4" style={{ color: '#86868b' }}>
                            Tu cuenta está protegida con autenticación en dos pasos. Cada vez que inicies sesión necesitarás el código de Google Authenticator.
                        </p>
                    )}
                </div>

            </div>
        </div>
    )
}