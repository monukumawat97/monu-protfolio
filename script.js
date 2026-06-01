/* ==========================================================================
   INITIALIZATION & SETUP
   ========================================================================== */

// EmailJS Initialization
// Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS Public Key in your account
(function() {
    emailjs.init("user_placeholder_key_MK"); 
})();

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initTheme();
    initMobileNav();
    initTypingAnimation();
    initCustomCursor();
    initThreeJS();
    initColorExtraction();
    initGSAPAnimations();
    initPortfolioFilter();
    initLightbox();
    initServiceModal();
    initContactForm();
});

/* ==========================================================================
   PAGE LOADER
   ========================================================================== */
function initLoader() {
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');
    const loaderPercentage = document.getElementById('loader-percentage');
    
    let progress = 0;
    const interval = setInterval(() => {
        // Increment progress faster at first, then slow down
        if (progress < 70) {
            progress += Math.floor(Math.random() * 10) + 2;
        } else if (progress < 100) {
            progress += Math.floor(Math.random() * 5) + 1;
        }
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Fade out loader and reveal page
            gsap.to(loader, {
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                onComplete: () => {
                    loader.style.display = 'none';
                    // Trigger Hero Section animations
                    animateHeroEntrance();
                }
            });
        }
        
        loaderBar.style.width = `${progress}%`;
        loaderPercentage.innerText = `${progress}%`;
    }, 40);
}

/* ==========================================================================
   THEME MANAGER (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }
    
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark');
        }
        
        // Update Three.js background colors depending on theme
        updateThreeJSBackground();
    });
}

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const header = document.getElementById('header');
    
    menuToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        menuToggle.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update Scroll Progress Bar
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('scroll-progress').style.width = scrolled + '%';
        
        // Update active nav links on scroll
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSectionId = 'home';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            currentSectionId = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

/* ==========================================================================
   TYPING TEXT ANIMATION
   ========================================================================== */
function initTypingAnimation() {
    const typingElement = document.getElementById('typing-element');
    const titles = [
        "Web Developer",
        "Graphic Designer",
        "Photographer",
        "B.Tech CSE Student"
    ];
    
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletes faster
        } else {
            typingElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // Types slower
        }
        
        if (!isDeleting && charIndex === currentTitle.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing loop after loader completes
    setTimeout(type, 1500);
}

/* ==========================================================================
   CUSTOM CURSOR & MAGNETIC EFFECT
   ========================================================================== */
function initCustomCursor() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const interactiveElements = document.querySelectorAll('a, button, .tilt-card, .service-card, .portfolio-media, input, textarea, label');
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isMoving = false;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isMoving) {
            cursorDot.style.display = 'block';
            cursorRing.style.display = 'block';
            isMoving = true;
        }
        
        // Instantly position cursor dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });
    
    // Smooth lerp animation loop for cursor ring
    function renderCursorRing() {
        const lerpFactor = 0.15;
        ringX += (mouseX - ringX) * lerpFactor;
        ringY += (mouseY - ringY) * lerpFactor;
        
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        
        requestAnimationFrame(renderCursorRing);
    }
    renderCursorRing();
    
    // Hover expansions
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.classList.add('hovered');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorRing.classList.remove('hovered');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

/* ==========================================================================
   THREE.JS 3D BACKGROUND AND FLOATING GEOMETRIES
   ========================================================================== */
let scene, camera, renderer, starField, floatingMeshes = [];
let defaultPrimaryColor = new THREE.Color('#6366f1');
let defaultSecondaryColor = new THREE.Color('#ec4899');

