# Image Optimization Scripts

## Quick Start

### 1. Install Dependencies
```bash
npm install sharp --save-dev
```

### 2. Run Optimization
```bash
node scripts/optimize-images.js
```

This will:
- Create optimized JPEG versions (80% quality, progressive)
- Create WebP versions (25-35% smaller)
- Output to `public/f1car-zip-optimized/`
- Show detailed statistics

### 3. Review Results
Check the optimized images in `public/f1car-zip-optimized/` and compare quality.

### 4. Deploy Optimized Images

**Option A - Replace originals:**
```bash
# Backup originals first
mv public/f1car-zip public/f1car-zip-backup
mv public/f1car-zip-optimized public/f1car-zip
```

**Option B - Update paths:**
Update frameLoader.ts to point to the optimized folder.

## Expected Results

- **JPEG Optimization**: 40-60% file size reduction
- **WebP Format**: Additional 25-35% smaller than optimized JPEG
- **Total Savings**: Potentially 50-70% smaller overall

## WebP Support

To use WebP with JPEG fallback, update frameLoader.ts:

```typescript
const loadFrame = async (frameNumber: number) => {
    const frameNum = frameNumber.toString().padStart(3, '0');
    const image = new Image();
    
    // Try WebP first
    image.src = `/f1car-zip/ezgif-frame-${frameNum}.webp`;
    
    // Fallback to JPEG on error
    image.onerror = () => {
        image.src = `/f1car-zip/ezgif-frame-${frameNum}.jpg`;
    };
    
    return image;
};
```

## Troubleshooting

**Sharp installation fails:**
```bash
npm install --platform=win32 --arch=x64 sharp
```

**Images too large:**
Adjust MAX_WIDTH/MAX_HEIGHT in optimize-images.js

**Quality too low:**
Increase JPEG_QUALITY and WEBP_QUALITY (80-90 range)
