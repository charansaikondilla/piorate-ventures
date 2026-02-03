'use client';

import { useScrollFrame } from '@/hooks/useScrollFrame';
import { motion } from 'framer-motion';

export default function ScrollProgress() {
    const { scrollPercentage } = useScrollFrame(40);

    return (
        <div className="fixed top-8 right-8 z-50">
            <div className="relative w-20 h-20">
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="4"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <motion.circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#DC0000"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={226.2}
                        strokeDashoffset={226.2 - (226.2 * scrollPercentage) / 100}
                        initial={{ strokeDashoffset: 226.2 }}
                        animate={{ strokeDashoffset: 226.2 - (226.2 * scrollPercentage) / 100 }}
                        transition={{ duration: 0.1 }}
                    />
                </svg>

                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-racing text-sm font-bold">
                        {Math.round(scrollPercentage)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