function initThreeJS() {
    const canvas = document.getElementById('three-bg');
    
    // Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight1.position.set(10, 20, 15);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x6366f1, 1.5, 50); // Primary color source light
    pointLight2.position.set(-15, -10, 5);
    scene.add(pointLight2);
    floatingMeshes.pointLight = pointLight2; // save reference to animate or shift
    
    // Starfield Particle System
    const particleCount = 1000;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Position scattered in viewport space
        positions[i] = (Math.random() - 0.5) * 120;
        positions[i+1] = (Math.random() - 0.5) * 120;
        positions[i+2] = (Math.random() - 0.5) * 80;
        
        // Randomly color stars matching the primary/secondary palette
        const mixedColor = new THREE.Color().lerpColors(
            defaultPrimaryColor, 
            defaultSecondaryColor, 
            Math.random()
        );
        colors[i] = mixedColor.r;
        colors[i+1] = mixedColor.g;
        colors[i+2] = mixedColor.b;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Particle Material
    const starMaterial = new THREE.PointsMaterial({
        size: 0.35,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });
    
    starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    
    // Floating Geometries (Glass/Crystal look)
    const geometries = [
        new THREE.TorusGeometry(3.5, 1.2, 16, 100),
        new THREE.TorusKnotGeometry(2, 0.6, 100, 16),
        new THREE.SphereGeometry(2.5, 32, 32),
        new THREE.BoxGeometry(4, 4, 4)
    ];
    
    const materialOptions = {
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.6, // Semi-transparent glass appearance
        thickness: 1.5,
        transparent: true,
        opacity: 0.25,
        wireframe: true // Looks high-tech
    };
    
    geometries.forEach((geom, idx) => {
        const mat = new THREE.MeshPhysicalMaterial(materialOptions);
        // Base tint matching primary/secondary
        mat.color.copy(idx % 2 === 0 ? defaultPrimaryColor : defaultSecondaryColor);
        
        const mesh = new THREE.Mesh(geom, mat);
        
        // Position widely in background
        mesh.position.x = (idx === 0) ? -18 : (idx === 1) ? 18 : (idx === 2) ? -12 : 15;
        mesh.position.y = (idx === 0) ? 10 : (idx === 1) ? -10 : (idx === 2) ? -15 : 12;
        mesh.position.z = -10;
        
        scene.add(mesh);
        floatingMeshes.push({
            mesh: mesh,
            baseX: mesh.position.x,
            baseY: mesh.position.y,
            rotSpeedX: Math.random() * 0.01 + 0.002,
            rotSpeedY: Math.random() * 0.01 + 0.002
        });
    });
    
    // Mouse movement influence
    let targetMouseX = 0, targetMouseY = 0;
    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 12;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 12;
    });
    
    // Scroll parallax coefficients
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });
    
    // Render loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        
        // Animate particles
        starField.rotation.y = elapsedTime * 0.02;
        starField.rotation.x = elapsedTime * 0.01;
        
        // Animate meshes
        floatingMeshes.forEach((item, idx) => {
            // Self rotation
            item.mesh.rotation.x += item.rotSpeedX;
            item.mesh.rotation.y += item.rotSpeedY;
            
            // Wave floating motion
            const floatOffset = Math.sin(elapsedTime + idx) * 1.5;
            item.mesh.position.y = item.baseY + floatOffset - (scrollY * 0.03); // Dynamic scroll parallax
            
            // Mouse track parallax
            item.mesh.position.x += (item.baseX + targetMouseX - item.mesh.position.x) * 0.05;
        });
        
        // Animate color point light source
        if (floatingMeshes.pointLight) {
            floatingMeshes.pointLight.position.x = Math.sin(elapsedTime * 0.5) * 20;
            floatingMeshes.pointLight.position.y = Math.cos(elapsedTime * 0.5) * 20;
        }
        
        renderer.render(scene, camera);
    }
    animate();
    
    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function updateThreeJSBackground() {
    // Modify clear color or scene fog on theme toggles if required
    const isLight = document.body.classList.contains('light-theme');
    if (isLight) {
        starField.material.opacity = 0.5;
        starField.material.size = 0.25;
    } else {
        starField.material.opacity = 0.8;
        starField.material.size = 0.35;
    }
    starField.material.needsUpdate = true;
}

// Recolor the 3D assets to match the extracted color
function updateThreeJSColors(primary, secondary) {
    const pThreeColor = new THREE.Color(primary.r / 255, primary.g / 255, primary.b / 255);
    const sThreeColor = new THREE.Color(secondary.r / 255, secondary.g / 255, secondary.b / 255);
    
    // Re-color background light source
    if (floatingMeshes.pointLight) {
        floatingMeshes.pointLight.color.copy(pThreeColor);
    }
    
    // Re-color floating glass meshes
    floatingMeshes.forEach((item, idx) => {
        if (item.mesh && item.mesh.material) {
            item.mesh.material.color.copy(idx % 2 === 0 ? pThreeColor : sThreeColor);
            item.mesh.material.needsUpdate = true;
        }
    });
    
    // Re-color starfield particles
    if (starField && starField.geometry) {
        const colors = starField.geometry.attributes.color.array;
        for (let i = 0; i < colors.length; i += 3) {
            const mixedColor = new THREE.Color().lerpColors(
                pThreeColor, 
                sThreeColor, 
                Math.random()
            );
            colors[i] = mixedColor.r;
            colors[i+1] = mixedColor.g;
            colors[i+2] = mixedColor.b;
        }
        starField.geometry.attributes.color.needsUpdate = true;
    }
}

