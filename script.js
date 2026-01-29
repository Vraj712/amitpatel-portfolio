/* script.js */

// 1. LOADER LOGIC
window.addEventListener("load", () => {
    const loader = document.getElementById("preloader");
    const bar = document.querySelector(".loading-bar-fill");
    const percent = document.querySelector(".loading-percent");
    let progress = 0;

    const interval = setInterval(() => {
        progress += 1;
        bar.style.width = progress + "%";
        percent.textContent = progress + "%";
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = "0";
                setTimeout(() => loader.style.display = "none", 800);
            }, 500);
        }
    }, 20);
});

// 2. HERO BACKGROUND (Connecting Nodes Animation)
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
        ctx.fillStyle = "rgba(15, 23, 42, 0.2)"; // Navy dots
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < 50; i++) particlesArray.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Connect dots
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(15, 23, 42, ${0.1 - distance/1500})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// 3. 3D TILT EFFECT FOR CARDS
const tiltElements = document.querySelectorAll(".tilt-element");

tiltElements.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    });
});

// 4. SCROLL REVEAL OBSERVER
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Trigger Counter if it's the stats bar
            if(entry.target.classList.contains("counter")) {
               // Logic handled below
            }
        }
    });
});
document.querySelectorAll(".scroll-trigger").forEach(el => observer.observe(el));

// 5. STATS COUNTER
const counters = document.querySelectorAll('.counter');
let started = false;

window.addEventListener('scroll', () => {
    if(window.scrollY > 300 && !started) {
        started = true;
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const increment = target / 50;
            let c = 0;
            const updateCounter = () => {
                c += increment;
                if(c < target) {
                    counter.innerText = Math.ceil(c);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + "+";
                }
            };
            updateCounter();
        });
    }
});