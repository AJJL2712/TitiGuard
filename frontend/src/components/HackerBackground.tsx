import { useEffect, useRef, useState } from 'react'

const MATRIX_CHARS = '01アイウエオカキクケコサシスセソ$#%&'

function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const fontSize = 14
        const columns = Math.floor(canvas.width / fontSize)
        const drops = new Array(columns).fill(1)

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.fillStyle = 'rgba(34, 197, 94, 0.5)'
            ctx.font = `${fontSize}px monospace`

            for (let i = 0; i < drops.length; i++) {
                const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
                ctx.fillText(char, i * fontSize, drops[i] * fontSize)

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }
                drops[i]++
            }
        }

        const interval = setInterval(draw, 50)

        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-30"
        />
    )
}

const TERMINAL_SCRIPTS = [
    {
        title: 'port_scan.exe',
        lines: [
            '$ nmap -sS target_host',
            'scanning 1000 ports...',
            'port 22/tcp   open  ssh',
            'port 443/tcp  open  https',
            'scan complete: 2 open',
        ],
    },
    {
        title: 'decrypt.sh',
        lines: [
            '$ ./decrypt --aes256',
            'loading key fragments...',
            'fragment 1/3 ok',
            'fragment 2/3 ok',
            'fragment 3/3 ok',
            'decryption successful',
        ],
    },
    {
        title: 'inject.py',
        lines: [
            '$ python3 inject.py',
            'connecting to socket...',
            'handshake established',
            'payload sent (2.4kb)',
            'awaiting response...',
            'ack received',
        ],
    },
    {
        title: 'trace_route.exe',
        lines: [
            '$ tracert 10.0.0.1',
            'hop 1: 12ms',
            'hop 2: 34ms',
            'hop 3: 58ms',
            'hop 4: timeout',
            'route found',
        ],
    },
    {
        title: 'brute_force.bin',
        lines: [
            '$ ./crack --wordlist',
            'attempt 4821/9999',
            'attempt 5732/9999',
            'attempt 6644/9999',
            'match found',
            'access granted',
        ],
    },
]

type GhostTerminal = {
    id: number
    top: number
    left: number
    script: typeof TERMINAL_SCRIPTS[number]
    visibleLines: number
}

function GhostTerminals() {
    const [terminals, setTerminals] = useState<GhostTerminal[]>([])
    const nextId = useRef(0)

    useEffect(() => {
        const spawn = () => {
            setTerminals(prev => {
                if (prev.length >= 3) return prev

                const script = TERMINAL_SCRIPTS[Math.floor(Math.random() * TERMINAL_SCRIPTS.length)]
                const id = nextId.current++

                const top = Math.random() * 70 + 5
                const left = Math.random() * 70 + 5

                const newTerminal: GhostTerminal = { id, top, left, script, visibleLines: 0 }
                return [...prev, newTerminal]
            })
        }

        const spawnInterval = setInterval(spawn, 2500)
        spawn()

        return () => clearInterval(spawnInterval)
    }, [])

    useEffect(() => {
        const tick = setInterval(() => {
            setTerminals(prev =>
                prev
                    .map(t => ({ ...t, visibleLines: t.visibleLines + 1 }))
                    .filter(t => t.visibleLines <= t.script.lines.length + 3)
            )
        }, 450)

        return () => clearInterval(tick)
    }, [])

    return (
        <>
            {terminals.map(t => (
                <div
                    key={t.id}
                    className="absolute hidden md:block border border-green-700/50 rounded bg-black/85 overflow-hidden"
                    style={{ top: `${t.top}%`, left: `${t.left}%`, width: '320px', height: '180px' }}
                >
                    <div className="bg-green-900/30 px-2 py-1 text-[10px] text-green-400 border-b border-green-800/50">
                        {t.script.title}
                    </div>
                    <div className="p-2 text-[10px] text-green-500 leading-relaxed">
                        {t.script.lines.slice(0, t.visibleLines).map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                </div>
            ))}
        </>
    )
}

const LOG_SNIPPETS = [
    'scanning ports...',
    'checking firewall rules...',
    'cipher suite negotiated',
    'tls handshake ok',
    'session token pending',
    'verifying origin...',
    'route table updated',
    'dns lookup resolved',
]

type FloatingLog = {
    id: number
    top: number
    left: number
    text: string
}

function FloatingLogs() {
    const [logs, setLogs] = useState<FloatingLog[]>([])
    const nextId = useRef(0)

    useEffect(() => {
        const interval = setInterval(() => {
            const id = nextId.current++
            const text = LOG_SNIPPETS[Math.floor(Math.random() * LOG_SNIPPETS.length)]
            const top = Math.random() * 90 + 2
            const left = Math.random() * 80 + 2

            setLogs(prev => [...prev.slice(-6), { id, top, left, text }])
        }, 900)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            {logs.map(log => (
                <p
                    key={log.id}
                    className="absolute hidden md:block text-green-700 text-[10px] opacity-60"
                    style={{ top: `${log.top}%`, left: `${log.left}%` }}
                >
                    [{Math.floor(Math.random() * 9000 + 1000)}] {log.text}
                </p>
            ))}
        </>
    )
}

export default function HackerBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <MatrixRain />
            <FloatingLogs />
            <GhostTerminals />
        </div>
    )
}