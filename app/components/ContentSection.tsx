'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface ContentSectionProps {
    title: string;
    description: string;
    stats?: { label: string; value: string }[];
    alignment?: 'left' | 'center' | 'right';
}

export default function ContentSection({
    title,
    description,
    stats,
    alignment = 'center',
}: ContentSectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const alignmentClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    }[alignment];

    return (
        <section ref={sectionRef} className="min-h-screen flex items-center justify-center px-6 py-20">
            <motion.div
                className={`max-w-6xl mx-auto ${alignmentClass}`}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8 }}
            >
                <motion.h2
                    className="text-5xl md:text-7xl font-racing font-bold uppercase mb-8 text-racing-red"
                    initial={{ opacity: 0, x: alignment === 'left' ? -50 : alignment === 'right' ? 50 : 0 }}
                    animate={
                        isVisible
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: alignment === 'left' ? -50 : alignment === 'right' ? 50 : 0 }
                    }
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {title}
                </motion.h2>

                <motion.p
                    className="text-xl md:text-2xl font-display text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {description}
                </motion.p>

                {stats && stats.length > 0 && (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="glass-card p-8"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                whileHover={{ scale: 1.05, borderColor: 'rgba(220, 0, 0, 0.5)' }}
                            >
                                <div className="text-5xl font-racing font-bold text-racing-red mb-4">
                                    {stat.value}
                                </div>
                                <div className="text-lg font-display text-gray-400 uppercase tracking-wide">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