/* ==========================================================================
   DYNAMIC COLOR PALETTE EXTRACTION
   ========================================================================== */
function initColorExtraction() {
    const profileImg = document.getElementById('profile-img');
    const imageUpload = document.getElementById('image-upload');
    
    // Run extraction on initial profile image load
    if (profileImg.complete) {
        processImageColors(profileImg);
    } else {
        profileImg.addEventListener('load', () => {
            processImageColors(profileImg);
        });
    }
    
    // Uploader triggered change
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profileImg.src = event.target.result;
                
                // Let image load, then extract
                profileImg.onload = () => {
                    processImageColors(profileImg);
                    // Celebrate theme adaptation with confetti!
                    triggerConfettiSpark();
                };
            };
            reader.readAsDataURL(file);
        }
    });
}

function processImageColors(imgElement) {
    try {
        const colors = extractColorsFromImage(imgElement);
        applyColorTheme(colors.primary, colors.secondary);
    } catch (e) {
        console.error("Color extraction failed, using defaults", e);
    }
}

function extractColorsFromImage(imgElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Draw image in smaller space to average pixel values
    canvas.width = 40;
    canvas.height = 40;
    
    // Draw image
    ctx.drawImage(imgElement, 0, 0, 40, 40);
    const imgData = ctx.getImageData(0, 0, 40, 40).data;
    
    const colorMap = {};
    const colorList = [];
    
    // Iterate over sampled pixels
    for (let i = 0; i < imgData.length; i += 16) { // step by 16 for speed/averaging
        const r = imgData[i];
        const g = imgData[i+1];
        const b = imgData[i+2];
        const a = imgData[i+3];
        
        if (a < 200) continue; // ignore transparent pixels
        
        // HSL check
        const hsl = rgbToHsl(r, g, b);
        
        // FILTER: Discard skin tones, very dark, very light, and low-saturation pixels
        const isGrayscale = hsl.s < 0.2;
        const isTooDark = hsl.l < 0.18;
        const isTooLight = hsl.l > 0.82;
        
        // Discard typical skin-tone range (Hue between 10 and 38, moderate saturation)
        const isSkinTone = (hsl.h * 360 > 8 && hsl.h * 360 < 42) && (hsl.s > 0.15 && hsl.s < 0.65);
        
        if (!isGrayscale && !isTooDark && !isTooLight && !isSkinTone) {
            // Discretize colors to cluster similar tones together
            const clusterFactor = 15;
            const cr = Math.round(r / clusterFactor) * clusterFactor;
            const cg = Math.round(g / clusterFactor) * clusterFactor;
            const cb = Math.round(b / clusterFactor) * clusterFactor;
            const key = `${cr},${cg},${cb}`;
            
            if (!colorMap[key]) {
                colorMap[key] = { r: cr, g: cg, b: cb, count: 0, saturation: hsl.s, hue: hsl.h };
            }
            colorMap[key].count++;
        }
    }
    
    // Format to array
    for (const key in colorMap) {
        colorList.push(colorMap[key]);
    }
    
    // Sort color cluster weight (combination of pixel count and vibrancy/saturation)
    colorList.sort((a, b) => (b.count * b.saturation) - (a.count * a.saturation));
    
    // Default Fallbacks
    let primary = { r: 99, g: 102, b: 241 };  // Default Indigo (#6366f1)
    let secondary = { r: 236, g: 72, b: 153 }; // Default Pink (#ec4899)
    
    if (colorList.length > 0) {
        primary = colorList[0];
        
        // Find a secondary color that is hue-shifted (different tone) from primary
        let foundSecondary = false;
        for (let i = 1; i < colorList.length; i++) {
            const hDiff = Math.abs(colorList[i].hue - primary.hue);
            // Hue shifts should be distinct (at least 30 deg / 0.08 units on a scale of 0..1)
            if (hDiff > 0.08 && hDiff < 0.92) {
                secondary = colorList[i];
                foundSecondary = true;
                break;
            }
        }
        
        // Fallback secondary
        if (!foundSecondary && colorList.length > 1) {
            secondary = colorList[1];
        }
    }
    
    return { primary, secondary };
}

// Convert RGB to HSL helper
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h, s, l };
}

