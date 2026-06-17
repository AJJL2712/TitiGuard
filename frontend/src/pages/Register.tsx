import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/auth.service'

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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">TitiGuard</h1>
                    <p className="text-gray-400 mt-1">Crea tu bóveda segura</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg p-3 mb-6 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="text-gray-300 text-sm font-medium block mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label className="text-gray-300 text-sm font-medium block mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="text-gray-300 text-sm font-medium block mb-1">
                            Confirmar contraseña
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg py-3 mt-2 transition-colors"
                    >
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </div>

                <p className="text-gray-400 text-sm text-center mt-6">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300">
                        Inicia sesión
                    </Link>
                </p>

            </div>
        </div>
    )
}