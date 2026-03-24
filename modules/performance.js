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
        // PerformanceObserver réservé pour un usage futur avec métriques actives
    }

    optimizeEventListeners() {
        // Listeners réservés pour un usage futur
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
