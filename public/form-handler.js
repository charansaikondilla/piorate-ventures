// ==================================
// PIORATE VENTURES - GOOGLE SHEETS FORM HANDLER
// Connects contact form to Google Sheets
// ==================================

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbw4dpE8HGOCIDRMnno_S5Vwpeu_VQW0AOHyhfH5QJk93XNbGdVeCDhFhNPk8e8zXpmU/exec';

// Initialize form handler when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    // Get form values
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const messageInput = document.getElementById('contactMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : 'No message provided';

    // Validate
    if (!name || !email) {
        showStatus(formStatus, 'Please fill in your name and email', 'error');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    showStatus(formStatus, 'Submitting your details...', 'loading');

    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                message: message,
                source: document.title || 'Contact Form',
                timestamp: new Date().toISOString()
            })
        });

        // Since mode is 'no-cors', we can't read the response
        // But if no error was thrown, the request was sent
        showStatus(formStatus, '✅ Message sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();

    } catch (error) {
        console.error('Form submission error:', error);
        showStatus(formStatus, '❌ Failed to send message. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request Consultation';
    }
}

function showStatus(element, message, type) {
    if (!element) return;

    element.textContent = message;
    element.className = 'form-status ' + type;
    element.style.display = 'block';

    // Hide success/error messages after 5 seconds
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}
