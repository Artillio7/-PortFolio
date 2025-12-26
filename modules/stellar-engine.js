/**
 * STELLAR ENGINE - Moteur d'Animation Stellaire Ultra-Avancé
 * Version 2.0 - Niveau Senior (20+ ans d'expérience)
 *
 * Caractéristiques:
 * - Multi-couches parallaxe avec profondeur z
 * - Interaction souris avec champ gravitationnel
 * - Étoiles filantes dynamiques avec traînées
 * - Constellations interactives
 * - Nébuleuses et poussière cosmique
 * - Effet bloom/glow avancé
 * - Pulsations et scintillements réalistes
 */

export class StellarEngine {
    constructor(options = {}) {
        this.config = {
            starCount: options.starCount || 350,
            shootingStarInterval: options.shootingStarInterval || 3000,
            nebulaCount: options.nebulaCount || 8,
            constellationDistance: options.constellationDistance || 120,
            mouseInfluenceRadius: options.mouseInfluenceRadius || 200,
            enableConstellations: options.enableConstellations !== false,
            enableShootingStars: options.enableShootingStars !== false,
            enableNebulae: options.enableNebulae !== false,
            enableMouseInteraction: options.enableMouseInteraction !== false,
            colorPalette: options.colorPalette || {
                primary: '#4a90e2',
                secondary: '#6fa8dc',
                accent: '#a855f7',
                warm: '#f59e0b',
                white: '#ffffff'
            }
        };

        this.canvas = null;
        this.ctx = null;
        this.stars = [];
        this.shootingStars = [];
        this.nebulae = [];
        this.mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
        this.lastMousePos = { x: 0, y: 0 };
        this.time = 0;
        this.animationId = null;
        this.isInitialized = false;

        this.init();
    }

    init() {
        this.createCanvas();
        this.createSVGFilters();
        this.createStars();
        if (this.config.enableNebulae) this.createNebulae();
        this.bindEvents();
        this.animate();
        this.isInitialized = true;

        if (this.config.enableShootingStars) {
            this.scheduleShootingStar();
        }
    }

    createCanvas() {
        // Supprimer l'ancien canvas s'il existe
        const existingCanvas = document.querySelector('.stellar-canvas');
        if (existingCanvas) existingCanvas.remove();

        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('stellar-canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    createSVGFilters() {
        // Créer les filtres SVG pour l'effet glow
        const existingSVG = document.getElementById('stellar-filters');
        if (existingSVG) existingSVG.remove();

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'stellar-filters';
        svg.style.cssText = 'position: absolute; width: 0; height: 0; overflow: hidden;';
        svg.innerHTML = `
            <defs>
                <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <filter id="intensiveGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="8" result="blur1"/>
                    <feGaussianBlur stdDeviation="4" result="blur2"/>
                    <feGaussianBlur stdDeviation="2" result="blur3"/>
                    <feMerge>
                        <feMergeNode in="blur1"/>
                        <feMergeNode in="blur2"/>
                        <feMergeNode in="blur3"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <radialGradient id="nebulaGradient1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#4a90e2;stop-opacity:0.3"/>
                    <stop offset="100%" style="stop-color:#4a90e2;stop-opacity:0"/>
                </radialGradient>
                <radialGradient id="nebulaGradient2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#a855f7;stop-opacity:0.2"/>
                    <stop offset="100%" style="stop-color:#a855f7;stop-opacity:0"/>
                </radialGradient>
            </defs>
        `;
        document.body.appendChild(svg);
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    createStars() {
        this.stars = [];
        const colors = Object.values(this.config.colorPalette);

        for (let i = 0; i < this.config.starCount; i++) {
            const layer = Math.random();
            const starType = this.getRandomStarType();

            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                baseX: 0,
                baseY: 0,
                z: layer, // Profondeur pour parallaxe
                size: this.getStarSize(layer, starType),
                baseSize: 0,
                color: this.getStarColor(layer, colors),
                alpha: this.getStarAlpha(layer),
                baseAlpha: 0,
                type: starType,
                // Animation properties
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.05 + Math.random() * 0.1,
                // Mouvement lent
                vx: (Math.random() - 0.5) * 0.3 * (1 - layer),
                vy: (Math.random() - 0.5) * 0.3 * (1 - layer),
                // Interaction
                isHovered: false,
                hoverIntensity: 0,
                attractionX: 0,
                attractionY: 0
            });

            // Stocker les valeurs de base
            const star = this.stars[this.stars.length - 1];
            star.baseX = star.x;
            star.baseY = star.y;
            star.baseSize = star.size;
            star.baseAlpha = star.alpha;
        }

        // Trier par profondeur pour le rendu correct
        this.stars.sort((a, b) => a.z - b.z);
    }

