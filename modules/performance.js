export class ResourceManager {
    constructor() {
        this.imageObserver = null;
        this.setupLazyLoading();
        this.setupPerformanceMonitoring();
        this.optimizeEventListeners();
    }

    setupLazyLoading() {
        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]')
            .forEach(img => this.imageObserver.observe(img));
    }

    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log(`LCP: ${entry.startTime}ms`);
                    }
                });
            });

            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    optimizeEventListeners() {
        // Optimisation du scroll
        window.addEventListener('scroll', this.throttle(() => {
            // Code de gestion du scroll optimisé
        }, 50));

        // Optimisation du resize
        window.addEventListener('resize', this.debounce(() => {
            // Code de gestion du redimensionnement optimisé
        }, 250));
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}