// Apply Hex colors onto CSS Custom Properties
function applyColorTheme(primary, secondary) {
    const componentToHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    const rgbToHex = (r, g, b) => "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    
    const pColorHex = rgbToHex(primary.r, primary.g, primary.b);
    const sColorHex = rgbToHex(secondary.r, secondary.g, secondary.b);
    
    // Set custom CSS variables
    document.documentElement.style.setProperty('--primary-color', pColorHex);
    document.documentElement.style.setProperty('--primary-color-rgb', `${primary.r}, ${primary.g}, ${primary.b}`);
    document.documentElement.style.setProperty('--secondary-color', sColorHex);
    document.documentElement.style.setProperty('--secondary-color-rgb', `${secondary.r}, ${secondary.g}, ${secondary.b}`);
    
    // Dynamic Accent is a color mixed between primary and secondary
    const aColor = {
        r: Math.round((primary.r + secondary.r) / 2),
        g: Math.round((primary.g + secondary.g) / 2),
        b: Math.round((primary.b + secondary.b) / 2)
    };
    document.documentElement.style.setProperty('--accent-color', rgbToHex(aColor.r, aColor.g, aColor.b));
    
    // Apply changes on 3D particles & shapes in ThreeJS
    updateThreeJSColors(primary, secondary);
}

function triggerConfettiSpark() {
    confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: [
            getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim()
        ]
    });
}

/* ==========================================================================
   GSAP INTERACTIVE ANIMATIONS
   ========================================================================== */
function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // 3D Profile Card Tilt mechanics
    const profileCard = document.getElementById('profile-card');
    if (profileCard) {
        profileCard.addEventListener('mousemove', (e) => {
            const rect = profileCard.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within card
            const y = e.clientY - rect.top;  // y position within card
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Max tilt degrees
            const maxTilt = 15;
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            const rotateX = ((centerY - y) / centerY) * maxTilt;
            
            gsap.to(profileCard.querySelector('.profile-card-inner'), {
                rotateY: rotateY,
                rotateX: rotateX,
                duration: 0.3,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });
        
        profileCard.addEventListener('mouseleave', () => {
            gsap.to(profileCard.querySelector('.profile-card-inner'), {
                rotateY: 0,
                rotateX: 0,
                duration: 0.6,
                ease: 'power3.out'
            });
        });
    }
}

// Slide up Hero text and profiles
function animateHeroEntrance() {
    const timeline = gsap.timeline();
    
    timeline.to('#hero-info-panel', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power4.out'
    });
    
    timeline.to('#hero-visual-panel', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power4.out'
    }, '-=0.7');
    
    // Set up standard ScrollTrigger entries for subsequent sections
    registerScrollTriggers();
}

function registerScrollTriggers() {
    // Fade/Slide sections
    const fadeSections = document.querySelectorAll('.about-section, .skills-section, .services-section, .portfolio-section, .education-section, .contact-section');
    fadeSections.forEach(section => {
        gsap.from(section.querySelector('.section-header'), {
            opacity: 0,
            y: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    // About grid layout triggers
    gsap.from('.about-text-content', {
        opacity: 0,
        x: -40,
        duration: 1,
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 75%'
        }
    });
    
    gsap.from('.about-stats-grid', {
        opacity: 0,
        x: 40,
        duration: 1,
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 75%'
        }
    });
    
    // Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        gsap.to(stat, {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: stat,
                start: 'top 90%',
                onEnter: () => {
                    // Force text update format
                    gsap.fromTo(stat, { innerText: 0 }, {
                        innerText: target,
                        duration: 2,
                        snap: { innerText: 1 },
                        onUpdate: function() {
                            stat.innerText = Math.ceil(this.targets()[0].innerText) + "+";
                        }
                    });
                }
            }
        });
    });
    
    // Skills progress bar fills on scroll
    gsap.utils.toArray('.skill-progress-fill').forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        gsap.to(bar, {
            width: progress,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 85%'
            }
        });
    });
    
    // Skill category cards floating entrances
    gsap.from('.skill-category-card', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%'
        }
    });

    // Services card stagger load
    gsap.from('.service-card', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%'
        }
    });
    
    // Education Timeline markers & content entrances
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const isLeft = item.classList.contains('left');
        gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                onEnter: () => {
                    gsap.from(item.querySelector('.timeline-content'), {
                        x: isLeft ? -50 : 50,
                        opacity: 0,
                        duration: 1,
                        ease: 'power3.out'
                    });
                    gsap.from(item.querySelector('.timeline-marker'), {
                        scale: 0,
                        duration: 0.5,
                        ease: 'back.out(2)'
                    });
                }
            }
        });
    });
}