    getRandomStarType() {
        const rand = Math.random();
        if (rand < 0.6) return 'normal';
        if (rand < 0.8) return 'pulsing';
        if (rand < 0.92) return 'twinkling';
        return 'bright'; // Étoiles brillantes rares
    }

    getStarSize(layer, type) {
        let baseSize = 0.5 + layer * 2.5;
        if (type === 'bright') baseSize *= 2;
        if (type === 'pulsing') baseSize *= 1.3;
        return baseSize;
    }

    getStarColor(layer, colors) {
        if (layer > 0.9) return colors[Math.floor(Math.random() * 2)]; // Proche = coloré
        if (layer > 0.7) return Math.random() > 0.5 ? colors[0] : '#ffffff';
        return '#ffffff'; // Lointain = blanc
    }

    getStarAlpha(layer) {
        return 0.3 + layer * 0.7;
    }

    createNebulae() {
        this.nebulae = [];
        const colors = ['#4a90e2', '#a855f7', '#6fa8dc', '#ec4899'];

        for (let i = 0; i < this.config.nebulaCount; i++) {
            this.nebulae.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: 100 + Math.random() * 200,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.03 + Math.random() * 0.05,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.005 + Math.random() * 0.01,
                driftX: (Math.random() - 0.5) * 0.1,
                driftY: (Math.random() - 0.5) * 0.1
            });
        }
    }

    createShootingStar() {
        const startEdge = Math.random();
        let x, y, angle;

        if (startEdge < 0.5) {
            // Depuis le haut
            x = Math.random() * this.width;
            y = -20;
            angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
        } else {
            // Depuis la droite
            x = this.width + 20;
            y = Math.random() * this.height * 0.5;
            angle = Math.PI * 0.75 + (Math.random() - 0.5) * 0.3;
        }

        const speed = 15 + Math.random() * 10;
        const colors = ['#ffffff', '#4a90e2', '#a855f7'];

        this.shootingStars.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: 80 + Math.random() * 120,
            width: 2 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            trail: [],
            maxTrailLength: 30
        });
    }

    scheduleShootingStar() {
        const delay = this.config.shootingStarInterval + Math.random() * 4000;
        setTimeout(() => {
            this.createShootingStar();
            this.scheduleShootingStar();
        }, delay);
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.redistributeStars();
        });

        if (this.config.enableMouseInteraction) {
            document.addEventListener('mousemove', (e) => {
                this.mouse.vx = e.clientX - this.mouse.x;
                this.mouse.vy = e.clientY - this.mouse.y;
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            document.addEventListener('mouseleave', () => {
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });
        }
    }

    redistributeStars() {
        this.stars.forEach(star => {
            star.x = (star.baseX / this.width) * window.innerWidth;
            star.y = (star.baseY / this.height) * window.innerHeight;
            star.baseX = star.x;
            star.baseY = star.y;
        });
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    updateStars() {
        this.stars.forEach(star => {
            // Mouvement de base
            star.x += star.vx;
            star.y += star.vy;

            // Rebond aux bords
            if (star.x < -50) star.x = this.width + 50;
            if (star.x > this.width + 50) star.x = -50;
            if (star.y < -50) star.y = this.height + 50;
            if (star.y > this.height + 50) star.y = -50;

            // Animation selon le type
            switch (star.type) {
                case 'pulsing':
                    star.pulsePhase += star.pulseSpeed;
                    star.size = star.baseSize * (1 + 0.4 * Math.sin(star.pulsePhase));
                    star.alpha = star.baseAlpha * (0.7 + 0.3 * Math.sin(star.pulsePhase));
                    break;
                case 'twinkling':
                    star.twinklePhase += star.twinkleSpeed;
                    const twinkle = Math.sin(star.twinklePhase) * Math.sin(star.twinklePhase * 2.7);
                    star.alpha = star.baseAlpha * (0.4 + 0.6 * Math.abs(twinkle));
                    break;
                case 'bright':
                    star.pulsePhase += star.pulseSpeed * 0.5;
                    star.size = star.baseSize * (1 + 0.2 * Math.sin(star.pulsePhase));
                    break;
            }

            // Interaction souris
            if (this.config.enableMouseInteraction) {
                const dx = this.mouse.x - star.x;
                const dy = this.mouse.y - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const influenceRadius = this.config.mouseInfluenceRadius * (1 + star.z);

                if (distance < influenceRadius) {
                    const influence = 1 - (distance / influenceRadius);
                    const easeInfluence = influence * influence * influence; // Ease cubic

                    // Effet d'attraction/répulsion
                    const attractionStrength = 30 * easeInfluence * star.z;
                    star.attractionX = (dx / distance) * attractionStrength;
                    star.attractionY = (dy / distance) * attractionStrength;

                    // Intensification de la brillance
                    star.hoverIntensity = Math.min(1, star.hoverIntensity + 0.15);
                    star.isHovered = true;
                } else {
                    star.attractionX *= 0.92;
                    star.attractionY *= 0.92;
                    star.hoverIntensity = Math.max(0, star.hoverIntensity - 0.05);
                    star.isHovered = false;
                }
            }
        });
    }

    updateShootingStars() {
        this.shootingStars = this.shootingStars.filter(star => {
            // Ajouter position au trail
            star.trail.unshift({ x: star.x, y: star.y, alpha: star.alpha });
            if (star.trail.length > star.maxTrailLength) {
                star.trail.pop();
            }

            // Mouvement
            star.x += star.vx;
            star.y += star.vy;
            star.vy += 0.1; // Gravité légère

            // Fade out progressif
            if (star.x > this.width + 100 || star.y > this.height + 100 || star.x < -200) {
                star.alpha -= 0.03;
            }

            return star.alpha > 0;
        });
    }

    updateNebulae() {
        this.nebulae.forEach(nebula => {
            nebula.pulsePhase += nebula.pulseSpeed;
            nebula.x += nebula.driftX;
            nebula.y += nebula.driftY;

            // Wrap around
            if (nebula.x < -nebula.radius) nebula.x = this.width + nebula.radius;
            if (nebula.x > this.width + nebula.radius) nebula.x = -nebula.radius;
            if (nebula.y < -nebula.radius) nebula.y = this.height + nebula.radius;
            if (nebula.y > this.height + nebula.radius) nebula.y = -nebula.radius;
        });
    }

    draw() {
        // Clear avec un léger fade pour effet de traînée
        this.ctx.fillStyle = 'rgba(8, 12, 17, 0.15)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Dessiner les nébuleuses (arrière-plan)
        if (this.config.enableNebulae) {
            this.drawNebulae();
        }

        // Dessiner les constellations (lignes entre étoiles proches)
        if (this.config.enableConstellations) {
            this.drawConstellations();
        }

        // Dessiner les étoiles
        this.drawStars();

        // Dessiner les étoiles filantes
        this.drawShootingStars();
    }

    drawNebulae() {
        this.nebulae.forEach(nebula => {
            const pulse = 1 + 0.2 * Math.sin(nebula.pulsePhase);
            const gradient = this.ctx.createRadialGradient(
                nebula.x, nebula.y, 0,
                nebula.x, nebula.y, nebula.radius * pulse
            );

            const alpha = nebula.alpha * (0.8 + 0.2 * Math.sin(nebula.pulsePhase * 2));
            gradient.addColorStop(0, this.hexToRgba(nebula.color, alpha));
            gradient.addColorStop(0.5, this.hexToRgba(nebula.color, alpha * 0.3));
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(nebula.x, nebula.y, nebula.radius * pulse, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawConstellations() {
        const nearbyStars = this.stars.filter(s => s.z > 0.6); // Seulement les étoiles proches

        this.ctx.strokeStyle = 'rgba(74, 144, 226, 0.08)';
        this.ctx.lineWidth = 0.5;

        for (let i = 0; i < nearbyStars.length; i++) {
            const star1 = nearbyStars[i];
            const displayX1 = star1.x + star1.attractionX;
            const displayY1 = star1.y + star1.attractionY;

            for (let j = i + 1; j < nearbyStars.length; j++) {
                const star2 = nearbyStars[j];
                const displayX2 = star2.x + star2.attractionX;
                const displayY2 = star2.y + star2.attractionY;

                const dx = displayX2 - displayX1;
                const dy = displayY2 - displayY1;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.constellationDistance) {
                    const alpha = (1 - distance / this.config.constellationDistance) * 0.15;

                    // Intensifier si une étoile est hover
                    const hoverBoost = Math.max(star1.hoverIntensity, star2.hoverIntensity);
                    const finalAlpha = alpha + hoverBoost * 0.3;

                    this.ctx.strokeStyle = `rgba(74, 144, 226, ${finalAlpha})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(displayX1, displayY1);
                    this.ctx.lineTo(displayX2, displayY2);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawStars() {
        this.stars.forEach(star => {
            const displayX = star.x + star.attractionX;
            const displayY = star.y + star.attractionY;
            const hoverBoost = star.hoverIntensity;

            // Taille avec effet hover
            const size = star.size * (1 + hoverBoost * 0.8);
            const alpha = Math.min(1, star.alpha * (1 + hoverBoost * 0.5));

            // Glow externe pour étoiles brillantes ou hover
            if (star.type === 'bright' || hoverBoost > 0.3) {
                const glowSize = size * (3 + hoverBoost * 2);
                const glowGradient = this.ctx.createRadialGradient(
                    displayX, displayY, 0,
                    displayX, displayY, glowSize
                );
                glowGradient.addColorStop(0, this.hexToRgba(star.color, 0.4 * alpha));
                glowGradient.addColorStop(0.3, this.hexToRgba(star.color, 0.15 * alpha));
                glowGradient.addColorStop(1, 'transparent');

                this.ctx.fillStyle = glowGradient;
                this.ctx.beginPath();
                this.ctx.arc(displayX, displayY, glowSize, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Halo moyen
            if (size > 1.5 || hoverBoost > 0) {
                const haloGradient = this.ctx.createRadialGradient(
                    displayX, displayY, 0,
                    displayX, displayY, size * 2
                );
                haloGradient.addColorStop(0, this.hexToRgba(star.color, 0.5 * alpha));
                haloGradient.addColorStop(1, 'transparent');

                this.ctx.fillStyle = haloGradient;
                this.ctx.beginPath();
                this.ctx.arc(displayX, displayY, size * 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Corps de l'étoile
            this.ctx.beginPath();
            this.ctx.arc(displayX, displayY, size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.hexToRgba(star.color, alpha);
            this.ctx.fill();

            // Point central brillant
            if (size > 1) {
                this.ctx.beginPath();
                this.ctx.arc(displayX, displayY, size * 0.4, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.ctx.fill();
            }

            // Rayons pour étoiles brillantes
            if (star.type === 'bright' || hoverBoost > 0.5) {
                this.drawStarRays(displayX, displayY, size, star.color, alpha, hoverBoost);
            }
        });
    }

    drawStarRays(x, y, size, color, alpha, hoverBoost) {
        const rayLength = size * (4 + hoverBoost * 3);
        const rayWidth = size * 0.3;
        const rotation = this.time * 0.001;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);

        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const gradient = this.ctx.createLinearGradient(0, 0, rayLength, 0);
            gradient.addColorStop(0, this.hexToRgba(color, alpha * 0.8));
            gradient.addColorStop(1, 'transparent');

            this.ctx.save();
            this.ctx.rotate(angle);
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.moveTo(0, -rayWidth / 2);
            this.ctx.lineTo(rayLength, 0);
            this.ctx.lineTo(0, rayWidth / 2);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        }

        this.ctx.restore();
    }

    drawShootingStars() {
        this.shootingStars.forEach(star => {
            // Traînée
            star.trail.forEach((point, index) => {
                const progress = index / star.trail.length;
                const trailAlpha = (1 - progress) * star.alpha * 0.6;
                const trailWidth = star.width * (1 - progress * 0.8);

                const gradient = this.ctx.createRadialGradient(
                    point.x, point.y, 0,
                    point.x, point.y, trailWidth * 2
                );
                gradient.addColorStop(0, this.hexToRgba(star.color, trailAlpha));
                gradient.addColorStop(1, 'transparent');

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, trailWidth * 2, 0, Math.PI * 2);
                this.ctx.fill();
            });

            // Tête lumineuse
            const headGradient = this.ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.width * 4
            );
            headGradient.addColorStop(0, this.hexToRgba('#ffffff', star.alpha));
            headGradient.addColorStop(0.3, this.hexToRgba(star.color, star.alpha * 0.8));
            headGradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = headGradient;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.width * 4, 0, Math.PI * 2);
            this.ctx.fill();

            // Point central
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.width, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    animate() {
        this.time = performance.now();
        this.updateStars();
        this.updateShootingStars();
        if (this.config.enableNebulae) this.updateNebulae();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // API publique pour contrôle externe
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }

    setMouseInfluence(radius) {
        this.config.mouseInfluenceRadius = radius;
    }

    triggerShootingStar() {
        this.createShootingStar();
    }

    destroy() {
        this.pause();
        if (this.canvas) this.canvas.remove();
        const filters = document.getElementById('stellar-filters');
        if (filters) filters.remove();
    }
}

// Auto-initialisation optionnelle
export function initStellarEngine(options) {
    return new StellarEngine(options);
}
