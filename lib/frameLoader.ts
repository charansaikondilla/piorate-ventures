/**
 * Optimized frame loader utility with progressive loading
 * Strategy: Load critical frames first, then load remaining frames in background
 */

export interface FrameData {
    images: HTMLImageElement[];
    isLoaded: boolean;
    error: string | null;
}

export interface LoadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

// Cache for loaded frames
const frameCache = new Map<number, HTMLImageElement>();
const FRAME_COUNT = 40;

// Priority frames to load first (first, middle, last, and key animation frames)
const PRIORITY_FRAMES = [1, 10, 20, 30, 40, 5, 15, 25, 35];

/**
 * Load a single frame with caching
 */
function loadFrame(frameNumber: number, priority: 'high' | 'low' = 'low'): Promise<HTMLImageElement> {
    // Return cached frame if available
    if (frameCache.has(frameNumber)) {
        return Promise.resolve(frameCache.get(frameNumber)!);
    }

    return new Promise((resolve, reject) => {
        const frameNum = frameNumber.toString().padStart(3, '0');
        const image = new Image();
        
        // Set loading priority
        if (priority === 'high') {
            image.fetchPriority = 'high';
        }

        image.onload = () => {
            frameCache.set(frameNumber, image);
            // Decode for better rendering performance
            if (image.decode) {
                image.decode()
                    .then(() => resolve(image))
                    .catch(() => resolve(image));
            } else {
                resolve(image);
            }
        };
        
        image.onerror = () => {
            console.warn(`Failed to load frame ${frameNum}`);
            reject(new Error(`Failed to load frame ${frameNum}`));
        };

        image.src = `/f1car-zip/ezgif-frame-${frameNum}.jpg`;
    });
}

/**
 * Progressive loading: Load priority frames first, then remaining frames
 * @param onProgress Callback for loading progress updates
 */
export async function loadFramesProgressive(
    onProgress?: (progress: LoadProgress) => void
): Promise<HTMLImageElement[]> {
    const frames: HTMLImageElement[] = new Array(FRAME_COUNT);
    let loadedCount = 0;

    const updateProgress = () => {
        loadedCount++;
        if (onProgress) {
            onProgress({
                loaded: loadedCount,
                total: FRAME_COUNT,
                percentage: Math.round((loadedCount / FRAME_COUNT) * 100)
            });
        }
    };

    try {
        // Phase 1: Load priority frames first (high priority)
        const priorityPromises = PRIORITY_FRAMES.map(async (frameNum) => {
            try {
                const img = await loadFrame(frameNum, 'high');
                frames[frameNum - 1] = img;
                updateProgress();
            } catch (error) {
                console.warn(`Priority frame ${frameNum} failed to load`);
            }
        });

        await Promise.allSettled(priorityPromises);

        // Phase 2: Load remaining frames in background (low priority)
        const remainingFrames = Array.from({ length: FRAME_COUNT }, (_, i) => i + 1)
            .filter(num => !PRIORITY_FRAMES.includes(num));

        const remainingPromises = remainingFrames.map(async (frameNum) => {
            try {
                const img = await loadFrame(frameNum, 'low');
                frames[frameNum - 1] = img;
                updateProgress();
            } catch (error) {
                console.warn(`Frame ${frameNum} failed to load`);
                // Create placeholder image
                frames[frameNum - 1] = new Image();
            }
        });

        // Don't wait for all remaining frames, load them in background
        Promise.allSettled(remainingPromises);

    } catch (error) {
        console.error('Error in progressive loading:', error);
    }

    return frames;
}

/**
 * Original load all frames function (kept for compatibility)
 */
export async function loadFrames(): Promise<HTMLImageElement[]> {
    return loadFramesProgressive();
}

/**
 * Preload a single frame
 */
export function loadSingleFrame(frameNumber: number): Promise<HTMLImageElement> {
    return loadFrame(frameNumber, 'high');
}

/**
 * Clear frame cache (useful for memory management)
 */
export function clearFrameCache(): void {
    frameCache.clear();
}

/**
 * Get cached frame if available
 */
export function getCachedFrame(frameNumber: number): HTMLImageElement | undefined {
    return frameCache.get(frameNumber);
}
