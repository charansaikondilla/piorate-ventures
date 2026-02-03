import type { Metadata } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
    title: 'Piorate Ventures | Client Onboarding',
    description: 'Transform your business with premium websites, automation, and personal branding services from Piorate Ventures.',
    keywords: 'Piorate Ventures, web development, automation, personal branding, business growth, digital services',
    openGraph: {
        title: 'Piorate Ventures | Client Onboarding',
        description: 'Transform your business with premium digital services',
        siteName: 'Piorate Ventures',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
            </head>
            <body className="antialiased bg-racing-black text-white overflow-x-hidden" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
