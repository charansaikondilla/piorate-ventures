'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface FormData {
    name: string;
    whatsapp: string;
    gmail: string;
    linkedin: string;
    services: string[];
}

export default function OnboardingForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        whatsapp: '',
        gmail: '',
        linkedin: '',
        services: [],
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
    const [progress, setProgress] = useState(0);

    const services = [
        { 
            id: 'websites', 
            label: 'Websites', 
            icon: '🌐',
            description: 'Custom responsive websites & landing pages'
        },
        { 
            id: 'automation', 
            label: 'Automation', 
            icon: '⚙️',
            description: 'Workflow automation & integrations'
        },
        { 
            id: 'personal-branding', 
            label: 'Personal Branding', 
            icon: '✨',
            description: 'Social media & content strategy'
        },
    ];

    // Calculate progress
    useEffect(() => {
        const filled = Object.entries(formData).filter(([key, value]) => {
            if (key === 'services') return value.length > 0;
            return value.trim() !== '';
        }).length;
        setProgress((filled / 5) * 100);
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (field: keyof FormData) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const newErrors = { ...errors };

        if (field === 'name' && !formData.name.trim()) {
            newErrors.name = 'Please enter your full name';
        } else if (field === 'name') {
            delete newErrors.name;
        }

        if (field === 'whatsapp' && formData.whatsapp && !/^\+?[\d\s-()]+$/.test(formData.whatsapp)) {
            newErrors.whatsapp = 'Include country code (e.g., +1 555-123-4567)';
        } else if (field === 'whatsapp' && formData.whatsapp) {
            delete newErrors.whatsapp;
        }

        if (field === 'gmail' && formData.gmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.gmail)) {
            newErrors.gmail = 'Please enter a valid email (e.g., you@company.com)';
        } else if (field === 'gmail' && formData.gmail) {
            delete newErrors.gmail;
        }

        if (field === 'linkedin' && formData.linkedin && !formData.linkedin.includes('linkedin.com')) {
            newErrors.linkedin = 'Please provide a valid LinkedIn URL';
        } else if (field === 'linkedin' && formData.linkedin) {
            delete newErrors.linkedin;
        }

        setErrors(newErrors);
    };

    const handleServiceToggle = (serviceId: string) => {
        // Haptic feedback for mobile
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10);
        }
        
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(serviceId)
                ? prev.services.filter(s => s !== serviceId)
                : [...prev.services, serviceId],
        }));
        if (errors.services) {
            setErrors(prev => ({ ...prev, services: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Please enter your full name';
        }

        if (!formData.whatsapp.trim()) {
            newErrors.whatsapp = 'WhatsApp number is required';
        } else if (!/^\+?[\d\s-()]+$/.test(formData.whatsapp)) {
            newErrors.whatsapp = 'Include country code (e.g., +1 555-123-4567)';
        }

        if (!formData.gmail.trim()) {
            newErrors.gmail = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.gmail)) {
            newErrors.gmail = 'Please enter a valid email (e.g., you@company.com)';
        }

        if (!formData.linkedin.trim()) {
            newErrors.linkedin = 'LinkedIn profile is required';
        } else if (!formData.linkedin.includes('linkedin.com')) {
            newErrors.linkedin = 'Please provide a valid LinkedIn URL';
        }

        if (formData.services.length === 0) {
            newErrors.services = 'Please select at least one service';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Track event (if analytics available)
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'form_submit', {
                        form_name: 'onboarding',
                        services: formData.services.join(',')
                    });
                }
                
                console.log('Form submitted:', formData);
                setSubmitted(true);
                
                // Here you can add your API call
                // await fetch('/api/onboard', { method: 'POST', body: JSON.stringify(formData) })
            } catch (error) {
                setErrors({ name: 'Submission failed. Please try again.' });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-8 sm:p-12 max-w-2xl w-full text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="text-6xl mb-6"
                    >
                        🎉
                    </motion.div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-racing font-bold uppercase mb-4 text-racing-red">
                        Welcome Aboard!
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-300 mb-4">
                        Thank you, <span className="text-white font-bold">{formData.name}</span>! 
                        We've received your information and will get back to you shortly.
                    </p>
                    <p className="text-sm text-gray-400 mb-8">
                        You'll receive a confirmation email at <strong className="text-white">{formData.gmail}</strong> within 24 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            onClick={() => {
                                setSubmitted(false);
                                setFormData({
                                    name: '',
                                    whatsapp: '',
                                    gmail: '',
                                    linkedin: '',
                                    services: [],
                                });
                                setTouched({});
                                setProgress(0);
                            }}
                            className="racing-button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Submit Another Form
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass-card p-6 sm:p-8 md:p-12 max-w-3xl w-full"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-8"
                >
                    <div className="text-5xl sm:text-6xl mb-4">🚀</div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-racing font-black uppercase mb-3 text-glow">
                        Piorate Ventures
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-400 font-display max-w-2xl mx-auto mb-4">
                        Let's accelerate your business growth. Complete this form to get started with our premium services.
                    </p>
                    <div className="w-24 h-1 bg-racing-red mx-auto"></div>
                </motion.div>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 h-2 rounded-full mb-8">
                    <motion.div 
                        className="h-full bg-racing-red rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="relative"
                    >
                        <label htmlFor="name" className="block text-base sm:text-lg font-racing mb-2 text-white">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={() => handleBlur('name')}
                            aria-required="true"
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? "name-error" : undefined}
                            className={`w-full px-4 py-3 bg-white/10 border ${
                                errors.name ? 'border-racing-red' : 'border-white/20'
                            } rounded-lg focus:outline-none focus:border-racing-red focus:ring-2 focus:ring-racing-red/50 transition-colors text-white placeholder-gray-500`}
                            placeholder="Enter your full name"
                        />
                        {formData.name && !errors.name && touched.name && (
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute right-3 top-11 text-green-500 text-xl"
                            >
                                ✓
                            </motion.span>
                        )}
                        {errors.name && touched.name && (
                            <motion.p 
                                id="name-error"
                                role="alert"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-racing-red text-sm mt-1 flex items-center gap-1"
                            >
                                <span>⚠️</span> {errors.name}
                            </motion.p>
                        )}
                    </motion.div>

                    {/* WhatsApp Field */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <label htmlFor="whatsapp" className="block text-base sm:text-lg font-racing mb-2 text-white">
                            WhatsApp Number *
                        </label>
                        <input
                            type="tel"
                            id="whatsapp"
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            onBlur={() => handleBlur('whatsapp')}
                            aria-required="true"
                            aria-invalid={!!errors.whatsapp}
                            aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
                            className={`w-full px-4 py-3 bg-white/10 border ${
                                errors.whatsapp ? 'border-racing-red' : 'border-white/20'
                            } rounded-lg focus:outline-none focus:border-racing-red focus:ring-2 focus:ring-racing-red/50 transition-colors text-white placeholder-gray-500`}
                            placeholder="+1 234 567 8900"
                        />
                        {formData.whatsapp && !errors.whatsapp && touched.whatsapp && (
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute right-3 top-11 text-green-500 text-xl"
                            >
                                ✓
                            </motion.span>
                        )}
                        {errors.whatsapp && touched.whatsapp && (
                            <motion.p 
                                id="whatsapp-error"
                                role="alert"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-racing-red text-sm mt-1 flex items-center gap-1"
                            >
                                <span>⚠️</span> {errors.whatsapp}
                            </motion.p>
                        )}
                    </motion.div>

                    {/* Gmail Field */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="relative"
                    >
                        <label htmlFor="gmail" className="block text-base sm:text-lg font-racing mb-2 text-white">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            id="gmail"
                            name="gmail"
                            value={formData.gmail}
                            onChange={handleChange}
                            onBlur={() => handleBlur('gmail')}
                            aria-required="true"
                            aria-invalid={!!errors.gmail}
                            aria-describedby={errors.gmail ? "gmail-error" : undefined}
                            className={`w-full px-4 py-3 bg-white/10 border ${
                                errors.gmail ? 'border-racing-red' : 'border-white/20'
                            } rounded-lg focus:outline-none focus:border-racing-red focus:ring-2 focus:ring-racing-red/50 transition-colors text-white placeholder-gray-500`}
                            placeholder="your.email@example.com"
                        />
                        {formData.gmail && !errors.gmail && touched.gmail && (
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute right-3 top-11 text-green-500 text-xl"
                            >
                                ✓
                            </motion.span>
                        )}
                        {errors.gmail && touched.gmail && (
                            <motion.p 
                                id="gmail-error"
                                role="alert"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-racing-red text-sm mt-1 flex items-center gap-1"
                            >
                                <span>⚠️</span> {errors.gmail}
                            </motion.p>
                        )}
                    </motion.div>

                    {/* LinkedIn Field */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                    >
                        <label htmlFor="linkedin" className="block text-base sm:text-lg font-racing mb-2 text-white">
                            LinkedIn Profile *
                        </label>
                        <input
                            type="url"
                            id="linkedin"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            onBlur={() => handleBlur('linkedin')}
                            aria-required="true"
                            aria-invalid={!!errors.linkedin}
                            aria-describedby={errors.linkedin ? "linkedin-error" : undefined}
                            className={`w-full px-4 py-3 bg-white/10 border ${
                                errors.linkedin ? 'border-racing-red' : 'border-white/20'
                            } rounded-lg focus:outline-none focus:border-racing-red focus:ring-2 focus:ring-racing-red/50 transition-colors text-white placeholder-gray-500`}
                            placeholder="https://linkedin.com/in/yourprofile"
                        />
                        {formData.linkedin && !errors.linkedin && touched.linkedin && (
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute right-3 top-11 text-green-500 text-xl"
                            >
                                ✓
                            </motion.span>
                        )}
                        {errors.linkedin && touched.linkedin && (
                            <motion.p 
                                id="linkedin-error"
                                role="alert"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-racing-red text-sm mt-1 flex items-center gap-1"
                            >
                                <span>⚠️</span> {errors.linkedin}
                            </motion.p>
                        )}
                    </motion.div>

                    {/* Services Selection */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                    >
                        <label className="block text-base sm:text-lg font-racing mb-4 text-white">
                            What do you need for your business? *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {services.map((service, index) => (
                                <motion.button
                                    key={service.id}
                                    type="button"
                                    onClick={() => handleServiceToggle(service.id)}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-pressed={formData.services.includes(service.id)}
                                    aria-label={`Select ${service.label} service`}
                                    className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                                        formData.services.includes(service.id)
                                            ? 'bg-racing-red/20 border-racing-red shadow-lg shadow-racing-red/20'
                                            : 'bg-white/5 border-white/20 hover:border-white/40'
                                    }`}
                                >
                                    <div className="text-3xl sm:text-4xl mb-2">{service.icon}</div>
                                    <div className="font-racing text-white font-bold mb-1">
                                        {service.label}
                                    </div>
                                    <div className="text-xs text-gray-400 font-display">
                                        {service.description}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                        {errors.services && (
                            <motion.p 
                                role="alert"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-racing-red text-sm mt-2 flex items-center gap-1"
                            >
                                <span>⚠️</span> {errors.services}
                            </motion.p>
                        )}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="pt-6"
                    >
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full racing-button text-lg sm:text-xl py-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    <span className="hidden sm:inline">Submitting...</span>
                                    <span className="sm:hidden">Sending...</span>
                                </span>
                            ) : (
                                <>
                                    <span className="hidden sm:inline">Submit Onboarding Form</span>
                                    <span className="sm:hidden">Submit Form</span>
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                </form>

                {/* Trust Signal */}
                <div className="text-center mt-8 pt-8 border-t border-white/10">
                    <p className="text-xs sm:text-sm text-gray-400">
                        🔒 Your information is secure and will never be shared
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
