import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import type { ReactNode } from 'react'
import { useActiveSection } from '../hooks/useActiveSection'
import { SectionBackground } from '../components/SectionBackground'
import { useState } from 'react'

function Header() {
    const navigate = useNavigate()

    return (
        <header
            className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-4"
            style={{
                background: 'rgba(10, 10, 12, 0.7)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
        >
            <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z" stroke="#a896e8" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M9 12L11 14L15 10" stroke="#a896e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-semibold text-base" style={{ color: '#f5f5f7' }}>TitiGuard</span>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/login')}
                    className="text-sm font-medium px-4 py-2 rounded-xl transition-colors hover:bg-white/5"
                    style={{ color: '#f5f5f7' }}
                >
                    Iniciar sesión
                </button>
                <button
                    onClick={() => navigate('/register')}
                    className="text-sm font-medium px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
                    style={{ background: '#6e56cf', color: '#ffffff' }}
                >
                    Crear cuenta
                </button>
            </div>
        </header>
    )
}

function Hero() {
    const navigate = useNavigate()

    return (
        <section className="w-full h-full flex flex-col items-center justify-center text-center px-6 relative z-10">
      <span
          className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-6"
          style={{
              background: 'rgba(110, 86, 207, 0.15)',
              color: '#a896e8',
              border: '1px solid rgba(110, 86, 207, 0.3)',
          }}
      >
        Proyecto · v1.0
      </span>

            <h1
                className="text-6xl md:text-7xl font-bold mb-6 max-w-3xl"
                style={{ color: '#f5f5f7', letterSpacing: '-0.03em', lineHeight: 1.05 }}
            >
                Tu bóveda de contraseñas,<br />sin compromisos.
            </h1>

            <p className="text-xl mb-10 leading-relaxed max-w-xl" style={{ color: '#86868b' }}>
                Cifrado AES-256 de extremo a extremo, autenticación en dos factores
                y control total sobre tus credenciales. Tu contraseña maestra nunca
                sale de tu navegador.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    onClick={() => navigate('/register')}
                    className="px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:opacity-90 hover:scale-105"
                    style={{
                        background: '#6e56cf',
                        color: '#ffffff',
                        boxShadow: '0 0 30px rgba(110, 86, 207, 0.4)',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(110, 86, 207, 0.7)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(110, 86, 207, 0.4)')}
                >
                    Crear cuenta gratis
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 rounded-2xl font-semibold text-base"
                    style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#f5f5f7',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                        e.currentTarget.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                        e.currentTarget.style.transform = 'scale(1)'
                    }}
                >
                    Ya tengo cuenta
                </button>
            </div>
        </section>
    )
}

function GlowCard({ children, glowColor = '#6e56cf' }: { children: React.ReactNode; glowColor?: string }) {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            className="p-6 rounded-2xl cursor-default"
            style={{
                background: hovered ? `rgba(110, 86, 207, 0.08)` : 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(20px)',
                border: hovered ? `1px solid ${glowColor}44` : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: hovered ? `0 0 40px ${glowColor}22` : 'none',
                transform: hovered ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.3s ease',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
    const { ref, isVisible } = useScrollReveal()

    return (
        <div ref={ref} className={`reveal ${isVisible ? 'visible' : ''}`}>
            <GlowCard>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(110, 86, 207, 0.15)' }}>
                    {icon}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#f5f5f7' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#86868b' }}>{description}</p>
            </GlowCard>
        </div>
    )
}

function Features() {
    const { ref, isVisible } = useScrollReveal()

    const features = [
        {
            title: 'Cifrado AES-256',
            description: 'Tus contraseñas se cifran en el navegador antes de salir de tu equipo. Ni el servidor las ve en texto plano.',
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#a896e8" strokeWidth="1.5" /><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#a896e8" strokeWidth="1.5" /></svg>,
        },
        {
            title: 'Autenticación 2FA',
            description: 'Capa extra de seguridad con códigos TOTP, compatible con Google Authenticator y apps similares.',
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="18" rx="2" stroke="#a896e8" strokeWidth="1.5" /><circle cx="12" cy="17" r="1" fill="#a896e8" /></svg>,
        },
        {
            title: 'Organización inteligente',
            description: 'Carpetas, categorías y búsqueda instantánea para encontrar cualquier credencial en segundos.',
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 7h6l2 2h10v10H3V7Z" stroke="#a896e8" strokeWidth="1.5" strokeLinejoin="round" /></svg>,
        },
        {
            title: 'Auditoría de seguridad',
            description: 'Detecta automáticamente contraseñas débiles, repetidas o desactualizadas en tu bóveda.',
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z" stroke="#a896e8" strokeWidth="1.5" strokeLinejoin="round" /><path d="M9 12L11 14L15 10" stroke="#a896e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
        },
    ]

    return (
        <section className="w-full h-full flex flex-col items-center justify-center px-6 md:px-12 relative z-10">
            <div ref={ref} className={`reveal ${isVisible ? 'visible' : ''} text-center mb-10 w-full max-w-5xl`}>
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#f5f5f7', letterSpacing: '-0.02em' }}>
                    Seguridad sin fricción
                </h2>
                <p className="text-lg max-w-lg mx-auto" style={{ color: '#86868b' }}>
                    Todo lo necesario para proteger tus credenciales, en un solo lugar.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-5xl">
                {features.map((f, i) => (
                    <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} />
                ))}
            </div>
        </section>
    )
}

function TechCard({ name, role, color }: { name: string; role: string; color: string }) {
    const { ref, isVisible } = useScrollReveal()
    const [hovered, setHovered] = useState(false)

    return (
        <div
            ref={ref}
            className={`reveal ${isVisible ? 'visible' : ''} p-5 rounded-2xl flex items-center gap-4 cursor-default`}
            style={{
                background: hovered ? `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, 0.08)` : 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(20px)',
                border: hovered ? `1px solid ${color}44` : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: hovered ? `0 0 30px ${color}22` : 'none',
                transform: hovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'all 0.3s ease',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0"
                style={{
                    background: `${color}22`,
                    color,
                    boxShadow: hovered ? `0 0 20px ${color}44` : 'none',
                    transition: 'all 0.3s ease',
                }}
            >
                {name.charAt(0)}
            </div>
            <div>
                <p className="text-sm font-semibold" style={{ color: '#f5f5f7' }}>{name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#86868b' }}>{role}</p>
            </div>
        </div>
    )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <GlowCard>
            <div className="flex gap-4 items-start">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0"
                    style={{ background: 'rgba(110, 86, 207, 0.15)', color: '#a896e8' }}
                >
                    {number}
                </div>
                <div>
                    <h3 className="text-base font-semibold mb-1" style={{ color: '#f5f5f7' }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#86868b' }}>{description}</p>
                </div>
            </div>
        </GlowCard>
    )
}

function TechStack() {
    const { ref, isVisible } = useScrollReveal()

    const stack = [
        { name: 'React 18', role: 'Interfaz reactiva y componentes reutilizables con hooks modernos', color: '#61dafb' },
        { name: 'TypeScript', role: 'Tipado estático que previene errores en tiempo de compilación', color: '#3178c6' },
        { name: 'Node.js', role: 'Runtime de JavaScript del lado del servidor, veloz y escalable', color: '#83cd29' },
        { name: 'Express', role: 'Framework minimalista para construir APIs REST robustas', color: '#a896e8' },
        { name: 'PostgreSQL', role: 'Base de datos relacional alojada en Neon.tech con SSL', color: '#336791' },
        { name: 'Prisma', role: 'ORM type-safe que genera queries seguros desde el schema', color: '#5a67d8' },
        { name: 'JWT', role: 'Tokens firmados para autenticación sin estado en el servidor', color: '#fb015b' },
        { name: 'AES-256', role: 'Cifrado simétrico estándar militar para proteger credenciales', color: '#f5a623' },
        { name: 'bcrypt', role: 'Hashing seguro de contraseñas con salt aleatorio', color: '#68d391' },
        { name: 'Tailwind CSS', role: 'Framework de utilidades CSS para diseño rápido y consistente', color: '#38bdf8' },
        { name: 'Vite', role: 'Bundler ultrarrápido con hot-reload instantáneo en desarrollo', color: '#646cff' },
        { name: 'speakeasy', role: 'Generación y verificación de códigos TOTP para el 2FA', color: '#f6ad55' },
    ]

    return (
        <section className="w-full h-full flex flex-col items-center justify-center px-6 md:px-12 relative z-10">
            <div ref={ref} className={`reveal ${isVisible ? 'visible' : ''} text-center mb-10 w-full max-w-6xl`}>
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#f5f5f7', letterSpacing: '-0.02em' }}>
                    Construido con tecnología real
                </h2>
                <p className="text-lg max-w-lg mx-auto" style={{ color: '#86868b' }}>
                    Un stack moderno, robusto y completamente open source.
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
                {stack.map((tech, i) => (
                    <TechCard key={i} name={tech.name} role={tech.role} color={tech.color} />
                ))}
            </div>
        </section>
    )
}

function HowItWorks() {
    const { ref, isVisible } = useScrollReveal()

    const steps = [
        { title: 'Crea tu cuenta', description: 'Regístrate con tu email. Tu contraseña maestra nunca se envía al servidor — solo tú la conoces.' },
        { title: 'Activa el 2FA', description: 'Escanea el código QR con Google Authenticator para agregar una capa extra de protección a tu bóveda.' },
        { title: 'Guarda tus credenciales', description: 'Cada contraseña se cifra con AES-256 en tu navegador antes de enviarse. El servidor solo recibe datos cifrados.' },
        { title: 'Organiza tu bóveda', description: 'Crea carpetas y categorías para mantener tus credenciales ordenadas y fáciles de encontrar.' },
        { title: 'Genera contraseñas seguras', description: 'Usa el generador integrado para crear contraseñas fuertes y únicas para cada sitio.' },
        { title: 'Audita tu seguridad', description: 'Detecta automáticamente contraseñas débiles, repetidas o que llevan mucho tiempo sin actualizarse.' },
    ]

    return (
        <section className="w-full h-full flex flex-col items-center justify-center px-6 relative z-10">
            <div ref={ref} className={`reveal ${isVisible ? 'visible' : ''} w-full max-w-5xl`}>
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#f5f5f7', letterSpacing: '-0.02em' }}>
                        Cómo funciona
                    </h2>
                    <p className="text-lg" style={{ color: '#86868b' }}>Seis pasos para tener tus contraseñas completamente protegidas.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {steps.map((s, i) => (
                        <StepCard key={i} number={String(i + 1).padStart(2, '0')} title={s.title} description={s.description} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function SecuritySection() {
    const { ref, isVisible } = useScrollReveal()

    const items = [
        { title: 'Zero-knowledge architecture', description: 'El servidor nunca recibe tu contraseña maestra ni tus credenciales en texto plano. El cifrado ocurre 100% en tu navegador.' },
        { title: 'AES-256-GCM client-side', description: 'Usamos el estándar de cifrado simétrico más robusto disponible, con claves derivadas localmente desde tu contraseña maestra.' },
        { title: 'JWT + Refresh Token rotation', description: 'Access tokens de vida corta (15 min) combinados con refresh tokens de 7 días, renovados automáticamente sin interrumpir tu sesión.' },
        { title: 'TOTP 2FA compatible', description: 'Códigos de un solo uso basados en tiempo (RFC 6238), compatibles con Google Authenticator, Authy y cualquier app TOTP estándar.' },
        { title: 'bcrypt password hashing', description: 'Las contraseñas de acceso se hashean con bcrypt antes de guardarse. Nunca se almacenan en texto plano en la base de datos.' },
        { title: 'Rate limiting', description: 'Protección contra ataques de fuerza bruta con límites de peticiones por IP en todos los endpoints de autenticación.' },
    ]

    return (
        <section className="w-full h-full flex flex-col items-center justify-center px-6 relative z-10">
            <div ref={ref} className={`reveal ${isVisible ? 'visible' : ''} w-full max-w-5xl`}>
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#f5f5f7', letterSpacing: '-0.02em' }}>
                        Seguridad técnica real
                    </h2>
                    <p className="text-lg" style={{ color: '#86868b' }}>No es marketing — así funciona el cifrado bajo el capó.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {items.map((item, i) => (
                        <GlowCard key={i}>
                            <p className="text-sm font-semibold mb-2" style={{ color: '#a896e8' }}>{item.title}</p>
                            <p className="text-sm leading-relaxed" style={{ color: '#86868b' }}>{item.description}</p>
                        </GlowCard>
                    ))}
                </div>
            </div>
        </section>
    )
}

function ComparisonSection() {
    const { ref, isVisible } = useScrollReveal()

    const rows = [
        { feature: 'Cifrado de extremo a extremo', titiGuard: true, browser: false },
        { feature: 'Autenticación 2FA', titiGuard: true, browser: false },
        { feature: 'Contraseña maestra privada', titiGuard: true, browser: false },
        { feature: 'Auditoría de seguridad', titiGuard: true, browser: false },
        { feature: 'Acceso multi-dispositivo', titiGuard: true, browser: true },
        { feature: 'Generador de contraseñas', titiGuard: true, browser: true },
    ]

    const Check = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="rgba(110, 86, 207, 0.2)" />
            <path d="M8 12L11 15L16 9" stroke="#a896e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )

    const Cross = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.04)" />
            <path d="M9 9L15 15M15 9L9 15" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )

    return (
        <section className="w-full h-full flex flex-col items-center justify-center px-6 relative z-10">
            <div ref={ref} className={`reveal ${isVisible ? 'visible' : ''} w-full max-w-3xl`}>
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#f5f5f7', letterSpacing: '-0.02em' }}>
                        ¿Por qué no el navegador?
                    </h2>
                    <p className="text-lg" style={{ color: '#86868b' }}>Tu navegador guarda contraseñas. TitiGuard las protege.</p>
                </div>
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="grid grid-cols-3 px-6 py-3 text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.04)', color: '#86868b' }}>
                        <span>Característica</span>
                        <span className="text-center" style={{ color: '#a896e8' }}>TitiGuard</span>
                        <span className="text-center">Navegador</span>
                    </div>
                    {rows.map((row, i) => (
                        <div key={i} className="grid grid-cols-3 px-6 py-4 items-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', color: '#86868b' }}>
                            <span>{row.feature}</span>
                            <span className="flex justify-center">{row.titiGuard ? <Check /> : <Cross />}</span>
                            <span className="flex justify-center">{row.browser ? <Check /> : <Cross />}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function Footer() {
    const { ref, isVisible } = useScrollReveal()

    return (
        <section className="w-full h-full flex flex-col items-center justify-center px-6 relative z-10">
            <div ref={ref} className={`reveal ${isVisible ? 'visible' : ''} w-full max-w-4xl text-center`}>
                <div className="flex items-center justify-center gap-2 mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z" stroke="#a896e8" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M9 12L11 14L15 10" stroke="#a896e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-semibold text-base" style={{ color: '#f5f5f7' }}>TitiGuard</span>
                </div>

                <p className="text-sm mb-6" style={{ color: '#86868b' }}>
                    Proyecto académico full-stack · Desarrollado con React, Node.js, PostgreSQL y cifrado AES-256.
                </p>

                <div className="flex items-center justify-center gap-6 mb-8">
                    <a href="https://github.com/AJJL2712/TitiGuard" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-white" style={{ color: '#86868b' }}>
                        GitHub
                    </a>
                    <span style={{ color: '#333' }}>·</span>
                    <span className="text-sm" style={{ color: '#86868b' }}>v1.0.0</span>
                    <span style={{ color: '#333' }}>·</span>
                    <span className="text-sm" style={{ color: '#86868b' }}>2026</span>
                </div>

                <div className="w-full h-px mb-6" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <p className="text-xs" style={{ color: '#444' }}>
                    Construido para aprender · No almacena datos en producción
                </p>
            </div>
        </section>
    )
}

const SECTION_BACKGROUNDS = [
    '#0a0a0c',
    '#0d0a14',
    '#0a0c14',
    '#0c0a14',
    '#0a0c10',
    '#0a0a0c',
    '#0a0a0c',
]

export default function BootScreen() {
    const { activeIndex, setRef } = useActiveSection(7)

    return (
        <div
            style={{
                fontFamily: "'Inter', sans-serif",
                backgroundColor: SECTION_BACKGROUNDS[activeIndex],
                transition: 'background-color 0.6s ease',
            }}
        >
            <Header />

            <div className="snap-container">
                <div ref={setRef(0)} className="snap-section relative">
                    <SectionBackground variant={0} />
                    <Hero />
                </div>
                <div ref={setRef(1)} className="snap-section relative">
                    <SectionBackground variant={1} />
                    <Features />
                </div>
                <div ref={setRef(2)} className="snap-section relative">
                    <SectionBackground variant={2} />
                    <TechStack />
                </div>
                <div ref={setRef(3)} className="snap-section relative">
                    <SectionBackground variant={3} />
                    <HowItWorks />
                </div>
                <div ref={setRef(4)} className="snap-section relative">
                    <SectionBackground variant={4} />
                    <SecuritySection />
                </div>
                <div ref={setRef(5)} className="snap-section relative">
                    <SectionBackground variant={5} />
                    <ComparisonSection />
                </div>
                <div ref={setRef(6)} className="snap-section relative">
                    <SectionBackground variant={6} />
                    <Footer />
                </div>
            </div>
        </div>
    )
}