import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/auth.service'
import HackerBackground from '../components/HackerBackground'

function useTypewriter(text: string, speed = 30) {
    const [output, setOutput] = useState('')

    useEffect(() => {
        let i = 0
        const interval = setInterval(() => {
            if (i >= text.length) {
                clearInterval(interval)
                return
            }
            setOutput(text.slice(0, i + 1))
            i++
        }, speed)
        return () => clearInterval(interval)
    }, [text, speed])

    return output
}

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const header = useTypewriter('$ titiguard --login')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = await authService.login(email, password)
            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.error || 'access denied: invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen bg-black text-green-400 flex items-center justify-center px-4 relative"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            <HackerBackground />

            <div className="w-full max-w-md border border-green-900/50 rounded-lg bg-black/60 p-6 relative z-10">

                <p className="text-green-500 text-sm mb-1">
                    {header}<span className="animate-pulse">▋</span>
                </p>
                <p className="text-green-700 text-xs mb-6">authenticate to access your vault</p>

                {error && (
                    <div className="border border-red-900/60 text-red-400 text-xs rounded px-3 py-2 mb-4">
                        [ERROR] {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-green-600 text-xs block mb-1">user@email:~$</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-black border border-green-900/60 text-green-300 text-sm rounded px-3 py-2 outline-none focus:border-green-500"
                            placeholder="enter email"
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="text-green-600 text-xs block mb-1">password:~$</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-black border border-green-900/60 text-green-300 text-sm rounded px-3 py-2 outline-none focus:border-green-500"
                            placeholder="enter password"
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full border border-green-500 text-green-400 disabled:opacity-50 rounded py-2 text-sm hover:bg-green-500 hover:text-black transition-colors"
                    >
                        {loading ? '[ AUTHENTICATING... ]' : '[ EXECUTE LOGIN ]'}
                    </button>
                </form>

                <p className="text-green-700 text-xs text-center mt-6">
                    no account?{' '}
                    <Link to="/register" className="text-green-400 hover:text-green-300 underline">
                        run --register
                    </Link>
                </p>

            </div>
        </div>
    )
}