// --- 1. 自定义发光鼠标追踪器 ---
const cursor = document.querySelector('.cursor-glow');
const interactables = document.querySelectorAll('a, button, .product-card');

document.addEventListener('mousemove', (e) => {
    // 使用 requestAnimationFrame 或直接轻微跟随（GSAP效果更好，这里简单实现）
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
    });
});


// --- 2. 动态网格点+流光背景 Canvas ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (canvas) {
        canvas.width = width;
        canvas.height = height;
    }
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
    }

    draw() {
        ctx.fillStyle = `rgba(204, 255, 0, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.floor((width * height) / 15000);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 - distance / 3000})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

if (canvas) {
    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });
    resize();
    initParticles();
    animateParticles();
}

// --- 3. Hero Section 3D 图片视角跟随 ---
const heroDisplay = document.querySelector('.paddle-display');
const heroSection = document.querySelector('.hero');

if (heroSection && heroDisplay) {
    heroSection.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        heroDisplay.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
        heroDisplay.style.transform = `rotateY(0deg) rotateX(0deg)`;
        heroDisplay.style.transition = 'transform 0.5s ease';
    });

    heroSection.addEventListener('mouseenter', () => {
        heroDisplay.style.transition = 'none';
    });
}

// --- 4. 引入 GSAP 做入场动画 ---
document.addEventListener("DOMContentLoaded", (event) => {
    if (typeof gsap !== 'undefined') {
        gsap.from(".navbar", { y: -100, opacity: 0, duration: 1, ease: "power3.out" });

        const heroTl = gsap.timeline();
        heroTl.from(".sub-headline", { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.2")
            .from(".main-headline", { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
            .from(".hero-desc", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
            .from(".hero-btns a", { y: 20, opacity: 0, duration: 0.5, stagger: 0.2 }, "-=0.4")
            .from(".paddle-display", { x: 100, opacity: 0, rotation: 15, duration: 1.5, ease: "elastic.out(1, 0.7)" }, "-=1");

        const productCards = document.querySelectorAll('.product-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.fromTo(entry.target,
                        { y: 100, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
                    );
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        productCards.forEach(card => {
            card.style.opacity = '0';
            observer.observe(card);
        });
    }
});

// --- 5. PDF.js 动态渲染 Base64 PDF Logo (绕过跨域限制) ---
document.addEventListener('DOMContentLoaded', () => {
    if (typeof pdfjsLib === 'undefined' || typeof pdfBase64 === 'undefined') return;

    const logoCanvas = document.getElementById('pdf-logo-canvas');
    if (!logoCanvas) return;
    const fallbackText = document.getElementById('fallback-logo-text');
    const logoCtx = logoCanvas.getContext('2d');

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // 解码 Base64 并转换为 Uint8Array 以供 pdf.js 读取
    const pdfData = atob(pdfBase64);
    const pdfArray = new Uint8Array(pdfData.length);
    for (let i = 0; i < pdfData.length; i++) {
        pdfArray[i] = pdfData.charCodeAt(i);
    }

    pdfjsLib.getDocument({ data: pdfArray }).promise.then(pdf => {
        return pdf.getPage(1);
    }).then(page => {
        const scale = 3.0;
        const viewport = page.getViewport({ scale: scale });

        logoCanvas.height = viewport.height;
        logoCanvas.width = viewport.width;

        const renderContext = {
            canvasContext: logoCtx,
            viewport: viewport
        };

        return page.render(renderContext).promise;
    }).then(() => {
        logoCanvas.style.display = 'block';
        if (fallbackText) fallbackText.style.display = 'none';
        logoCanvas.style.height = '40px';
        logoCanvas.style.width = 'auto';
    }).catch(err => {
        console.warn('PDF Logo render failed, fallback to text logo:', err);
    });
});
