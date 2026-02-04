import { defineConfig } from 'vite'

export default defineConfig({
    base: './',
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
            input: {
                main: 'index.html',
                automation: 'automation.html',
                branding: 'branding.html',
                website: 'website.html',
                portfolio: 'website-portfolio.html'
            }
        }
    }
})
