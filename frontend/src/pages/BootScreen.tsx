import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import WorldMap from 'react-svg-worldmap'

const BOOT_LOGS = [
    '[OK] Initializing TitiGuard kernel...',
    '[OK] Loading encryption modules (AES-256)...',
    '[OK] Mounting secure vault filesystem...',
    '[OK] Establishing connection to auth server...',
    '[OK] Verifying system integrity...',
    '[OK] Starting JWT token service...',
    '[OK] Loading 2FA protocol (TOTP)...',
    '[READY] All systems operational.',
]

const ASCII_LOGO = `
 ████████╗██╗████████╗██╗ ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗ 
╚══██╔══╝██║╚══██╔══╝██║██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗
   ██║   ██║   ██║   ██║██║  ███╗██║   ██║███████║██████╔╝██║  ██║
   ██║   ██║   ██║   ██║██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║
   ██║   ██║   ██║   ██║╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
   ╚═╝   ╚═╝   ╚═╝   ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ 
`

const ACTIVITY_FEED = [
    'auth.session.created — node-us-east-1',
    'vault.entry.encrypted — AES-256-GCM',
    'token.refresh — exp 900s',
    '2fa.totp.verified — node-eu-west-2',
    'db.query — neon.tech [12ms]',
    'cipher.handshake — established',
]

function useTypewriter(lines: string[], speed = 18) {
    const [visibleLines, setVisibleLines] = useState<string[]>([])
    const [currentLine, setCurrentLine] = useState('')
    const [done, setDone] = useState(false)

    useEffect(() => {
        let lineIndex = 0
        let charIndex = 0

        const interval = setInterval(() => {
            if (lineIndex >= lines.length) {
                clearInterval(interval)
                setDone(true)
                return
            }

            const fullLine = lines[lineIndex]

            if (charIndex < fullLine.length) {
                setCurrentLine(fullLine.slice(0, charIndex + 1))
                charIndex++
            } else {
                setVisibleLines(prev => [...prev, fullLine])
                setCurrentLine('')
                lineIndex++
                charIndex = 0
            }
        }, speed)

        return () => clearInterval(interval)
    }, [])

    return { visibleLines, currentLine, done }
}

function useCounter(target: number, durationMs: number) {
    const [value, setValue] = useState(0)

    useEffect(() => {
        const steps = 30
        const stepValue = target / steps
        let current = 0

        const interval = setInterval(() => {
            current++
            setValue(Math.min(Math.round(stepValue * current), target))
            if (current >= steps) clearInterval(interval)
        }, durationMs / steps)

        return () => clearInterval(interval)
    }, [target, durationMs])

    return value
}

function StatBar({ label, value }: { label: string; value: number }) {
    return (
        <div className="mb-3">
            <div className="flex justify-between text-xs text-green-500 mb-1">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="w-full h-1.5 bg-green-900/30 rounded-full overflow-hidden">
                <div
                    className="h-full bg-green-400 transition-all duration-300"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    )
}

function NetworkMap() {
    const data = [
        { country: 'us', value: 100 },
        { country: 'gb', value: 80 },
        { country: 'de', value: 75 },
        { country: 'in', value: 60 },
        { country: 'br', value: 50 },
        { country: 'jp', value: 55 },
        { country: 'au', value: 40 },
    ]

    return (
        <div className="relative flex justify-center items-center w-full">
            <WorldMap
                color="rgb(74 222 128)"
                backgroundColor="transparent"
                size="responsive"
                data={data}
                tooltipBgColor="black"
                tooltipTextColor="rgb(74 222 128)"
                borderColor="rgb(34 100 60)"
                styleFunction={() => ({
                    fill: 'rgb(20 60 40)',
                    stroke: 'rgb(34 100 60)',
                    strokeWidth: 0.5,
                })}
            />
            <TrafficOverlay />
        </div>
    )
}

