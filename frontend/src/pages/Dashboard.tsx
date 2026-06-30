import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MasterPassword from './MasterPassword'
import { passwordService } from '../services/password.service'
import type { PasswordForm } from '../services/password.service'
import { useVault } from '../context/VaultContext'

type DecryptedPassword = {
    id: string
    name: string
    username: string | null
    decryptedPassword: string
    url: string | null
    notes: string | null
    category: string | null
}

const EMPTY_FORM: PasswordForm = {
    name: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    category: '',
}

export default function Dashboard() {
    const navigate = useNavigate()
    const { masterPassword, setMasterPassword, clearMasterPassword } = useVault()
    const [passwords, setPasswords] = useState<DecryptedPassword[]>([])
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<PasswordForm>(EMPTY_FORM)
    const [error, setError] = useState('')
    const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
    const [search, setSearch] = useState('')
    const [copied, setCopied] = useState<string | null>(null)

    useEffect(() => {
        if (masterPassword && !loaded) {
            loadPasswords(masterPassword)
        }
    }, [masterPassword])

    const loadPasswords = async (mp: string) => {
        setLoading(true)
        try {
            const data = await passwordService.getAll(mp)
            setPasswords(data)
            setLoaded(true)
        } catch {
            setError('Error al cargar las contraseñas')
        } finally {
            setLoading(false)
        }
    }

    const handleUnlock = async (mp: string) => {
        setMasterPassword(mp)
        await loadPasswords(mp)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!masterPassword) return

        try {
            if (editingId) {
                const updated = await passwordService.update(editingId, form, masterPassword)
                setPasswords(prev => prev.map(p =>
                    p.id === editingId ? { ...updated, decryptedPassword: form.password } : p
                ))
            } else {
                const created = await passwordService.create(form, masterPassword)
                setPasswords(prev => [{ ...created, decryptedPassword: form.password }, ...prev])
            }
            setShowForm(false)
            setEditingId(null)
            setForm(EMPTY_FORM)
        } catch {
            setError('Error al guardar la contraseña')
        }
    }

    const handleEdit = (p: DecryptedPassword) => {
        setForm({
            name: p.name,
            username: p.username || '',
            password: p.decryptedPassword,
            url: p.url || '',
            notes: p.notes || '',
            category: p.category || '',
        })
        setEditingId(p.id)
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta contraseña?')) return
        try {
            await passwordService.delete(id)
            setPasswords(prev => prev.filter(p => p.id !== id))
        } catch {
            setError('Error al eliminar')
        }
    }

    const toggleVisible = (id: string) => {
        setVisiblePasswords(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const handleCopy = (id: string, text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        clearMasterPassword()
        navigate('/login')
    }

    const filtered = passwords.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.username?.toLowerCase().includes(search.toLowerCase()) ||
        p.url?.toLowerCase().includes(search.toLowerCase())
    )

    if (!masterPassword) {
        return <MasterPassword onUnlock={handleUnlock} />
    }

    return (
        <div
            className="min-h-screen px-6 py-8 relative"
            style={{ backgroundColor: '#0a0a0c', fontFamily: "'Inter', sans-serif" }}
        >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div style={{ position: 'absolute', width: 500, height: 500, top: '-10%', right: '0%', background: 'radial-gradient(circle, rgba(110, 86, 207, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z" stroke="#a896e8" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M9 12L11 14L15 10" stroke="#a896e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-semibold text-base" style={{ color: '#f5f5f7' }}>TitiGuard</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/settings')}
                            className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                            style={{ color: '#86868b', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            ⚙️ Configuración
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>

                {/* Búsqueda + agregar */}
                <div className="flex gap-3 mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 text-sm rounded-xl px-4 py-3 outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#f5f5f7' }}
                        onFocus={e => e.currentTarget.style.border = '1px solid rgba(110, 86, 207, 0.5)'}
                        onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'}
                        placeholder="Buscar contraseñas..."
                    />
                    <button
                        onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM) }}
                        className="px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: '#6e56cf', color: '#ffffff' }}
                    >
                        + Agregar
                    </button>
                </div>

                {error && (
                    <div className="px-4 py-3 rounded-xl mb-4 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                        {error}
                    </div>
                )}

                {/* Formulario */}
                {showForm && (
                    <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
                        <h2 className="text-base font-semibold mb-4" style={{ color: '#f5f5f7' }}>
                            {editingId ? 'Editar contraseña' : 'Nueva contraseña'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { key: 'name', label: 'Nombre *', placeholder: 'Ej: Gmail', type: 'text' },
                                { key: 'username', label: 'Usuario / Email', placeholder: 'tu@email.com', type: 'text' },
                                { key: 'password', label: 'Contraseña *', placeholder: '••••••••', type: 'password' },
                                { key: 'url', label: 'URL', placeholder: 'https://gmail.com', type: 'text' },
                                { key: 'category', label: 'Categoría', placeholder: 'Ej: Redes sociales', type: 'text' },
                                { key: 'notes', label: 'Notas', placeholder: 'Notas opcionales', type: 'text' },
                            ].map(field => (
                                <div key={field.key}>
                                    <label className="text-xs font-medium block mb-1.5" style={{ color: '#86868b' }}>{field.label}</label>
                                    <input
                                        type={field.type}
                                        value={form[field.key as keyof PasswordForm]}
                                        onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                                        className="w-full text-sm rounded-xl px-4 py-3 outline-none"
                                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5f5f7' }}
                                        onFocus={e => e.currentTarget.style.border = '1px solid rgba(110, 86, 207, 0.6)'}
                                        onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'}
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}

                            <div className="md:col-span-2 flex gap-3 justify-end mt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM) }}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium"
                                    style={{ background: 'rgba(255,255,255,0.06)', color: '#f5f5f7', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                                    style={{ background: '#6e56cf', color: '#ffffff' }}
                                >
                                    {editingId ? 'Guardar cambios' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Lista */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: '#6e56cf', borderTopColor: 'transparent' }} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-4">🔐</p>
                        <p className="text-sm" style={{ color: '#86868b' }}>
                            {search ? 'No se encontraron resultados' : 'Tu bóveda está vacía — agrega tu primera contraseña'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(p => (
                            <div
                                key={p.id}
                                className="p-4 rounded-2xl"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0"
                                        style={{ background: 'rgba(110, 86, 207, 0.15)', color: '#a896e8' }}
                                    >
                                        {p.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate" style={{ color: '#f5f5f7' }}>{p.name}</p>
                                        <p className="text-xs truncate" style={{ color: '#86868b' }}>{p.username || p.url || 'Sin usuario'}</p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => toggleVisible(p.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                                            title={visiblePasswords.has(p.id) ? 'Ocultar' : 'Mostrar'}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                {visiblePasswords.has(p.id)
                                                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" /></>
                                                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#86868b" strokeWidth="1.5" /><circle cx="12" cy="12" r="3" stroke="#86868b" strokeWidth="1.5" /></>
                                                }
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleCopy(p.id, p.decryptedPassword)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                                            title="Copiar contraseña"
                                        >
                                            {copied === p.id
                                                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="#86868b" strokeWidth="1.5" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="#86868b" strokeWidth="1.5" /></svg>
                                            }
                                        </button>
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                                            title="Editar"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                                            title="Eliminar"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                <polyline points="3,6 5,6 21,6" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M10 11v6M14 11v6" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {visiblePasswords.has(p.id) && (
                                    <div className="mt-3 pt-3 grid grid-cols-2 gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                        {p.username && (
                                            <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                <p className="text-xs mb-1" style={{ color: '#86868b' }}>Usuario</p>
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-xs font-mono truncate" style={{ color: '#f5f5f7' }}>{p.username}</p>
                                                    <button onClick={() => handleCopy(`user-${p.id}`, p.username!)}>
                                                        {copied === `user-${p.id}`
                                                            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                            : <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="#86868b" strokeWidth="1.5" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="#86868b" strokeWidth="1.5" /></svg>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                            <p className="text-xs mb-1" style={{ color: '#86868b' }}>Contraseña</p>
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-mono truncate" style={{ color: '#f5f5f7' }}>{p.decryptedPassword}</p>
                                                <button onClick={() => handleCopy(p.id, p.decryptedPassword)}>
                                                    {copied === p.id
                                                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                        : <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="#86868b" strokeWidth="1.5" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="#86868b" strokeWidth="1.5" /></svg>
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                        {p.url && (
                                            <div
                                                className="p-2 rounded-lg col-span-2"
                                                style={{ background: 'rgba(255,255,255,0.03)' }}
                                            >
                                                <p className="text-xs mb-1" style={{ color: '#86868b' }}>
                                                    URL
                                                </p>

                                                <a
                                                    href={p.url?.startsWith('http') ? p.url : `https://${p.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs truncate block hover:underline"
                                                    style={{ color: '#a890e8' }}
                                                >
                                                    {p.url}
                                                </a>
                                            </div>
                                        )}
                                        {p.notes && (
                                            <div className="p-2 rounded-lg col-span-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                <p className="text-xs mb-1" style={{ color: '#86868b' }}>Notas</p>
                                                <p className="text-xs" style={{ color: '#f5f5f7' }}>{p.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    )}
            </div>
        </div>
    )
}