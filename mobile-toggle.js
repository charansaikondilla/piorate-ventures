document.addEventListener('DOMContentLoaded', () => {
    const previewBtn = document.createElement('button');
    previewBtn.innerText = '📱 Mobile View';
    Object.assign(previewBtn.style, {
        position: 'fixed', bottom: '20px', left: '20px', zIndex: '9999',
        padding: '10px 20px', background: '#ec4899', color: 'white',
        border: 'none', borderRadius: '30px', cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)', fontWeight: 'bold'
    });
    document.body.appendChild(previewBtn);

    let isMobile = false;
    previewBtn.addEventListener('click', () => {
        isMobile = !isMobile;
        if (isMobile) {
            document.body.style.maxWidth = '375px';
            document.body.style.margin = '0 auto';
            document.body.style.border = '10px solid #333';
            document.body.style.borderRadius = '20px';
            document.body.style.overflowX = 'hidden';

            // Ensure min-height handles the "phone" border correctly
            document.body.style.minHeight = '100dvh';

            previewBtn.innerText = '🖥️ Desktop View';
        } else {
            document.body.style.maxWidth = '';
            document.body.style.margin = '';
            document.body.style.border = '';
            document.body.style.borderRadius = '';
            document.body.style.overflowX = '';
            document.body.style.minHeight = '';
            previewBtn.innerText = '📱 Mobile View';
        }
    });
});