function HexDump() {
    const [rows, setRows] = useState<string[]>([])

    useEffect(() => {
        const generateRow = () => {
            const bytes = Array.from({ length: 8 }, () =>
                Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
            )
            return bytes.join(' ')
        }

        setRows(Array.from({ length: 6 }, generateRow))

        const interval = setInterval(() => {
            setRows(prev => {
                const next = [...prev.slice(1), generateRow()]
                return next
            })
        }, 400)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="text-xs text-green-800 leading-relaxed">
            {rows.map((row, i) => (
                <div key={i}>0x{(i * 8).toString(16).padStart(4, '0')}  {row}</div>
            ))}
        </div>
    )
}

function IpEncryption() {
    const [ips, setIps] = useState<{ ip: string; progress: number }[]>([])

    const randomIp = () =>
        `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

    useEffect(() => {
        setIps(Array.from({ length: 4 }, () => ({ ip: randomIp(), progress: 0 })))

        const interval = setInterval(() => {
            setIps(prev =>
                prev.map(item => {
                    const next = item.progress + Math.floor(Math.random() * 15) + 5
                    if (next >= 100) {
                        return { ip: randomIp(), progress: 0 }
                    }
                    return { ...item, progress: next }
                })
            )
        }, 350)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ips.map((item, i) => (
                <div key={i} className="text-xs">
                    <div className="flex justify-between text-green-500 mb-1">
                        <span>{item.ip}</span>
                        <span>{item.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-green-900/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-400 transition-all duration-200"
                            style={{ width: `${item.progress}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

const CONNECTION_POINTS: Record<string, { x: number; y: number }> = {
    ecuador:  { x: 29, y: 41 },
    noruega:  { x: 53, y: 23 },
    rusia:    { x: 77, y: 25 },
    brasil:   { x: 36, y: 44 },
    india:    { x: 72, y: 36 },
    canada:   { x: 21, y: 26 },
    usa:      { x: 23, y: 31 },
    china:    { x: 80, y: 33 },
    italia:   { x: 54, y: 31 },
    mexico:   { x: 22, y: 36 },
}

const TRAFFIC_ROUTES: [string, string][] = [
    ['ecuador', 'noruega'],
    ['brasil', 'rusia'],
    ['canada', 'india'],
    ['usa', 'china'],
    ['italia', 'mexico'],
]

function TrafficOverlay() {
    return (
        <svg
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
        >
            {TRAFFIC_ROUTES.map(([from, to], i) => {
                const a = CONNECTION_POINTS[from]
                const b = CONNECTION_POINTS[to]
                return (
                    <line
                        key={i}
                        x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                        stroke="rgb(74 222 128)"
                        strokeWidth="0.3"
                        strokeDasharray="1.5 1.5"
                        opacity="0.7"
                    >
                        <animate
                            attributeName="stroke-dashoffset"
                            from="0" to="-6"
                            dur={`${1 + i * 0.3}s`}
                            repeatCount="indefinite"
                        />
                    </line>
                )
            })}
            {Object.values(CONNECTION_POINTS).map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="0.8" fill="rgb(134 239 172)">
                    <animate
                        attributeName="opacity"
                        values="0.5;1;0.5"
                        dur={`${1.2 + (i % 3) * 0.4}s`}
                        repeatCount="indefinite"
                    />
                </circle>
            ))}
        </svg>
    )
}

function ActivityTicker() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % ACTIVITY_FEED.length)
        }, 1800)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="text-xs space-y-1.5">
            {ACTIVITY_FEED.map((line, i) => {
                const isActive = i === index
                return (
                    <p
                        key={i}
                        className={isActive ? 'text-green-300' : 'text-green-700'}
                    >
                        {isActive ? '> ' : '  '}{line}
                    </p>
                )
            })}
        </div>
    )
}

export default function BootScreen() {
    const navigate = useNavigate()
    const { visibleLines, currentLine, done } = useTypewriter(BOOT_LOGS)

    const cpu = useCounter(34, 2000)
    const mem = useCounter(58, 2200)
    const net = useCounter(91, 1800)

    return (
        <div
            className="min-h-screen bg-black text-green-400 p-6 flex flex-col"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
      <pre className="text-green-500 text-xs sm:text-sm mb-6 leading-tight overflow-x-auto">
        {ASCII_LOGO}
      </pre>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="border border-green-900/50 rounded-lg p-4 bg-black/40 flex flex-col">
                    <p className="text-green-600 text-xs mb-2">/var/log/titiguard/boot.log</p>
                    <div className="text-sm leading-relaxed">
                        {visibleLines.map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                        <div>{currentLine}<span className="animate-pulse">▋</span></div>
                    </div>

                    {done && (
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="border border-green-500 text-green-400 px-6 py-2 rounded hover:bg-green-500 hover:text-black transition-colors text-sm"
                            >
                                [ LOGIN ]
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="border border-green-500 text-green-400 px-6 py-2 rounded hover:bg-green-500 hover:text-black transition-colors text-sm"
                            >
                                [ REGISTER ]
                            </button>
                        </div>
                    )}
                </div>

                <div className="border border-green-900/50 rounded-lg p-4 bg-black/40 flex flex-col">
                    <p className="text-green-600 text-xs mb-2 text-center">GLOBAL NETWORK MAP</p>
                    <div className="flex-1 flex items-center">
                        <NetworkMap />
                    </div>
                </div>

                <div className="border border-green-900/50 rounded-lg p-4 bg-black/40 flex flex-col">
                    <p className="text-green-600 text-xs mb-3">SYSTEM STATUS</p>
                    <StatBar label="CPU" value={cpu} />
                    <StatBar label="MEMORY" value={mem} />
                    <StatBar label="NETWORK" value={net} />

                    <p className="text-green-600 text-xs mt-6 mb-2">CONNECTIONS</p>
                    <p className="text-xs text-green-400">neon.tech ... <span className="text-green-300">OK</span></p>
                    <p className="text-xs text-green-400">jwt-service ... <span className="text-green-300">OK</span></p>
                    <p className="text-xs text-green-400">vault-cipher ... <span className="text-green-300">OK</span></p>

                    <p className="text-green-600 text-xs mt-6 mb-2">ACTIVITY FEED</p>
                    <ActivityTicker />

                    <p className="text-green-600 text-xs mt-6 mb-2">MEMORY DUMP</p>
                    <HexDump />
                </div>

            </div>

            <div className="mt-4 border border-green-900/50 rounded-lg p-4 bg-black/40">
                <p className="text-green-600 text-xs mb-2">ENCRYPTING TRAFFIC</p>
                <IpEncryption />
            </div>

        </div>
    )
}