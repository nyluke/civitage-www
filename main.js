// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '1rem 0';
        navbar.style.background = 'rgba(10, 12, 16, 0.95)';
    } else {
        navbar.style.padding = '1.5rem 0';
        navbar.style.background = 'rgba(10, 12, 16, 0.8)';
    }
});

// Intersection Observer for scroll animations (optional enhancement)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .mission-text, .glass-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.classList.add('observer-item');
    observer.observe(el);
});

// Add CSS class for items observed
const style = document.createElement('style');
style.textContent = `
    .observer-item.fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.8s ease;
    }
`;
document.head.appendChild(style);

// Form Submission Handling
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const submitBtn = document.querySelector('#submit-btn');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = new FormData(form);
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        status.textContent = '';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.style.color = 'var(--primary)';
                status.textContent = 'Thank you! Your message has been sent.';
                form.reset();
            } else {
                const result = await response.json();
                status.style.color = '#ff4444';
                status.textContent = result.errors ? result.errors.map(error => error.message).join(", ") : "Oops! There was a problem.";
            }
        } catch (error) {
            status.style.color = '#ff4444';
            status.textContent = "Oops! There was a problem connecting to the server.";
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}
