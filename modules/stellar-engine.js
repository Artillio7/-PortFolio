/**
 * STELLAR ENGINE - Moteur d'Animation Stellaire Ultra-Avancé
 * Version 3.0 - Geek Edition avec Constellations Cachées
 *
 * Caractéristiques:
 * - Multi-couches parallaxe avec profondeur z
 * - Interaction souris avec champ gravitationnel
 * - Étoiles filantes dynamiques avec traînées
 * - NOUVEAU: Constellations geek cachées (</>, { }, 01)
 * - NOUVEAU: Intensité réduite en zone hero
 * - NOUVEAU: Messages révélés au survol
 * - Nébuleuses et poussière cosmique
 * - Effet bloom/glow avancé
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
            enableGeekConstellations: options.enableGeekConstellations !== false,
            heroZoneDimming: options.heroZoneDimming || 0.4, // Réduction intensité zone hero
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
        this.geekConstellations = [];
        this.activeConstellation = null;
        this.constellationRevealProgress = 0;
        this.mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
        this.time = 0;
        this.animationId = null;
        this.shootingStarTimeoutId = null;
        this.isInitialized = false;
        this.heroHeight = window.innerHeight;

        this.init();
    }

    init() {
        // Respect user preference for reduced motion
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.createCanvas();
        this.createSVGFilters();
        this.createStars();
        if (this.config.enableNebulae) this.createNebulae();
        if (this.config.enableGeekConstellations) this.createGeekConstellations();
        this.bindEvents();

        if (this.reducedMotion) {
            // Draw a single static frame for reduced-motion users
            this.time = performance.now();
            this.draw();
        } else {
            this.animate();
        }
        this.isInitialized = true;

        if (this.config.enableShootingStars && !this.reducedMotion) {
            this.scheduleShootingStar();
        }
    }

    createCanvas() {
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
        if (!this.ctx) return;
        this.resize();
    }

    createSVGFilters() {
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
                <filter id="constellationGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="6" result="blur"/>
                    <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
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
        this.heroHeight = window.innerHeight;
    }

    // ============================================
    // GEEK CONSTELLATIONS - Easter Eggs Cachés
    // ============================================
    createGeekConstellations() {
        this.geekConstellations = [];

        // Définir les symboles geek avec leurs points
        const symbols = [
            {
                name: 'code-brackets',
                message: '< / >',
                points: this.createCodeBracketsPoints(),
                color: '#4a90e2',
                zone: { x: 0.1, y: 0.2, w: 0.25, h: 0.5 }
            },
            {
                name: 'curly-braces',
                message: '{ }',
                points: this.createCurlyBracesPoints(),
                color: '#a855f7',
                zone: { x: 0.7, y: 0.15, w: 0.25, h: 0.5 }
            },
            {
                name: 'binary',
                message: '01',
                points: this.createBinaryPoints(),
                color: '#10b981',
                zone: { x: 0.35, y: 0.6, w: 0.3, h: 0.35 }
            },
            {
                name: 'terminal',
                message: '>_',
                points: this.createTerminalPoints(),
                color: '#f59e0b',
                zone: { x: 0.05, y: 0.7, w: 0.2, h: 0.25 }
            },
            {
                name: 'hashtag',
                message: '#DEV',
                points: this.createHashtagPoints(),
                color: '#ec4899',
                zone: { x: 0.75, y: 0.65, w: 0.2, h: 0.3 }
            }
        ];

        symbols.forEach(symbol => {
            const constellation = {
                name: symbol.name,
                message: symbol.message,
                color: symbol.color,
                stars: [],
                connections: [],
                isRevealed: false,
                revealProgress: 0,
                zone: symbol.zone,
                centerX: 0,
                centerY: 0
            };

            // Calculer le centre de la zone
            const zoneX = symbol.zone.x * this.width;
            const zoneY = symbol.zone.y * this.heroHeight;
            const zoneW = symbol.zone.w * this.width;
            const zoneH = symbol.zone.h * this.heroHeight;

            constellation.centerX = zoneX + zoneW / 2;
            constellation.centerY = zoneY + zoneH / 2;

            // Créer les étoiles de la constellation
            symbol.points.forEach((point, index) => {
                const star = {
                    x: zoneX + point.x * zoneW,
                    y: zoneY + point.y * zoneH,
                    baseX: zoneX + point.x * zoneW,
                    baseY: zoneY + point.y * zoneH,
                    size: 2 + Math.random() * 1.5,
                    baseSize: 2 + Math.random() * 1.5,
                    alpha: 0.15, // Très faible au départ
                    baseAlpha: 0.15,
                    targetAlpha: 0.9,
                    color: symbol.color,
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.03 + Math.random() * 0.02,
                    index: index,
                    isConstellation: true
                };
                constellation.stars.push(star);
            });

            // Créer les connexions entre étoiles
            if (symbol.points.length > 1) {
                for (let i = 0; i < symbol.points.length - 1; i++) {
                    if (symbol.points[i].connectTo !== undefined) {
                        constellation.connections.push({
                            from: i,
                            to: symbol.points[i].connectTo
                        });
                    } else {
                        constellation.connections.push({
                            from: i,
                            to: i + 1
                        });
                    }
                }
            }

            this.geekConstellations.push(constellation);
        });
    }

    // Points pour < / >
    createCodeBracketsPoints() {
        return [
            // <
            { x: 0.15, y: 0.3 },
            { x: 0.05, y: 0.5, connectTo: 0 },
            { x: 0.15, y: 0.7, connectTo: 1 },
            // /
            { x: 0.35, y: 0.7, connectTo: null },
            { x: 0.45, y: 0.3, connectTo: 3 },
            // >
            { x: 0.65, y: 0.3, connectTo: null },
            { x: 0.75, y: 0.5, connectTo: 5 },
            { x: 0.65, y: 0.7, connectTo: 6 }
        ];
    }

    // Points pour { }
    createCurlyBracesPoints() {
        return [
            // {
            { x: 0.2, y: 0.2 },
            { x: 0.1, y: 0.3, connectTo: 0 },
            { x: 0.1, y: 0.45, connectTo: 1 },
            { x: 0.0, y: 0.5, connectTo: 2 },
            { x: 0.1, y: 0.55, connectTo: 3 },
            { x: 0.1, y: 0.7, connectTo: 4 },
            { x: 0.2, y: 0.8, connectTo: 5 },
            // }
            { x: 0.8, y: 0.2, connectTo: null },
            { x: 0.9, y: 0.3, connectTo: 7 },
            { x: 0.9, y: 0.45, connectTo: 8 },
            { x: 1.0, y: 0.5, connectTo: 9 },
            { x: 0.9, y: 0.55, connectTo: 10 },
            { x: 0.9, y: 0.7, connectTo: 11 },
            { x: 0.8, y: 0.8, connectTo: 12 }
        ];
    }

    // Points pour 01 (binaire)
    createBinaryPoints() {
        return [
            // 0
            { x: 0.15, y: 0.2 },
            { x: 0.25, y: 0.2, connectTo: 0 },
            { x: 0.3, y: 0.35, connectTo: 1 },
            { x: 0.3, y: 0.65, connectTo: 2 },
            { x: 0.25, y: 0.8, connectTo: 3 },
            { x: 0.15, y: 0.8, connectTo: 4 },
            { x: 0.1, y: 0.65, connectTo: 5 },
            { x: 0.1, y: 0.35, connectTo: 6 },
            { x: 0.15, y: 0.2, connectTo: 7 },
            // 1
            { x: 0.55, y: 0.3, connectTo: null },
            { x: 0.65, y: 0.2, connectTo: 9 },
            { x: 0.65, y: 0.8, connectTo: 10 },
            { x: 0.55, y: 0.8, connectTo: null },
            { x: 0.75, y: 0.8, connectTo: 12 }
        ];
    }

    // Points pour >_ (terminal)
    createTerminalPoints() {
        return [
            // >
            { x: 0.1, y: 0.2 },
            { x: 0.4, y: 0.5, connectTo: 0 },
            { x: 0.1, y: 0.8, connectTo: 1 },
            // _
            { x: 0.5, y: 0.8, connectTo: null },
            { x: 0.9, y: 0.8, connectTo: 3 }
        ];
    }

    // Points pour # (hashtag)
    createHashtagPoints() {
        return [
            // Lignes verticales
            { x: 0.35, y: 0.1 },
            { x: 0.3, y: 0.9, connectTo: 0 },
            { x: 0.65, y: 0.1, connectTo: null },
            { x: 0.7, y: 0.9, connectTo: 2 },
            // Lignes horizontales
            { x: 0.1, y: 0.35, connectTo: null },
            { x: 0.9, y: 0.3, connectTo: 4 },
            { x: 0.1, y: 0.65, connectTo: null },
            { x: 0.9, y: 0.7, connectTo: 6 }
        ];
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
                z: layer,
                size: this.getStarSize(layer, starType),
                baseSize: 0,
                color: this.getStarColor(layer, colors),
                alpha: this.getStarAlpha(layer),
                baseAlpha: 0,
                type: starType,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.05 + Math.random() * 0.1,
                vx: (Math.random() - 0.5) * 0.3 * (1 - layer),
                vy: (Math.random() - 0.5) * 0.3 * (1 - layer),
                isHovered: false,
                hoverIntensity: 0,
                attractionX: 0,
                attractionY: 0
            });

            const star = this.stars[this.stars.length - 1];
            star.baseX = star.x;
            star.baseY = star.y;
            star.baseSize = star.size;
            star.baseAlpha = star.alpha;
        }

        this.stars.sort((a, b) => a.z - b.z);
    }

    getRandomStarType() {
        const rand = Math.random();
        if (rand < 0.65) return 'normal';
        if (rand < 0.82) return 'pulsing';
        if (rand < 0.94) return 'twinkling';
        return 'bright';
    }

    getStarSize(layer, type) {
        let baseSize = 0.4 + layer * 2;
        if (type === 'bright') baseSize *= 1.8;
        if (type === 'pulsing') baseSize *= 1.2;
        return baseSize;
    }

    getStarColor(layer, colors) {
        if (layer > 0.9) return colors[Math.floor(Math.random() * 2)];
        if (layer > 0.7) return Math.random() > 0.5 ? colors[0] : '#ffffff';
        return '#ffffff';
    }

    getStarAlpha(layer) {
        return 0.2 + layer * 0.6;
    }

    // Calcul du facteur de dimming selon la zone
    getZoneDimming(y) {
        if (y < this.heroHeight) {
            // Dans la zone hero, réduire l'intensité
            const heroProgress = y / this.heroHeight;
            return this.config.heroZoneDimming + (1 - this.config.heroZoneDimming) * heroProgress * 0.5;
        }
        return 1;
    }

    createNebulae() {
        this.nebulae = [];
        const colors = ['#4a90e2', '#a855f7', '#6fa8dc', '#ec4899'];

        for (let i = 0; i < this.config.nebulaCount; i++) {
            this.nebulae.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: 80 + Math.random() * 150,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.02 + Math.random() * 0.03,
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
            x = Math.random() * this.width;
            y = -20;
            angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
        } else {
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
        this.shootingStarTimeoutId = setTimeout(() => {
            this.createShootingStar();
            this.scheduleShootingStar();
        }, delay);
    }

    stopShootingStarScheduler() {
        if (this.shootingStarTimeoutId) {
            clearTimeout(this.shootingStarTimeoutId);
            this.shootingStarTimeoutId = null;
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            if (this.config.enableGeekConstellations) {
                this.createGeekConstellations();
            }
        });

        // Pause animation when tab is hidden (save CPU/battery)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });

        if (this.config.enableMouseInteraction) {
            document.addEventListener('mousemove', (e) => {
                this.mouse.vx = e.clientX - this.mouse.x;
                this.mouse.vy = e.clientY - this.mouse.y;
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;

                // Vérifier les constellations geek
                if (this.config.enableGeekConstellations) {
                    this.checkConstellationProximity();
                }
            });

            document.addEventListener('mouseleave', () => {
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });
        }
    }

    checkConstellationProximity() {
        let closestConstellation = null;
        let closestDistance = Infinity;

        this.geekConstellations.forEach(constellation => {
            const dx = this.mouse.x - constellation.centerX;
            const dy = this.mouse.y - constellation.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const activationRadius = Math.min(
                constellation.zone.w * this.width,
                constellation.zone.h * this.heroHeight
            ) * 0.6;

            if (distance < activationRadius && distance < closestDistance) {
                closestDistance = distance;
                closestConstellation = constellation;
            }
        });

        // Activer/désactiver les constellations
        this.geekConstellations.forEach(constellation => {
            if (constellation === closestConstellation) {
                constellation.isRevealed = true;
            } else {
                constellation.isRevealed = false;
            }
        });

        this.activeConstellation = closestConstellation;
    }

    updateStars() {
        this.stars.forEach(star => {
            star.x += star.vx;
            star.y += star.vy;

            if (star.x < -50) star.x = this.width + 50;
            if (star.x > this.width + 50) star.x = -50;
            if (star.y < -50) star.y = this.height + 50;
            if (star.y > this.height + 50) star.y = -50;

            // Animation selon le type
            switch (star.type) {
                case 'pulsing':
                    star.pulsePhase += star.pulseSpeed;
                    star.size = star.baseSize * (1 + 0.3 * Math.sin(star.pulsePhase));
                    star.alpha = star.baseAlpha * (0.7 + 0.3 * Math.sin(star.pulsePhase));
                    break;
                case 'twinkling':
                    star.twinklePhase += star.twinkleSpeed;
                    const twinkle = Math.sin(star.twinklePhase) * Math.sin(star.twinklePhase * 2.7);
                    star.alpha = star.baseAlpha * (0.4 + 0.6 * Math.abs(twinkle));
                    break;
                case 'bright':
                    star.pulsePhase += star.pulseSpeed * 0.5;
                    star.size = star.baseSize * (1 + 0.15 * Math.sin(star.pulsePhase));
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
                    const easeInfluence = influence * influence * influence;
                    const attractionStrength = 25 * easeInfluence * star.z;
                    star.attractionX = (dx / distance) * attractionStrength;
                    star.attractionY = (dy / distance) * attractionStrength;
                    star.hoverIntensity = Math.min(1, star.hoverIntensity + 0.12);
                } else {
                    star.attractionX *= 0.92;
                    star.attractionY *= 0.92;
                    star.hoverIntensity = Math.max(0, star.hoverIntensity - 0.04);
                }
            }
        });
    }

    updateGeekConstellations() {
        this.geekConstellations.forEach(constellation => {
            // Animation de révélation progressive
            if (constellation.isRevealed) {
                constellation.revealProgress = Math.min(1, constellation.revealProgress + 0.04);
            } else {
                constellation.revealProgress = Math.max(0, constellation.revealProgress - 0.02);
            }

            // Mettre à jour les étoiles de la constellation
            constellation.stars.forEach(star => {
                star.pulsePhase += star.pulseSpeed;

                // Alpha basé sur la révélation
                const targetAlpha = constellation.isRevealed ? star.targetAlpha : star.baseAlpha;
                star.alpha += (targetAlpha - star.alpha) * 0.08;

                // Pulsation quand révélé
                if (constellation.revealProgress > 0.5) {
                    star.size = star.baseSize * (1 + 0.3 * Math.sin(star.pulsePhase) * constellation.revealProgress);
                }
            });
        });
    }

    updateShootingStars() {
        this.shootingStars = this.shootingStars.filter(star => {
            star.trail.unshift({ x: star.x, y: star.y, alpha: star.alpha });
            if (star.trail.length > star.maxTrailLength) {
                star.trail.pop();
            }

            star.x += star.vx;
            star.y += star.vy;
            star.vy += 0.1;

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

            if (nebula.x < -nebula.radius) nebula.x = this.width + nebula.radius;
            if (nebula.x > this.width + nebula.radius) nebula.x = -nebula.radius;
            if (nebula.y < -nebula.radius) nebula.y = this.height + nebula.radius;
            if (nebula.y > this.height + nebula.radius) nebula.y = -nebula.radius;
        });
    }

    draw() {
        // Clear complet au premier frame après reprise pour éviter les traînées fantômes
        if (this._resuming) {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this._resuming = false;
        } else {
            this.ctx.fillStyle = 'rgba(8, 12, 17, 0.12)';
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        if (this.config.enableNebulae) this.drawNebulae();
        if (this.config.enableConstellations) this.drawConstellations();
        if (this.config.enableGeekConstellations) this.drawGeekConstellations();
        this.drawStars();
        this.drawShootingStars();
    }

    drawNebulae() {
        this.nebulae.forEach(nebula => {
            const pulse = 1 + 0.15 * Math.sin(nebula.pulsePhase);
            const dimming = this.getZoneDimming(nebula.y);
            const gradient = this.ctx.createRadialGradient(
                nebula.x, nebula.y, 0,
                nebula.x, nebula.y, nebula.radius * pulse
            );

            const alpha = nebula.alpha * dimming * (0.8 + 0.2 * Math.sin(nebula.pulsePhase * 2));
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
        const nearbyStars = this.stars.filter(s => s.z > 0.6);

        this.ctx.lineWidth = 0.5;

        for (let i = 0; i < nearbyStars.length; i++) {
            const star1 = nearbyStars[i];
            const dimming1 = this.getZoneDimming(star1.y);
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
                    const alpha = (1 - distance / this.config.constellationDistance) * 0.12 * dimming1;
                    const hoverBoost = Math.max(star1.hoverIntensity, star2.hoverIntensity);
                    const finalAlpha = alpha + hoverBoost * 0.2;

                    this.ctx.strokeStyle = `rgba(74, 144, 226, ${finalAlpha})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(displayX1, displayY1);
                    this.ctx.lineTo(displayX2, displayY2);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawGeekConstellations() {
        this.geekConstellations.forEach(constellation => {
            if (constellation.revealProgress <= 0) return;

            const progress = constellation.revealProgress;

            // Dessiner les connexions
            this.ctx.lineWidth = 1.5 * progress;
            this.ctx.lineCap = 'round';

            constellation.connections.forEach((conn, index) => {
                const star1 = constellation.stars[conn.from];
                const star2 = constellation.stars[conn.to];
                if (!star1 || !star2) return;

                const connectionProgress = Math.min(1, progress * 1.5 - index * 0.05);
                if (connectionProgress <= 0) return;

                const gradient = this.ctx.createLinearGradient(star1.x, star1.y, star2.x, star2.y);
                gradient.addColorStop(0, this.hexToRgba(constellation.color, 0.6 * connectionProgress));
                gradient.addColorStop(0.5, this.hexToRgba(constellation.color, 0.8 * connectionProgress));
                gradient.addColorStop(1, this.hexToRgba(constellation.color, 0.6 * connectionProgress));

                this.ctx.strokeStyle = gradient;
                this.ctx.beginPath();
                this.ctx.moveTo(star1.x, star1.y);
                this.ctx.lineTo(star2.x, star2.y);
                this.ctx.stroke();

                // Glow effect
                if (progress > 0.5) {
                    this.ctx.strokeStyle = this.hexToRgba(constellation.color, 0.2 * connectionProgress);
                    this.ctx.lineWidth = 4 * progress;
                    this.ctx.stroke();
                }
            });

            // Dessiner les étoiles de la constellation
            constellation.stars.forEach(star => {
                const glowSize = star.size * (2 + progress * 2);
                const glowGradient = this.ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, glowSize
                );
                glowGradient.addColorStop(0, this.hexToRgba(constellation.color, star.alpha * 0.8));
                glowGradient.addColorStop(0.5, this.hexToRgba(constellation.color, star.alpha * 0.3));
                glowGradient.addColorStop(1, 'transparent');

                this.ctx.fillStyle = glowGradient;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
                this.ctx.fill();

                // Core
                this.ctx.fillStyle = this.hexToRgba('#ffffff', star.alpha);
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fill();
            });

            // Afficher le message quand révélé
            if (progress > 0.7) {
                const messageAlpha = (progress - 0.7) / 0.3;
                this.ctx.font = `bold ${18 + progress * 6}px "Space Grotesk", monospace`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';

                // Glow du texte
                this.ctx.shadowColor = constellation.color;
                this.ctx.shadowBlur = 20 * messageAlpha;
                this.ctx.fillStyle = this.hexToRgba(constellation.color, messageAlpha * 0.9);
                this.ctx.fillText(
                    constellation.message,
                    constellation.centerX,
                    constellation.centerY + (constellation.zone.h * this.heroHeight * 0.45)
                );
                this.ctx.shadowBlur = 0;
            }
        });
    }

    drawStars() {
        this.stars.forEach(star => {
            const displayX = star.x + star.attractionX;
            const displayY = star.y + star.attractionY;
            const dimming = this.getZoneDimming(star.y);
            const hoverBoost = star.hoverIntensity;

            const size = star.size * (1 + hoverBoost * 0.6);
            const alpha = Math.min(1, star.alpha * dimming * (1 + hoverBoost * 0.4));

            // Glow pour étoiles brillantes
            if (star.type === 'bright' || hoverBoost > 0.3) {
                const glowSize = size * (2.5 + hoverBoost * 1.5);
                const glowGradient = this.ctx.createRadialGradient(
                    displayX, displayY, 0,
                    displayX, displayY, glowSize
                );
                glowGradient.addColorStop(0, this.hexToRgba(star.color, 0.3 * alpha));
                glowGradient.addColorStop(0.3, this.hexToRgba(star.color, 0.1 * alpha));
                glowGradient.addColorStop(1, 'transparent');

                this.ctx.fillStyle = glowGradient;
                this.ctx.beginPath();
                this.ctx.arc(displayX, displayY, glowSize, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Halo
            if (size > 1.2 || hoverBoost > 0) {
                const haloGradient = this.ctx.createRadialGradient(
                    displayX, displayY, 0,
                    displayX, displayY, size * 1.8
                );
                haloGradient.addColorStop(0, this.hexToRgba(star.color, 0.4 * alpha));
                haloGradient.addColorStop(1, 'transparent');

                this.ctx.fillStyle = haloGradient;
                this.ctx.beginPath();
                this.ctx.arc(displayX, displayY, size * 1.8, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Corps de l'étoile
            this.ctx.beginPath();
            this.ctx.arc(displayX, displayY, size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.hexToRgba(star.color, alpha);
            this.ctx.fill();

            // Point central
            if (size > 0.8) {
                this.ctx.beginPath();
                this.ctx.arc(displayX, displayY, size * 0.35, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.ctx.fill();
            }
        });
    }

    drawShootingStars() {
        this.shootingStars.forEach(star => {
            star.trail.forEach((point, index) => {
                const progress = index / star.trail.length;
                const trailAlpha = (1 - progress) * star.alpha * 0.5;
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

            // Tête
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
        if (this.config.enableGeekConstellations) this.updateGeekConstellations();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // API publique
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.stopShootingStarScheduler();
    }

    resume() {
        if (!this.animationId) {
            // Nettoyer l'état accumulé pendant l'inactivité
            this.shootingStars = [];
            this._resuming = true;
            this.animate();
        }
        // Relancer le scheduler d'étoiles filantes
        if (this.config.enableShootingStars && !this.reducedMotion && !this.shootingStarTimeoutId) {
            this.scheduleShootingStar();
        }
    }

    setMouseInfluence(radius) {
        this.config.mouseInfluenceRadius = radius;
    }

    triggerShootingStar() {
        this.createShootingStar();
    }

    // Révéler une constellation spécifique par nom
    revealConstellation(name) {
        const constellation = this.geekConstellations.find(c => c.name === name);
        if (constellation) {
            constellation.isRevealed = true;
            setTimeout(() => {
                constellation.isRevealed = false;
            }, 3000);
        }
    }

    destroy() {
        this.pause();
        this.stopShootingStarScheduler();
        if (this.canvas) this.canvas.remove();
        const filters = document.getElementById('stellar-filters');
        if (filters) filters.remove();
    }
}

export function initStellarEngine(options) {
    return new StellarEngine(options);
}
