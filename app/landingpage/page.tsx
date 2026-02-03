'use client';

import CanvasBackground from '../components/CanvasBackground';
import OnboardingForm from '../components/OnboardingForm';

export default function LandingPage() {
    return (
        <main className="relative min-h-screen">
            {/* Fixed Background Animation */}
            <CanvasBackground />

            {/* Scrollable Content */}
            <div className="relative z-10">
                <OnboardingForm />
            </div>
        </main>
    );
}
