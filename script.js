document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const pages = {
        page1: document.getElementById('page-1'),
        page2: document.getElementById('page-2'),
        page3: document.getElementById('page-3'),
        page4: document.getElementById('page-4'),
    };
    
    let currentPlayingCard = null;
    let currentAudio = null;

    function showPage(pageId) {
        // Hide all pages
        Object.values(pages).forEach(p => p.classList.remove('active'));
        // Show target page
        pages[pageId].classList.add('active');
        
        // Trigger scroll reveals on page-4 load
        if (pageId === 'page-4') {
            initScrollEffects();
        }
    }

    // --- PAGE 1: DECRYPT MEMORIES VALIDATION ---
    const birthdayInput = document.getElementById('birthday-input');
    const decryptBtn = document.getElementById('decrypt-btn');
    const birthdayError = document.getElementById('birthday-error');
    const correctBirthday = '22/12/2007';

    // Auto format date format input (DD/MM/YYYY)
    birthdayInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // numbers only
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        if (value.length > 5) {
            value = value.substring(0, 5) + '/' + value.substring(5, 9);
        }
        e.target.value = value;
        birthdayError.classList.remove('show');
    });

    decryptBtn.addEventListener('click', () => {
        const inputVal = birthdayInput.value.trim();
        if (inputVal === correctBirthday) {
            // Transition out P1
            const card = document.querySelector('.gate-card');
            card.style.transform = 'scale(0.8) translateY(-50px)';
            card.style.opacity = '0';
            setTimeout(() => {
                showPage('page2');
            }, 600);
        } else {
            // Tremble card on error
            const card = document.querySelector('.gate-card');
            card.classList.add('shake');
            birthdayError.classList.add('show');
            setTimeout(() => {
                card.classList.remove('shake');
            }, 500);
        }
    });

    // --- PAGE 2: STATUTORY WARNING ---
    const warningAgreeBtn = document.getElementById('warning-agree-btn');
    warningAgreeBtn.addEventListener('click', () => {
        const card = document.querySelector('.warning-card');
        card.style.transform = 'scale(0.8) translateY(-50px)';
        card.style.opacity = '0';
        setTimeout(() => {
            showPage('page3');
        }, 600);
    });

    // --- PAGE 3: CONFIRMATION GAME ("NO" buttons escaping) ---
    const noBtn1 = document.getElementById('no-btn-1');
    const noBtn2 = document.getElementById('no-btn-2');
    const yesWrapper = document.getElementById('yes-wrapper');
    const yesBtn = document.getElementById('yes-btn');
    const bubbleText = document.getElementById('bubble-text');

    const cuteRemarks = [
        "No way! Try again! 😜",
        "Oops, too slow! 💨",
        "Are you sure? Try YES! 💖",
        "Nice try, but nope! 🌸",
        "Error 404: NO button unclickable! 🤖",
        "The universe says: YES! ✨",
        "You really want to click NO? 😂",
        "I'm too fast for you! 😸"
    ];

    let noInteractions = 0;

    function handleNoInteraction(button) {
        noInteractions++;
        
        // Randomly reposition the NO button inside options-wrapper boundary box
        const container = document.querySelector('.options-wrapper');
        const containerRect = container.getBoundingClientRect();
        const btnRect = button.getBoundingClientRect();
        
        const maxX = containerRect.width - btnRect.width - 20;
        const maxY = containerRect.height - btnRect.height - 20;
        
        const randX = Math.max(10, Math.floor(Math.random() * maxX));
        const randY = Math.max(10, Math.floor(Math.random() * maxY));
        
        button.classList.add('runaway');
        button.style.left = `${randX}px`;
        button.style.top = `${randY}px`;
        
        // Display bubble text comment
        const randomRemark = cuteRemarks[Math.floor(Math.random() * cuteRemarks.length)];
        bubbleText.innerText = randomRemark;
        bubbleText.parentElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            bubbleText.parentElement.style.transform = 'scale(1)';
        }, 200);

        // Transition in the YES button underneath
        if (noInteractions >= 2) {
            yesWrapper.classList.add('reveal-yes');
        }
    }

    [noBtn1, noBtn2].forEach(btn => {
        btn.addEventListener('mouseover', () => handleNoInteraction(btn));
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleNoInteraction(btn);
        });
    });

    yesBtn.addEventListener('click', () => {
        const card = document.querySelector('.confirmation-card');
        card.style.transform = 'scale(0.8) translateY(-50px)';
        card.style.opacity = '0';
        setTimeout(() => {
            showPage('page4');
        }, 600);
    });


    // --- PAGE 4: LETTER EFFECTS ---
    function initScrollEffects() {
        const cards = document.querySelectorAll('.letter-paragraph-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity = '0.3';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.8s ease-out';
            observer.observe(card);
        });
    }

    // SLAP ACTION
    const slapBtn = document.getElementById('slap-btn');
    slapBtn.addEventListener('click', () => {
        const appContainer = document.getElementById('app-container');
        appContainer.classList.add('shake-screen');
        spawnHeartsBurst(window.innerWidth / 2, window.innerHeight / 2, 70);
        setTimeout(() => {
            appContainer.classList.remove('shake-screen');
        }, 500);
    });


    // --- AUDIO SYSTEM (HTML5 Audio Player) ---
    function stopActivePlayback() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
    }

    function playTrack(url) {
        stopActivePlayback();

        if (url && url.trim() !== "") {
            currentAudio = new Audio(url);
            currentAudio.loop = true;
            currentAudio.volume = 0.7;
            
            currentAudio.play().catch(err => {
                console.error("Audio Playback Error! Verify the song file exists in assets/:", err);
            });
        } else {
            console.warn("No song URL specified in HTML data-url attribute.");
        }
    }

    // Song card click listeners
    const songCards = document.querySelectorAll('.song-card');
    songCards.forEach(card => {
        card.addEventListener('click', () => {
            const customUrl = card.getAttribute('data-url');
            
            if (currentPlayingCard === card) {
                // Toggle off
                card.classList.remove('playing');
                card.querySelector('.play-icon').classList.remove('hidden');
                card.querySelector('.pause-icon').classList.add('hidden');
                stopActivePlayback();
                currentPlayingCard = null;
            } else {
                // Pause currently playing card
                if (currentPlayingCard) {
                    currentPlayingCard.classList.remove('playing');
                    currentPlayingCard.querySelector('.play-icon').classList.remove('hidden');
                    currentPlayingCard.querySelector('.pause-icon').classList.add('hidden');
                }
                
                // Toggle on new track
                card.classList.add('playing');
                card.querySelector('.play-icon').classList.add('hidden');
                card.querySelector('.pause-icon').classList.remove('hidden');
                
                playTrack(customUrl);
                currentPlayingCard = card;
            }
        });
    });


    // --- CANVAS DYNAMIC PARTICLE SYSTEM (Petals & Butterflies) ---
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const elements = [];
    const heartBursts = [];

    // Falling Petal/Star Particle Class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * -height;
            this.size = Math.random() * 8 + 3;
            this.speedY = Math.random() * 1.2 + 0.4;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.02 - 0.01;
            
            // 0 = Tulip Petal, 1 = Snowflake, 2 = Sparkle Star
            this.type = Math.floor(Math.random() * 3);
            this.color = this.type === 0 
                ? `rgba(255, ${Math.floor(Math.random() * 40) + 160}, ${Math.floor(Math.random() * 40) + 170}, 0.6)` 
                : (this.type === 1 ? 'rgba(224, 242, 254, 0.6)' : 'rgba(254, 243, 199, 0.7)');
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > height) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;

            if (this.type === 0) {
                // Petal path
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.size, -this.size, -this.size, this.size, 0, this.size * 1.5);
                ctx.bezierCurveTo(this.size, this.size, this.size, -this.size, 0, 0);
                ctx.fill();
            } else if (this.type === 1) {
                // Snowflake
                ctx.beginPath();
                ctx.lineWidth = 1;
                for (let i = 0; i < 6; i++) {
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, this.size);
                    ctx.rotate(Math.PI / 3);
                }
                ctx.stroke();
            } else {
                // Sparkle Star
                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    ctx.lineTo(0, -this.size);
                    ctx.lineTo(this.size * 0.25, -this.size * 0.25);
                    ctx.rotate(Math.PI / 2);
                }
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Flying Butterfly Particle Class (Runs continuously behind the letter)
    class Butterfly {
        constructor() {
            this.reset();
            this.y = Math.random() * height; // Distribute on startup
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + 50; // Spawn below screen
            this.size = Math.random() * 8 + 6;
            this.speedY = -(Math.random() * 0.8 + 0.5); // float upwards
            this.speedX = Math.random() * 1.2 - 0.6;
            this.angle = 0;
            this.flapSpeed = Math.random() * 0.15 + 0.12;
            this.flapAngle = Math.random() * Math.PI;
            
            // Dreamy pastel colors: pink, gold, cyan, lilac
            const colors = [
                'hsla(343, 90%, 80%, 0.7)',
                'hsla(45, 90%, 75%, 0.7)',
                'hsla(185, 90%, 75%, 0.7)',
                'hsla(275, 90%, 80%, 0.7)'
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.015) * 0.4; // smooth wavy horizontal drift
            this.flapAngle += this.flapSpeed;
            
            this.angle = Math.atan2(this.speedY, this.speedX + Math.sin(this.y * 0.015) * 0.4) + Math.PI / 2;

            if (this.y < -50 || this.x < -50 || this.x > width + 50) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = this.color;
            
            // Wing flapping scaling calculation
            const wingScale = Math.abs(Math.sin(this.flapAngle));
            
            // Left wings
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size * 1.5 * wingScale, -this.size * 0.8, -this.size * 1.5 * wingScale, this.size * 0.8, 0, 0);
            ctx.bezierCurveTo(-this.size * wingScale, this.size * 0.3, -this.size * wingScale, this.size * 1.2, 0, 0);
            ctx.fill();
            
            // Right wings
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(this.size * 1.5 * wingScale, -this.size * 0.8, this.size * 1.5 * wingScale, this.size * 0.8, 0, 0);
            ctx.bezierCurveTo(this.size * wingScale, this.size * 0.3, this.size * wingScale, this.size * 1.2, 0, 0);
            ctx.fill();
            
            // Tiny body outline
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.ellipse(0, 0, 1.2, this.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }

    // Sparkle Hearts Burst on click
    class BurstHeart {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 12 + 6;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * -6 - 2;
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.015;
            this.color = `hsla(${Math.floor(Math.random() * 40) + 330}, 100%, 75%, 0.8)`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += 0.1; // gravity
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, -this.size/4, 0, this.size);
            ctx.bezierCurveTo(this.size, -this.size/4, this.size/2, -this.size/2, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }

    // Spawn elements (50 petals/snowflakes, 18 butterflies)
    for (let i = 0; i < 50; i++) {
        elements.push(new Particle());
    }
    for (let i = 0; i < 18; i++) {
        elements.push(new Butterfly());
    }

    function spawnHeartsBurst(x, y, count = 15) {
        for (let i = 0; i < count; i++) {
            heartBursts.push(new BurstHeart(x, y));
        }
    }

    window.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && !e.target.closest('.song-card')) {
            spawnHeartsBurst(e.clientX, e.clientY);
        }
    });

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw flying elements & butterflies
        elements.forEach(el => {
            el.update();
            el.draw();
        });

        // Draw and update heart bursts
        for (let i = heartBursts.length - 1; i >= 0; i--) {
            const h = heartBursts[i];
            h.update();
            h.draw();
            if (h.alpha <= 0) {
                heartBursts.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
});