/* ==========================================================================
   PORTFOLIO FILTER
   ========================================================================== */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterVal = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const isMatch = filterVal === 'all' || item.classList.contains(filterVal);
                if (isMatch) {
                    item.classList.remove('hidden');
                    // GSAP stagger scaling entrance
                    gsap.to(item, { scale: 1, opacity: 1, duration: 0.4, display: 'block' });
                } else {
                    item.classList.add('hidden');
                    gsap.to(item, { scale: 0.85, opacity: 0, duration: 0.4, display: 'none' });
                }
            });
        });
    });
}

/* ==========================================================================
   LIGHTBOX GALERY MODAL
   ========================================================================== */
function initLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close');
    const mediaContainer = document.getElementById('lightbox-media');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const triggers = document.querySelectorAll('.lightbox-trigger');
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const item = e.target.closest('.portfolio-item');
            const img = item.querySelector('.portfolio-img');
            const placeholder = item.querySelector('.portfolio-placeholder');
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');
            
            // Clear and insert media inside lightbox
            mediaContainer.innerHTML = '';
            if (img) {
                const imgClone = img.cloneNode(true);
                imgClone.style.transform = 'none'; // reset hover zoom scale
                imgClone.style.width = '100%';
                imgClone.style.height = '100%';
                imgClone.style.objectFit = 'contain'; // fits nicely inside lightbox
                mediaContainer.appendChild(imgClone);
            } else if (placeholder) {
                const placeholderClone = placeholder.cloneNode(true);
                mediaContainer.appendChild(placeholderClone);
            }
            
            lightboxTitle.innerText = title;
            lightboxDesc.innerText = desc;
            
            // Open modal
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Stop page scroll
        });
    });
    
    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Restore scroll
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Escape key closes modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   CONTACT FORM SUBMISSION WITH EMAILJS
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    // Clear validation error highlights on input
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.closest('.form-group').classList.remove('invalid');
        });
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Run validation checks
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            if (!input.value.trim()) {
                formGroup.classList.add('invalid');
                isValid = false;
            } else {
                formGroup.classList.remove('invalid');
            }
            
            // Special validation for email format
            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    formGroup.classList.add('invalid');
                    isValid = false;
                }
            }
        });
        
        if (!isValid) return;
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.innerText = "Sending Message...";
        submitBtn.querySelector('i').className = "fa-solid fa-spinner fa-spin";
        
        // EmailJS service sends template fields
        // Set ServiceID template parameters
        // IMPORTANT: Replace these template placeholders with your own EmailJS credentials!
        const serviceID = 'default_service';
        const templateID = 'template_portfolio_msg';
        
        emailjs.sendForm(serviceID, templateID, form)
            .then(() => {
                // Success actions
                btnText.innerText = "Message Sent!";
                submitBtn.querySelector('i').className = "fa-solid fa-check";
                submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)"; // Successful green tint
                
                // Burst confetti
                triggerConfettiSpark();
                
                // Reset form
                form.reset();
                
                // Restore button state after delay
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    btnText.innerText = "Send Message";
                    submitBtn.querySelector('i').className = "fa-solid fa-paper-plane";
                }, 3000);
            }, (err) => {
                // Failure actions
                console.error("EmailJS Error: ", err);
                alert("Failed to deliver your inquiry. Please try again or contact monukumawat2023@gmail.com directly.");
                
                submitBtn.disabled = false;
                btnText.innerText = "Send Message";
                submitBtn.querySelector('i').className = "fa-solid fa-paper-plane";
            });
    });
}

/* ==========================================================================
   SERVICES DETAILED MODAL
   ========================================================================== */
