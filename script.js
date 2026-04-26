// Circular Ripple Menu Toggle Functionality
const createRippleMenu = () => {
    const nav = document.querySelector('.nav');
    const navLinks = nav.querySelector('nav');
    
    // Create mobile menu toggle button
    const menuToggle = document.createElement('button');
    menuToggle.classList.add('mobile-menu-toggle');
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    
    // Create circular ripple icon structure
    const rippleIcon = document.createElement('div');
    rippleIcon.classList.add('ripple-icon');
    rippleIcon.innerHTML = `
        <div class="circle-outer"></div>
        <div class="circle-inner">
            <div class="menu-lines">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    menuToggle.appendChild(rippleIcon);
    nav.insertBefore(menuToggle, nav.firstChild);
    
    // Toggle menu on click
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = rippleIcon.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);
        
        // Add ripple animation
        if (isActive) {
            rippleIcon.style.transform = 'scale(1.1)';
            setTimeout(() => {
                rippleIcon.style.transform = 'scale(1)';
            }, 300);
        }
    });
    
    // Close menu when clicking on a nav link
    const navLinksArray = navLinks.querySelectorAll('a');
    navLinksArray.forEach(link => {
        link.addEventListener('click', () => {
            rippleIcon.classList.remove('active');
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
            rippleIcon.classList.remove('active');
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            rippleIcon.classList.remove('active');
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
};

// Smooth scrolling for navigation links
const initSmoothScroll = () => {
    document.querySelectorAll('.nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Active navigation link highlighting based on scroll position
const initActiveNavigation = () => {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('div[id]');
        const navLinks = document.querySelectorAll('.nav a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
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
};

// Bootstrap Carousel Initialization
const initCarousel = () => {
    // Wait for Bootstrap to load
    if (typeof bootstrap === 'undefined') {
        setTimeout(initCarousel, 100);
        return;
    }
    
    const carouselEl = document.querySelector('#projectCarousel');
    if (!carouselEl) return;
    
    // Initialize carousel with proper settings
    const carouselInstance = new bootstrap.Carousel(carouselEl, {
        interval: false,
        ride: false,
        wrap: true,
        keyboard: true,
        touch: false
    });
    
    // Handle carousel transitions for visibility management
    carouselEl.addEventListener('slide.bs.carousel', (e) => {
        // Hide all items at start of transition
        const items = carouselEl.querySelectorAll('.carousel-item');
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.visibility = 'hidden';
        });
    });
    
    carouselEl.addEventListener('slid.bs.carousel', (e) => {
        // Show active item at end of transition
        const activeItem = carouselEl.querySelector('.carousel-item.active');
        if (activeItem) {
            activeItem.style.opacity = '1';
            activeItem.style.visibility = 'visible';
        }
    });
    
    // Get the carousel inner element for touch handling
    const carouselInner = carouselEl.querySelector('.carousel-inner');
    const targetElement = carouselInner || carouselEl;
    
    // Custom swipe handling
    let touchStartX = 0;
    let touchStartY = 0;
    let isDragging = false;
    let hasMoved = false;
    
    targetElement.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isDragging = false;
        hasMoved = false;
    }, { passive: true });
    
    targetElement.addEventListener('touchmove', (e) => {
        if (!hasMoved) {
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const diffX = Math.abs(touchX - touchStartX);
            const diffY = Math.abs(touchY - touchStartY);
            
            if (diffX > 5 || diffY > 5) {
                hasMoved = true;
                if (diffX > diffY * 2) {
                    isDragging = true;
                }
            }
        }
        
        if (isDragging) {
            e.preventDefault();
        }
    }, { passive: false });
    
    targetElement.addEventListener('touchend', (e) => {
        if (isDragging) {
            const touchEndX = e.changedTouches[0].clientX;
            const diffX = touchStartX - touchEndX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    carouselInstance.next();
                } else {
                    carouselInstance.prev();
                }
            }
        }
        
        isDragging = false;
        hasMoved = false;
    }, { passive: true });
};

// Scroll-to-top button - PERFECTLY CENTERED
const createScrollTopButton = () => {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.classList.add('scroll-to-top');
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #023859;
        border: 2px solid #54ACBF;
        border-radius: 50%;
        color: #ffffff;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Style the icon after it's added
    setTimeout(() => {
        const icon = scrollBtn.querySelector('i');
        if (icon) {
            icon.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
                padding: 0;
                line-height: 1;
            `;
        }
    }, 0);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.background = '#023859';
        scrollBtn.style.boxShadow = '0 0 30px ';
        scrollBtn.style.transform = 'scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.background = '#023859';
        scrollBtn.style.boxShadow = 'none';
        scrollBtn.style.transform = 'scale(1)';
    });
};

// Scroll animations
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.skills-category, .experience-item, .carousel-item, .profile-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
};

// Page load animation
const initPageLoad = () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    createRippleMenu();
    initSmoothScroll();
    initActiveNavigation();
    initCarousel();
    createScrollTopButton();
    initScrollAnimations();
});

// Initialize page load animation
window.addEventListener('load', () => {
    initPageLoad();
    // Backup carousel init
    setTimeout(initCarousel, 500);
});
