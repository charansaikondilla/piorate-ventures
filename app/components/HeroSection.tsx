'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6">
            <div className="max-w-6xl mx-auto text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    viewport={{ once: true }}
                >
                    <motion.h1
                        className="text-7xl md:text-9xl font-racing font-black uppercase mb-6 text-glow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        F1 Racing
                    </motion.h1>

                    <motion.p
                        className="text-2xl md:text-4xl font-display text-gray-300 mb-12 tracking-wide"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        Experience the Speed. Feel the Power.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <motion.button
                            className="racing-button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Your Journey
                        </motion.button>

                        <motion.button
                            className="px-8 py-4 glass-card text-white font-racing font-bold uppercase tracking-wider rounded-lg border-2 border-white/20 hover:border-racing-red transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Learn More
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex flex-col items-center gap-2"
                    >
                        <span className="text-white/60 font-display text-sm uppercase tracking-wider">
                            Scroll to Accelerate
                        </span>
                        <svg
                            className="w-6 h-6 text-racing-red"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
