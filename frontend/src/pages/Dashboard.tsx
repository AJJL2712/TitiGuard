import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-4">
                    🎉 Bienvenido a tu bóveda
                </h1>
                <p className="text-gray-400 mb-6">
                    Aquí irán tus contraseñas guardadas
                </p>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    )
}