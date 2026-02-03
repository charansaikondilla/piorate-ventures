'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { loadFramesProgressive, type LoadProgress } from '@/lib/frameLoader';

export default function CanvasBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const [frames, setFrames] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [loadProgress, setLoadProgress] = useState(0);
    const [canShowContent, setCanShowContent] = useState(false);

    // Load frames progressively
    useEffect(() => {
        let mounted = true;

        const loadAllFrames = async () => {
            try {
                setIsLoading(true);
                
                const loadedFrames = await loadFramesProgressive((progress: LoadProgress) => {
                    if (mounted) {
                        setLoadProgress(progress.percentage);
                        
                        // Allow content to show after 30% loaded (priority frames)
                        if (progress.percentage >= 30 && !canShowContent) {
                            setCanShowContent(true);
                            setIsLoading(false);
                        }
                    }
                });

                if (mounted) {
                    setFrames(loadedFrames);
                    setIsLoading(false);
                    setCanShowContent(true);
                }
            } catch (error) {
                console.error('Error loading frames:', error);
                if (mounted) {
                    setLoadError('Failed to load animation frames');
                    setIsLoading(false);
                }
            }
        };

        loadAllFrames();

        return () => {
            mounted = false;
        };
    }, [canShowContent]);

    // Optimized animation using requestAnimationFrame
    useEffect(() => {
        if (frames.length === 0) return;

        let lastFrameTime = 0;
        const fps = 24;
        const frameDuration = 1000 / fps;

        const animate = (timestamp: number) => {
            if (timestamp - lastFrameTime >= frameDuration) {
                setCurrentFrame(prev => (prev + 1) % frames.length);
                lastFrameTime = timestamp;
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [frames.length]);

    // Optimized canvas rendering with memoization
    const renderFrame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || frames.length === 0) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const image = frames[currentFrame];
        if (!image || !image.complete || !image.naturalWidth) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate scaling (cover)
        const canvasAspect = window.innerWidth / window.innerHeight;
        const imageAspect = image.naturalWidth / image.naturalHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imageAspect) {
            drawWidth = window.innerWidth;
            drawHeight = drawWidth / imageAspect;
            offsetX = 0;
            offsetY = (window.innerHeight - drawHeight) / 2;
        } else {
            drawHeight = window.innerHeight;
            drawWidth = drawHeight * imageAspect;
            offsetX = (window.innerWidth - drawWidth) / 2;
            offsetY = 0;
        }

        // Draw with image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    }, [frames, currentFrame]);

    // Handle canvas setup and rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || frames.length === 0) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
            renderFrame();
        };

        resizeCanvas();
        renderFrame();

        // Debounced resize handler
        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 150);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, [frames, currentFrame, renderFrame]);

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-racing-black z-50">
                    <div className="text-center">
                        <div className="inline-block w-16 h-16 border-4 border-racing-red border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-white text-xl font-racing mb-2">Loading F1 Experience...</p>
                        <p className="text-racing-red text-lg font-racing">{loadProgress}%</p>
                    </div>
                </div>
            )}
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 w-full h-full -z-10"
                style={{ willChange: 'contents' }}
            />
        </>
    );
}
