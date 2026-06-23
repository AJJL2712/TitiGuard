import { useEffect, useState, useRef } from 'react'

export function useActiveSection(sectionCount: number) {
    const [activeIndex, setActiveIndex] = useState(0)
    const refs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const observers: IntersectionObserver[] = []

        refs.current.forEach((el, index) => {
            if (!el) return

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveIndex(index)
                    }
                },
                { threshold: 0.6 }
            )

            observer.observe(el)
            observers.push(observer)
        })

        return () => observers.forEach(o => o.disconnect())
    }, [sectionCount])

    const setRef = (index: number) => (el: HTMLDivElement | null) => {
        refs.current[index] = el
    }

    return { activeIndex, setRef }
}
