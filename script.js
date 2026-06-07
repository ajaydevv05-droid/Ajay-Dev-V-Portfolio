// Scroll Progress Bar
const progress = document.querySelector('.progress');

window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled =
        (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;

    progress.style.width = scrolled + '%';
});

// Dark / Light Theme Toggle
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');

    if (document.body.classList.contains('light')) {
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        targetSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Reveal Animation on Scroll
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    },
    {
        threshold: 0.1
    }
);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
});

// Navbar Background Change on Scroll
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active Navigation Highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');

        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Typing Effect for Hero Section
const roles = [
    "Full Stack Developer",
    "Angular Developer",
    "Node.js Developer",
    "Web Developer"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

const roleElement = document.querySelector('.typing-role');

function typeEffect() {
    if (!roleElement) return;

    const currentRole = roles[roleIndex];

    if (!deleting) {
        roleElement.textContent =
            currentRole.substring(0, charIndex++);

        if (charIndex > currentRole.length) {
            deleting = true;
            setTimeout(typeEffect, 1500);
            return;
        }
    } else {
        roleElement.textContent =
            currentRole.substring(0, charIndex--);

        if (charIndex < 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typeEffect, deleting ? 50 : 100);
}

typeEffect();

// Contact Form Validation
const contactForm = document.querySelector('#contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        const name =
            document.querySelector('#name').value.trim();

        const email =
            document.querySelector('#email').value.trim();

        const message =
            document.querySelector('#message').value.trim();

        if (!name || !email || !message) {
            alert('Please fill all required fields.');
            return;
        }

        alert('Message submitted successfully!');

        contactForm.reset();
    });
}