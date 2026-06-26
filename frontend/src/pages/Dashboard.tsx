import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        navigate('/login')
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: '#0a0a0c', fontFamily: "'Inter', sans-serif" }}
        >
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4" style={{ color: '#f5f5f7' }}>
                    🎉 Bienvenido a tu bóveda
                </h1>
                <p className="text-sm mb-8" style={{ color: '#86868b' }}>
                    Aquí irán tus contraseñas guardadas
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => navigate('/settings')}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                        style={{ background: 'rgba(255,255,255,0.06)', color: '#f5f5f7', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        ⚙️ Configuración
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                        style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    )
}