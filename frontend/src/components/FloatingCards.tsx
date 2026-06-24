import { useEffect, useRef, useState } from 'react'

const CARDS_DATA = [
    { title: 'AES-256', subtitle: 'Cifrado activo', icon: '🔒' },
    { title: 'Zero Knowledge', subtitle: 'Tu clave es tuya', icon: '🛡️' },
    { title: '2FA activo', subtitle: 'Google Authenticator', icon: '📱' },
    { title: 'JWT Tokens', subtitle: 'Sesión segura', icon: '✅' },
    { title: 'Bóveda segura', subtitle: 'Tus datos protegidos', icon: '🔐' },
    { title: 'Organizado', subtitle: 'Carpetas y categorías', icon: '📁' },
    { title: 'Auditoría', subtitle: 'Contraseñas seguras', icon: '🔍' },
    { title: 'Rápido', subtitle: 'Acceso instantáneo', icon: '⚡' },
]

type Card = {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    width: number
    height: number
    title: string
    subtitle: string
    icon: string
}

export default function FloatingCards() {
    const [cards, setCards] = useState<Card[]>([])
    const animRef = useRef<number>(0)
    const cardsRef = useRef<Card[]>([])

    useEffect(() => {
        const W = window.innerWidth
        const H = window.innerHeight
        const CARD_W = 180
        const CARD_H = 56

        const initial: Card[] = CARDS_DATA.map((d, i) => ({
            id: i,
            x: Math.random() * (W - CARD_W),
            y: Math.random() * (H - CARD_H),
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            width: CARD_W,
            height: CARD_H,
            ...d,
        }))

        cardsRef.current = initial
        setCards([...initial])

        const animate = () => {
            const W = window.innerWidth
            const H = window.innerHeight

            cardsRef.current = cardsRef.current.map(card => {
                let { x, y, vx, vy } = card

                x += vx
                y += vy

                if (x <= 0) { x = 0; vx = Math.abs(vx) }
                if (x + card.width >= W) { x = W - card.width; vx = -Math.abs(vx) }
                if (y <= 0) { y = 0; vy = Math.abs(vy) }
                if (y + card.height >= H) { y = H - card.height; vy = -Math.abs(vy) }

                return { ...card, x, y, vx, vy }
            })

            // Colisiones entre tarjetas
            for (let i = 0; i < cardsRef.current.length; i++) {
                for (let j = i + 1; j < cardsRef.current.length; j++) {
                    const a = cardsRef.current[i]
                    const b = cardsRef.current[j]

                    const overlapX = a.x + a.width > b.x && a.x < b.x + b.width
                    const overlapY = a.y + a.height > b.y && a.y < b.y + b.height

                    if (overlapX && overlapY) {
                        const tempVx = a.vx
                        const tempVy = a.vy
                        cardsRef.current[i] = { ...a, vx: b.vx, vy: b.vy }
                        cardsRef.current[j] = { ...b, vx: tempVx, vy: tempVy }
                    }
                }
            }

            setCards([...cardsRef.current])
            animRef.current = requestAnimationFrame(animate)
        }

        animRef.current = requestAnimationFrame(animate)

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current)
        }
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden hidden md:block" style={{ zIndex: 1 }}>
            {cards.map(card => (
                <div
                    key={card.id}
                    className="absolute flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{
                        left: card.x,
                        top: card.y,
                        width: card.width,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        willChange: 'transform',
                    }}
                >
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: 'rgba(110, 86, 207, 0.2)' }}
                    >
                        {card.icon}
                    </div>
                    <div>
                        <p className="text-xs font-semibold" style={{ color: '#f5f5f7' }}>{card.title}</p>
                        <p className="text-xs" style={{ color: '#86868b' }}>{card.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}