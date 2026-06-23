export function SectionBackground({ variant }: { variant: number }) {
    const configs = [
        // Hero
        {
            gradient: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(110, 86, 207, 0.3) 0%, transparent 70%)',
            shapes: [
                { size: 400, x: -10, y: -10, opacity: 0.04 },
                { size: 300, x: 80, y: 60, opacity: 0.03 },
            ],
        },
        // Features
        {
            gradient: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(110, 86, 207, 0.2) 0%, transparent 70%)',
            shapes: [
                { size: 500, x: -15, y: 20, opacity: 0.03 },
                { size: 250, x: 85, y: 70, opacity: 0.04 },
            ],
        },
        // TechStack
        {
            gradient: 'radial-gradient(ellipse 70% 60% at 100% 50%, rgba(147, 112, 219, 0.2) 0%, transparent 70%)',
            shapes: [
                { size: 350, x: 70, y: -10, opacity: 0.04 },
                { size: 200, x: 5, y: 70, opacity: 0.03 },
            ],
        },
        // HowItWorks
        {
            gradient: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(110, 86, 207, 0.25) 0%, transparent 70%)',
            shapes: [
                { size: 450, x: 40, y: 50, opacity: 0.03 },
                { size: 200, x: -5, y: -5, opacity: 0.04 },
            ],
        },
        // Security
        {
            gradient: 'radial-gradient(ellipse 60% 80% at 0% 100%, rgba(90, 70, 180, 0.25) 0%, transparent 70%)',
            shapes: [
                { size: 400, x: -10, y: 50, opacity: 0.04 },
                { size: 300, x: 75, y: -10, opacity: 0.03 },
            ],
        },
        // Comparison
        {
            gradient: 'radial-gradient(ellipse 70% 60% at 100% 0%, rgba(110, 86, 207, 0.2) 0%, transparent 70%)',
            shapes: [
                { size: 350, x: 70, y: -5, opacity: 0.04 },
                { size: 250, x: -5, y: 60, opacity: 0.03 },
            ],
        },
        // Footer
        {
            gradient: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(110, 86, 207, 0.15) 0%, transparent 70%)',
            shapes: [
                { size: 400, x: 30, y: 20, opacity: 0.03 },
            ],
        },
    ]

    const config = configs[variant] || configs[0]

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Gradiente principal */}
            <div
                className="absolute inset-0"
                style={{ background: config.gradient }}
            />

            {/* Círculos decorativos */}
            {config.shapes.map((shape, i) => (
                <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: shape.size,
                        height: shape.size,
                        left: `${shape.x}%`,
                        top: `${shape.y}%`,
                        background: `rgba(110, 86, 207, ${shape.opacity})`,
                        border: '1px solid rgba(110, 86, 207, 0.08)',
                    }}
                />
            ))}

            {/* Líneas decorativas en esquinas */}
            <svg
                className="absolute inset-0 w-full h-full"
                style={{ opacity: 0.04 }}
            >
                <line x1="0" y1="0" x2="100%" y2="100%" stroke="#6e56cf" strokeWidth="1" />
                <line x1="100%" y1="0" x2="0" y2="100%" stroke="#6e56cf" strokeWidth="0.5" />
            </svg>
        </div>
    )
}