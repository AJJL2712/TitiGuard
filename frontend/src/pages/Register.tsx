import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/auth.service'
import FloatingCards from '../components/FloatingCards'

export default function Register() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres')
            return
        }

        setLoading(true)
        try {
            const data = await authService.register(email, password)
            localStorage.setItem('accessToken', data.accessToken)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al registrarse')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
            style={{ backgroundColor: '#0a0a0c', fontFamily: "'Inter', sans-serif" }}
        >
            {/* Aurora de fondo */}
            <div className="absolute inset-0 pointer-events-none">
                <div style={{ position: 'absolute', width: 600, height: 600, top: '-15%', left: '5%', background: 'radial-gradient(circle, rgba(110, 86, 207, 0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                <div style={{ position: 'absolute', width: 500, height: 500, bottom: '-15%', right: '5%', background: 'radial-gradient(circle, rgba(147, 112, 219, 0.25) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            </div>

            <FloatingCards />

            {/* Formulario */}
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

                <h1 className="text-2xl font-bold mb-1" style={{ color: '#f5f5f7', letterSpacing: '-0.02em' }}>
                    Crea tu bóveda
                </h1>
                <p className="text-sm mb-8" style={{ color: '#86868b' }}>
                    Regístrate gratis y empieza a proteger tus contraseñas
                </p>

                {error && (
                    <div className="px-4 py-3 rounded-xl mb-6 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-medium block mb-1.5" style={{ color: '#86868b' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full text-sm rounded-xl px-4 py-3 outline-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5f5f7' }}
                            onFocus={e => e.currentTarget.style.border = '1px solid rgba(110, 86, 207, 0.6)'}
                            onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'}
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium block mb-1.5" style={{ color: '#86868b' }}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full text-sm rounded-xl px-4 py-3 outline-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5f5f7' }}
                            onFocus={e => e.currentTarget.style.border = '1px solid rgba(110, 86, 207, 0.6)'}
                            onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'}
                            placeholder="Mínimo 8 caracteres"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium block mb-1.5" style={{ color: '#86868b' }}>Confirmar contraseña</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full text-sm rounded-xl px-4 py-3 outline-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5f5f7' }}
                            onFocus={e => e.currentTarget.style.border = '1px solid rgba(110, 86, 207, 0.6)'}
                            onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 mt-2"
                        style={{ background: '#6e56cf', color: '#ffffff', boxShadow: '0 0 30px rgba(110, 86, 207, 0.4)' }}
                    >
                        {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
                    </button>
                </form>

                <p className="text-xs text-center mt-6" style={{ color: '#86868b' }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" style={{ color: '#a896e8' }} className="hover:underline">
                        Iniciar sesión
                    </Link>
                </p>
            </div>
        </div>
    )
}