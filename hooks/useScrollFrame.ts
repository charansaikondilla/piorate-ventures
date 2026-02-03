'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ScrollFrameData {
    currentFrame: number;
    scrollPercentage: number;
    scrollDirection: 'up' | 'down' | 'none';
}

/**
 * Custom hook for calculating current frame based on scroll position
 * @param totalFrames Total number of frames in the animation (default: 40)
 * @returns Current frame index, scroll percentage, and scroll direction
 */
export function useScrollFrame(totalFrames: number = 40): ScrollFrameData {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'none'>('none');
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = useCallback(() => {
        if (typeof window === 'undefined') return;

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;

        // Calculate frame index (0 to totalFrames - 1)
        const frameIndex = Math.min(
            Math.floor((scrolled / 100) * totalFrames),
            totalFrames - 1
        );

        // Determine scroll direction
        const direction = scrollTop > lastScrollY ? 'down' : scrollTop < lastScrollY ? 'up' : 'none';

        setCurrentFrame(frameIndex);
        setScrollPercentage(Math.min(scrolled, 100));
        setScrollDirection(direction);
        setLastScrollY(scrollTop);
    }, [totalFrames, lastScrollY]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Throttle scroll events for 60fps (16ms)
        let ticking = false;

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Initial call
        handleScroll();

        // Add scroll listener
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [handleScroll]);

    return {
        currentFrame,
        scrollPercentage,
        scrollDirection,
    };
}
