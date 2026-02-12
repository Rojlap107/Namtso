document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const menuBtn = document.getElementById('menu-btn');
    const navLinksList = document.querySelector('.nav-links');
    const hero = document.querySelector('.hero');

    let lastScrollY = window.scrollY;

    // Mobile Menu Toggle
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
            menuBtn.classList.toggle('active'); // Add active class to button container
            menuBtn.querySelector('i').classList.toggle('fa-bars');
            menuBtn.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && link.parentElement.classList.contains('has-dropdown')) {
                // Dropdown behavior on mobile
            } else {
                navLinksList.classList.remove('active');
                if (menuBtn) {
                    menuBtn.querySelector('i').classList.add('fa-bars');
                    menuBtn.querySelector('i').classList.remove('fa-times');
                }
            }
        });
    });

    // Header scroll background & Hide/Show on scroll
    const backToTop = document.getElementById('back-to-top');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Scrolled background
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/Show header on scroll
        if (scrollY > 150) { // Only hide after some scroll
            if (scrollY > lastScrollY) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
        } else {
            header.classList.remove('header-hidden');
        }

        // Back to top visibility
        if (backToTop) {
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        lastScrollY = scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Initial reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Ensure all sections also reveal if they don't have the class
    sections.forEach(section => {
        if (!section.classList.contains('reveal')) {
            section.classList.add('reveal');
            observer.observe(section);
        }
    });

    // Form Submission Handling
    const contactForm = document.getElementById('namtso-contact');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get('name');

            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                submitBtn.style.background = '#10b981'; // Emerald 500

                alert(`Thank you, ${name}! Your message has been sent successfully.`);

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }

    // Stats Counter Animation
    const statsSection = document.querySelector('.stats-section, .stats-highlight');
    const statNumbers = document.querySelectorAll('.stat-number');
    let started = false;

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started) {
                statNumbers.forEach(num => startCount(num));
                started = true;
            }
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    function startCount(el) {
        let target = parseInt(el.dataset.target);
        let count = 0;
        let speed = 2000 / target; // Total time 2 seconds

        let interval = setInterval(() => {
            count++;
            el.innerText = count;
            if (count >= target) {
                clearInterval(interval);
                el.innerText = target;
            }
        }, speed);
    }
    // Gallery Lightbox Functionality
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <div class="lightbox-nav lightbox-prev"><i class="fas fa-chevron-left"></i></div>
        <div class="lightbox-nav lightbox-next"><i class="fas fa-chevron-right"></i></div>
        <div class="lightbox-counter">1 / 1</div>
        <img class="lightbox-content" src="" alt="Full Screen Project Image">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');

    let currentGallery = [];
    let currentIndex = 0;

    const updateLightbox = () => {
        lightboxImg.src = currentGallery[currentIndex];
        lightboxCounter.innerText = `${currentIndex + 1} / ${currentGallery.length}`;

        // Show/hide nav based on gallery length
        if (currentGallery.length > 1) {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        } else {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        }
    };

    window.openGallery = (el) => {
        const imagesAttr = el.getAttribute('data-images');
        if (imagesAttr) {
            currentGallery = imagesAttr.split(',');
            currentIndex = 0;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const nextImage = (e) => {
        if (e) e.stopPropagation();
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updateLightbox();
    };

    const prevImage = (e) => {
        if (e) e.stopPropagation();
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightbox();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            // If it's a multi-image gallery, maybe clicking the image goes to next?
            // For now, let's keep it simple: click background to close.
            if (e.target === lightbox) closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // Support legacy single images if they haven't been converted to openGallery yet
    const projectImages = document.querySelectorAll('.project-img-container img');
    projectImages.forEach(img => {
        const container = img.parentElement;
        if (!container.hasAttribute('onclick')) {
            container.addEventListener('click', () => {
                currentGallery = [img.src];
                currentIndex = 0;
                updateLightbox();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    });
});
