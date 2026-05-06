// Navigation menu toggle for mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('toggle');
});

// Close mobile menu when clicking a link
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('toggle');
    });
});

// Scroll animations to fade in sections
const sections = document.querySelectorAll('.section-fade');

const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        }
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Add active state to nav links on scroll & modify navbar style
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });
    
    // Navbar background change on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initial trigger for scroll styling
if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
}

// Contact Form Submission (Prevent Default)
const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        
        // Simple visual feedback
        btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #27c93f, #1aa32f)';
        
        // Reset form
        this.reset();
        
        // Revert button after 3 seconds
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = ''; // Revert to CSS defined background
        }, 3000);
    });
}