function initServiceModal() {
    const modal = document.getElementById('service-modal');
    const closeBtn = document.getElementById('service-modal-close');
    const modalIcon = document.getElementById('service-modal-icon');
    const modalTitle = document.getElementById('service-modal-title');
    const modalDesc = document.getElementById('service-modal-desc');
    const modalFeatures = document.getElementById('service-modal-features');
    const modalTech = document.getElementById('service-modal-tech');
    const modalCta = document.getElementById('service-modal-cta');
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Service Details Database
    const serviceDetails = {
        "Web Development": {
            icon: "fa-code",
            desc: "I create modern, responsive, and user-friendly websites using HTML, CSS, and JavaScript. From personal portfolios to business landing pages, I build fast and visually appealing websites.",
            features: ["Responsive Design", "SEO Indexing", "Custom Layouts", "Clean Architectures", "Performance Audits", "Secure Coding Standards"],
            tech: ["HTML5", "CSS3", "JavaScript", "React JS", "Responsive Setup"]
        },
        "Programming & Problem Solving": {
            icon: "fa-laptop-code",
            desc: "I provide solutions in C Programming and Data Structures & Algorithms (Java), helping with coding projects, algorithm optimization, and logical problem-solving.",
            features: ["DSA with Java", "C Coding Solutions", "Algorithm Tuning", "Logical Debugging", "OOP Architecture", "Code Optimizations"],
            tech: ["Java", "C Programming", "Algorithms", "DSA Structure"]
        },
        "Graphic Design": {
            icon: "fa-palette",
            desc: "I design professional logos, social media posts, banners, flyers, and branding materials that help businesses establish a strong visual identity.",
            features: ["Corporate Logo Designs", "Social Media Creatives", "Branding Guidelines", "Flyer & Banner Art", "Visual Retouching", "Typography Spacing"],
            tech: ["Adobe Photoshop", "Adobe Illustrator", "Canva", "Figma"]
        },
        "Candid Photography": {
            icon: "fa-camera",
            desc: "I specialize in capturing natural and memorable moments through candid photography for events, portraits, pre-wedding shoots, and personal projects.",
            features: ["Candid Shoots", "Portrait Sessions", "Event Coverages", "Cinematic Lightings", "Color Corrections", "RAW Visual Edits"],
            tech: ["DSLR Gear", "Adobe Lightroom", "Photoshop CC"]
        },
        "Video Editing": {
            icon: "fa-clapperboard",
            desc: "I create engaging videos with smooth transitions, color grading, cinematic effects, and professional editing for reels, YouTube content, and promotional videos.",
            features: ["Smooth Transitions", "HSL Color Grading", "Cinematic Visual FX", "Reels & Short Clips", "YouTube Formats", "Promotional Cuts"],
            tech: ["Premiere Pro", "After Effects", "CapCut", "Sound Designs"]
        },
        "Creative Digital Solutions": {
            icon: "fa-rocket",
            desc: "By combining web development, graphic design, photography, and video editing, I help individuals and businesses build a strong and impactful digital presence.",
            features: ["Full Digital Branding", "Unified Visual System", "End-to-End Assets", "Cross-Platform Growth", "Interactive Media", "Outreach Optimization"],
            tech: ["Web Coding", "Graphic Design", "Photography", "Video Editing"]
        }
    };
    
    // Open Modal
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.service-title').textContent.trim();
            const data = serviceDetails[title];
            
            if (!data) return;
            
            // Populate Modal Content
            modalTitle.textContent = title;
            modalDesc.textContent = data.desc;
            
            // Set Icon
            modalIcon.innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
            
            // Set Features List
            modalFeatures.innerHTML = '';
            data.features.forEach(feat => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.alignItems = 'center';
                li.style.fontSize = '0.95rem';
                li.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--primary-color); margin-right: 10px; font-size: 1.1rem; flex-shrink: 0;"></i> <span>${feat}</span>`;
                modalFeatures.appendChild(li);
            });
            
            // Set Tech Badges
            modalTech.innerHTML = '';
            data.tech.forEach(t => {
                const span = document.createElement('span');
                span.style.padding = '5px 12px';
                span.style.borderRadius = '20px';
                span.style.fontSize = '0.8rem';
                span.style.fontWeight = '600';
                span.style.background = 'rgba(var(--primary-color-rgb), 0.1)';
                span.style.border = '1px solid rgba(var(--primary-color-rgb), 0.2)';
                span.style.color = 'var(--primary-color)';
                span.textContent = t;
                modalTech.appendChild(span);
            });
            
            // Show modal
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Setup CTA redirect
            modalCta.onclick = () => {
                closeModal();
                
                // Smooth scroll to Contact
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    window.scrollTo({
                        top: contactSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Pre-fill form subject
                    const subjectInput = document.getElementById('subject');
                    if (subjectInput) {
                        subjectInput.value = `Inquiry: ${title}`;
                    }
                    
                    // Focus name input
                    const nameInput = document.getElementById('name');
                    if (nameInput) {
                        setTimeout(() => nameInput.focus(), 800);
                    }
                }
            };
        });
    });
    
    // Close Modal Function
    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Escape key closes modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
}
