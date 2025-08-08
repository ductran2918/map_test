// embed.js - Responsive embedding script for GitHub Pages visualizations
(function() {
    'use strict';
    
    // Configuration
    const BASE_URL = 'https://ductran2918.github.io/seafounders_us';
    
    // Find all embed containers
    function initializeEmbeds() {
        const containers = document.querySelectorAll('.github-embed');
        
        containers.forEach(container => {
            if (container.dataset.initialized) return;
            
            const vizId = container.dataset.src;
            const aspectRatio = container.dataset.aspectRatio || '16:9';
            const minHeight = container.dataset.minHeight || '400';
            
            if (!vizId) {
                console.warn('No data-src attribute found for github-embed');
                return;
            }
            
            // Create responsive wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'github-embed-wrapper';
            wrapper.style.cssText = `
                position: relative;
                width: 100%;
                height: 0;
                padding-bottom: ${calculatePaddingBottom(aspectRatio)};
                min-height: ${minHeight}px;
                overflow: hidden;
            `;
            
            // Create iframe
            const iframe = document.createElement('iframe');
            iframe.src = `${BASE_URL}/${vizId}`;
            iframe.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 0;
                border-radius: 4px;
            `;
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('frameborder', '0');
            
            // Handle loading states
            iframe.onload = function() {
                container.classList.add('loaded');
            };
            
            iframe.onerror = function() {
                container.classList.add('error');
                showFallback(container);
            };
            
            // Assemble the embed
            wrapper.appendChild(iframe);
            
            // Clear existing content and add wrapper
            container.innerHTML = '';
            container.appendChild(wrapper);
            container.dataset.initialized = 'true';
            
            // Enable responsive resizing
            setupResponsiveResizing(iframe, container);
        });
    }
    
    // Calculate padding-bottom for aspect ratio
    function calculatePaddingBottom(aspectRatio) {
        const ratios = {
            '16:9': '56.25%',
            '4:3': '75%',
            '1:1': '100%',
            '3:2': '66.67%',
            '21:9': '42.86%'
        };
        return ratios[aspectRatio] || '56.25%';
    }
    
    // Setup responsive resizing via postMessage
    function setupResponsiveResizing(iframe, container) {
        window.addEventListener('message', function(event) {
            // Verify origin for security
            if (!event.origin.includes('github.io')) return;
            
            if (event.data.type === 'resize' && event.source === iframe.contentWindow) {
                const wrapper = container.querySelector('.github-embed-wrapper');
                if (wrapper && event.data.height) {
                    wrapper.style.paddingBottom = '0';
                    wrapper.style.height = event.data.height + 'px';
                }
            }
        });
    }
    
    // Show fallback content
    function showFallback(container) {
        const fallback = container.querySelector('noscript');
        if (fallback) {
            container.innerHTML = fallback.innerHTML;
        } else {
            container.innerHTML = '<p>Visualization failed to load. Please refresh the page.</p>';
        }
    }
    
    // Initialize when DOM is ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
    // Auto-initialize
    ready(initializeEmbeds);
    
    // Re-scan for new embeds (useful for dynamic content)
    window.initializeGitHubEmbeds = initializeEmbeds;
    
    // Add CSS for loading states
    const style = document.createElement('style');
    style.textContent = `
        .github-embed {
            background: #f5f5f5;
            border-radius: 4px;
            transition: opacity 0.3s ease;
        }
        .github-embed:not(.loaded) {
            opacity: 0.7;
        }
        .github-embed.loaded {
            opacity: 1;
        }
        .github-embed.error {
            background: #fee;
            border: 1px solid #fcc;
            padding: 20px;
            text-align: center;
            color: #c66;
        }
        .github-embed-wrapper {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
})();
