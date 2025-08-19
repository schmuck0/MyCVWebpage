document.addEventListener("DOMContentLoaded", () => {
    // --- Scroll Animations Logic ---
    const scrollElements = document.querySelectorAll('.scroll-animate');

    const elementInView = (el, offset = 0) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <=
            (window.innerHeight || document.documentElement.clientHeight) - offset
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const handleScrollAnimations = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 50)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimations();
    });

    handleScrollAnimations(); // Initial check on page load


    // --- Confetti Effect Logic ---
    function createConfetti(x, y) {
        // Create a new canvas for the confetti
        const confettiCanvas = document.createElement('canvas');
        confettiCanvas.id = 'confetti-canvas';
        confettiCanvas.style.position = 'fixed';
        confettiCanvas.style.top = '0';
        confettiCanvas.style.left = '0';
        confettiCanvas.style.pointerEvents = 'none';
        confettiCanvas.style.zIndex = '1000';
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        document.body.appendChild(confettiCanvas);
        const ctx = confettiCanvas.getContext('2d');

        const colors = ["#ff6347", "#ffa500", "#ffd700", "#adff2f", "#40e0d0", "#1e90ff", "#ee82ee"];
        const particles = [];
        const particleCount = 100;
        const gravity = 0.08;
        const initialVelocity = -6;

        // Function to draw different shapes
        function drawShape(p) {
            ctx.beginPath();
            if (p.shape === 'circle') {
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            } else if (p.shape === 'triangle') {
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + p.size, p.y + p.size * 2);
                ctx.lineTo(p.x - p.size, p.y + p.size * 2);
                ctx.closePath();
                ctx.fillStyle = p.color;
                ctx.fill();
            } else { // 'square'
                ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            }
        }

        // Create confetti particles, starting from the given coordinates
        for (let i = 0; i < particleCount; i++) {
            const shapes = ['square', 'circle', 'triangle'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            particles.push({
                x: x,
                y: y,
                size: Math.random() * 5 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: shape,
                velocity: {
                    x: (Math.random() - 0.5) * 8, // More horizontal spread
                    y: initialVelocity
                },
                rotation: Math.random() * 360,
                opacity: 1
            });
        }

        function animateConfetti() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            let particlesLeft = false;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                if (p.opacity <= 0 || p.y > window.innerHeight) continue;

                particlesLeft = true;
                p.velocity.y += gravity;
                p.x += p.velocity.x;
                p.y += p.velocity.y;
                p.opacity -= 0.005; // Adjust this value to change the duration. Smaller = longer duration.
                p.rotation += p.velocity.x * 2; // More subtle spinning

                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                drawShape(p);
                ctx.restore();
            }

            if (particlesLeft) {
                requestAnimationFrame(animateConfetti);
            } else {
                confettiCanvas.remove();
            }
        }

        animateConfetti();
    }


    // --- Typewriter Effect Logic ---
    const typewriterElements = [
        { id: 'typewriter-name', delay: 100 },
        { id: 'typewriter-subtitle', delay: 500 },
        { id: 'typewriter-about', delay: 1500 }
    ];

    function typeWriter(element, text, delay) {
        if (!element) return;
        element.textContent = '';
        let i = 0;
        const speed = 50; // milliseconds
        
        setTimeout(() => {
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            type();
        }, delay);
    }

    typewriterElements.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) {
            const text = element.getAttribute('data-text');
            typeWriter(element, text, item.delay);
        }
    });

    // --- Theme Persistence Logic ---
    const savedTheme = localStorage.getItem('theme');
    const toggle = document.getElementById('theme-toggle');

    if (savedTheme) {
        document.body.classList.add(savedTheme);
        if (toggle) {
            toggle.textContent = savedTheme === 'dark-mode' ? "☀️ Light Mode" : "🌙 Dark Mode";
        }
    }

    // --- Background Effect Logic ---
    const canvas = document.getElementById('background-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const numParticles = 100;
        let animationFrameId = null;

        const getParticleColor = () => {
            const isDarkMode = document.body.classList.contains('dark-mode');
            return isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)';
        };

        const setupParticles = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            particles = [];
            const particleColor = getParticleColor();
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 0.8,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    color: particleColor
                });
            }
        };

        const drawParticle = (particle) => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            ctx.closePath();
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x > canvas.width + p.radius) p.x = -p.radius;
                else if (p.x < -p.radius) p.x = canvas.width + p.radius;
                if (p.y > canvas.height + p.radius) p.y = -p.radius;
                else if (p.y < -p.radius) p.y = canvas.height + p.radius;

                drawParticle(p);
            });
        };

        window.addEventListener('resize', setupParticles);
        setupParticles();
        animate();
    }


    // --- Modal Logic ---
    const cards = document.querySelectorAll(".card[data-target]");
    cards.forEach(card => {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            const modalId = card.dataset.target;
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.add("open");
        });
    });

    const closeButtons = document.querySelectorAll(".modal-close");
    closeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const modal = btn.closest(".modal");
            if (modal) modal.classList.remove("open");
            
            // Trigger confetti effect from the button's position
            createConfetti(e.clientX, e.clientY);
        });
    });

    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("open");
                // Trigger confetti effect from the mouse click position
                createConfetti(e.clientX, e.clientY);
            }
        });
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            const openModals = document.querySelectorAll(".modal.open");
            if (openModals.length > 0) {
                openModals.forEach(m => m.classList.remove("open"));
                // Trigger confetti effect from the center of the screen
                createConfetti(window.innerWidth / 2, window.innerHeight / 2);
            }
        }
    });

    // --- Dark / Light mode toggle (updated) ---
    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            
            localStorage.setItem('theme', isDarkMode ? 'dark-mode' : 'light-mode');

            if (canvas) {
                setupParticles();
            }

            toggle.textContent = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
        });
    }
});
