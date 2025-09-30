// Loading Screen Animation
document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const letters = document.querySelectorAll('.letter');
  const body = document.body;
  
  // Add loading class to body
  body.classList.add('loading');
  
  // Start the loading animation sequence
  setTimeout(() => {
    // Add glow effect to all letters after they appear
    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('glow');
      }, 1200 + (index * 150)); // Start glow after letters appear
    });
  }, 1200);
  
  // Hide loading screen and show main content
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    body.classList.remove('loading');
    
    // Remove loading screen from DOM after transition
    setTimeout(() => {
      loadingScreen.remove();
    }, 800);
  }, 4000); // Total loading time: 4 seconds
});

// Year in footer
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
});

// Custom cursor
(function () {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;
  const lerp = (a, b, t) => a + (b - a) * t;
  window.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; });
  function raf() {
    x = lerp(x, tx, 0.2); y = lerp(y, ty, 0.2);
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(raf);
  }
  raf();
})();

// Smooth scroll with Lenis
document.addEventListener('DOMContentLoaded', () => {
  if (window.Lenis) {
    const lenis = new window.Lenis({ smoothWheel: true, lerp: 0.1 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
});

// GSAP animations
window.addEventListener('load', () => {
  if (!window.gsap) return;
  const gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  // Intro
  gsap.from('.site-header', { y: -40, opacity: 0, duration: 0.8, ease: 'power3.out' });
  gsap.from('.hero__title', { y: 30, opacity: 0, duration: 0.9, delay: 0.1, ease: 'power3.out' });
  gsap.from('.hero__subtitle', { y: 26, opacity: 0, duration: 0.9, delay: 0.2, ease: 'power3.out' });
  gsap.from('.hero__cta .btn', { y: 18, opacity: 0, duration: 0.8, delay: 0.25, stagger: 0.08, ease: 'power3.out' });

  // Parallax hero images
  const heroImgs = document.querySelectorAll('.hero .layer');
  window.addEventListener('pointermove', (e) => {
    const { innerWidth: w, innerHeight: h } = window;
    const dx = (e.clientX - w / 2) / w;
    const dy = (e.clientY - h / 2) / h;
    heroImgs.forEach((img) => {
      const depth = parseFloat(img.getAttribute('data-depth') || '0.2');
      img.style.transform = `translate(${dx * depth * -40}px, ${dy * depth * -30}px) scale(1.05)`;
    });
  });

  // Scroll reveal for sections
  if (window.ScrollTrigger) {
    gsap.utils.toArray('.section').forEach((sec) => {
      gsap.from(sec.querySelectorAll('.section__title, .feature-card, .gallery__viewport, .cta__wrap, .plate__wrap'), {
        scrollTrigger: { trigger: sec, start: 'top 80%' },
        y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08
      });
    });
  }

  // Plate beam pulse
  gsap.to('.plate__beam', { scale: 1.05, opacity: 0.9, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // Chips sparkle
  document.querySelectorAll('[data-spark]').forEach((btn) => {
    btn.addEventListener('click', () => {
      gsap.fromTo(btn, { boxShadow: '0 0 0 rgba(0,0,0,0)' }, { boxShadow: '0 0 30px rgba(0,209,255,.6)', duration: 0.25, yoyo: true, repeat: 1 });
    });
  });
});

// Mobile optimizations and gestures
document.addEventListener('DOMContentLoaded', () => {
  // Prevent zoom on double tap for better UX
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  
  // Improve touch scrolling
  document.addEventListener('touchstart', function() {}, { passive: true });
  document.addEventListener('touchmove', function() {}, { passive: true });
  
  // Add mobile-specific hover effects
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Replace hover effects with touch effects
    document.querySelectorAll('.feature-card, .experience-card').forEach(card => {
      card.addEventListener('touchstart', function() {
        this.style.transform = 'translateY(-4px) scale(1.02)';
      });
      
      card.addEventListener('touchend', function() {
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      });
    });
    
    // Improve button touch feedback
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
      });
      
      btn.addEventListener('touchend', function() {
        setTimeout(() => {
          this.style.transform = '';
        }, 100);
      });
    });
    
    // Optimize gallery touch scrolling
    const galleryTrack = document.querySelector('[data-draggable]');
    if (galleryTrack) {
      galleryTrack.style.scrollSnapType = 'x mandatory';
      galleryTrack.style.scrollBehavior = 'smooth';
      
      // Add snap points to gallery items
      document.querySelectorAll('.gallery__item').forEach(item => {
        item.style.scrollSnapAlign = 'center';
      });
    }
  }
  
  // Add pull-to-refresh prevention for better UX
  let startY = 0;
  document.addEventListener('touchstart', function(e) {
    startY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchmove', function(e) {
    const currentY = e.touches[0].clientY;
    const diffY = currentY - startY;
    
    // Prevent pull-to-refresh when scrolling down
    if (diffY > 0 && window.scrollY === 0) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Optimize steering wheel for mobile
  const steeringWheel = document.getElementById('steering-wheel');
  if (steeringWheel && isMobile) {
    // Increase touch target size
    steeringWheel.style.minWidth = '44px';
    steeringWheel.style.minHeight = '44px';
    
    // Add haptic feedback if available
    steeringWheel.addEventListener('touchstart', function() {
      if (navigator.vibrate) {
        navigator.vibrate(10); // Short vibration
      }
    });
  }
  
  // Improve mobile navigation
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('touchstart', function() {
      this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
    
    link.addEventListener('touchend', function() {
      setTimeout(() => {
        this.style.backgroundColor = '';
      }, 150);
    });
  });
  
  // Add mobile-specific loading optimizations
  if (isMobile) {
    // Reduce animation complexity on mobile
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
    
    // Optimize images for mobile
    document.querySelectorAll('img').forEach(img => {
      img.loading = 'lazy';
    });
  }
});

// Drag gallery
(function () {
  const track = document.querySelector('[data-draggable]');
  if (!track) return;

  let isDown = false;
  let startX = 0; let scrollLeft = 0;

  const start = (x) => { isDown = true; startX = x; scrollLeft = track.scrollLeft; };
  const move = (x) => { if (!isDown) return; const dx = x - startX; track.scrollLeft = scrollLeft - dx; };
  const end = () => { isDown = false; };

  track.addEventListener('mousedown', (e) => start(e.pageX));
  track.addEventListener('mousemove', (e) => move(e.pageX));
  window.addEventListener('mouseup', end);

  track.addEventListener('touchstart', (e) => start(e.touches[0].pageX), { passive: true });
  track.addEventListener('touchmove', (e) => move(e.touches[0].pageX), { passive: true });
  window.addEventListener('touchend', end);

  // Buttons
  const prev = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');
  const step = 360;
  if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step, behavior: 'smooth' }));
  if (next) next.addEventListener('click', () => track.scrollBy({ left: step, behavior: 'smooth' }));
})();

// Interactive Experience
document.addEventListener('DOMContentLoaded', () => {
  const experienceCards = document.querySelectorAll('.experience-card');
  const statsNumbers = document.querySelectorAll('.stat__number');
  let interactionCount = 0;
  let steeringTurns = 0;

  // Engine sound simulation
  document.querySelector('[data-sound="engine"]')?.addEventListener('click', function() {
    interactionCount++;
    updateStats();
    
    // Visual feedback
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
    
    // Engine shake effect - shake the entire site
    document.body.classList.add('engine-shake');
    setTimeout(() => {
      document.body.classList.remove('engine-shake');
    }, 800);
    
    // Simulate engine sound with visual effects
    const card = this.closest('.experience-card');
    card.style.boxShadow = '0 0 30px rgba(255, 100, 0, 0.5)';
    setTimeout(() => {
      card.style.boxShadow = '';
    }, 1000);
  });

  // Lights toggle
  document.querySelector('[data-lights="toggle"]')?.addEventListener('click', function() {
    interactionCount++;
    updateStats();
    
    const card = this.closest('.experience-card');
    const advancedControls = card.querySelector('.lights-advanced');
    const isOn = card.classList.toggle('lights-on');
    const existingWarmGlow = document.querySelector('.warm-edge-glow');
    
    if (isOn) {
      // Turn on lights
      this.querySelector('.btn-text').textContent = 'Выключить';
      card.style.boxShadow = '0 0 40px rgba(255, 255, 200, 0.3)';
      card.style.borderColor = 'rgba(255, 255, 200, 0.5)';
      advancedControls.style.display = 'flex';
      
      // Add warm edge glow
      if (!existingWarmGlow) {
        const warmGlow = document.createElement('div');
        warmGlow.className = 'warm-edge-glow';
        document.body.appendChild(warmGlow);
      }
      
    } else {
      // Turn off lights with glow effect
      this.querySelector('.btn-text').textContent = 'Включить';
      card.classList.add('lights-glow');
      
      // Smooth fade out for warm edge glow
      if (existingWarmGlow) {
        existingWarmGlow.classList.add('fade-out');
        setTimeout(() => {
          existingWarmGlow.remove();
        }, 2000);
      }
      
      setTimeout(() => {
        card.classList.remove('lights-glow');
        card.style.boxShadow = '';
        card.style.borderColor = '';
        advancedControls.style.display = 'none';
      }, 1500);
    }
  });

  // High beam toggle
  document.querySelector('[data-lights="highbeam"]')?.addEventListener('click', function() {
    interactionCount++;
    updateStats();
    
    const isActive = this.classList.toggle('active');
    const existingOverlay = document.querySelector('.high-beam-active');
    
    if (isActive) {
      // Turn on high beam
      this.querySelector('.btn-text').textContent = 'Выключить дальний';
      
      // Create persistent overlay
      const overlay = document.createElement('div');
      overlay.className = 'high-beam-active';
      document.body.appendChild(overlay);
      
      // Initial flash effect
      const flashOverlay = document.createElement('div');
      flashOverlay.className = 'high-beam-flash';
      document.body.appendChild(flashOverlay);
      
      setTimeout(() => {
        flashOverlay.remove();
      }, 600);
      
    } else {
      // Turn off high beam
      this.querySelector('.btn-text').textContent = 'Дальний свет';
      
      // Remove overlay
      if (existingOverlay) {
        existingOverlay.remove();
      }
    }
    
    // Visual feedback
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
  });

  // Turn off lights completely
  document.querySelector('[data-lights="off"]')?.addEventListener('click', function() {
    interactionCount++;
    updateStats();
    
    const card = this.closest('.experience-card');
    const advancedControls = card.querySelector('.lights-advanced');
    const toggleBtn = card.querySelector('[data-lights="toggle"]');
    const highBeamBtn = card.querySelector('[data-lights="highbeam"]');
    
    // Remove all light effects
    card.classList.remove('lights-on', 'lights-glow');
    card.style.boxShadow = '';
    card.style.borderColor = '';
    
    // Smooth fade out for warm edge glow
    const existingWarmGlow = document.querySelector('.warm-edge-glow');
    if (existingWarmGlow) {
      existingWarmGlow.classList.add('fade-out');
      setTimeout(() => {
        existingWarmGlow.remove();
      }, 2000);
    }
    
    // Turn off high beam if active
    if (highBeamBtn.classList.contains('active')) {
      highBeamBtn.classList.remove('active');
      highBeamBtn.querySelector('.btn-text').textContent = 'Дальний свет';
      
      // Smooth fade out for high beam overlay
      const existingOverlay = document.querySelector('.high-beam-active');
      if (existingOverlay) {
        existingOverlay.classList.add('fade-out');
        setTimeout(() => {
          existingOverlay.remove();
        }, 2000);
      }
    }
    
    // Hide advanced controls
    advancedControls.style.display = 'none';
    
    // Reset toggle button
    toggleBtn.querySelector('.btn-text').textContent = 'Включить';
    
    // Visual feedback
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
  });

  // Steering wheel functionality
  const steeringWheel = document.getElementById('steering-wheel');
  const angleDisplay = document.querySelector('.angle-value');
  const rollingElements = document.querySelectorAll('.rolling-element');
  
  let isDragging = false;
  let startAngle = 0;
  let currentAngle = 0;
  let lastRotationTime = 0;
  
  if (steeringWheel) {
    // Mouse events
    steeringWheel.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // Touch events for mobile
    steeringWheel.addEventListener('touchstart', startDragTouch, { passive: false });
    document.addEventListener('touchmove', dragTouch, { passive: false });
    document.addEventListener('touchend', endDrag);
    
    function startDrag(e) {
      isDragging = true;
      const rect = steeringWheel.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
      steeringWheel.style.cursor = 'grabbing';
    }
    
    function startDragTouch(e) {
      e.preventDefault();
      isDragging = true;
      const rect = steeringWheel.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const touch = e.touches[0];
      startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
      steeringWheel.style.cursor = 'grabbing';
    }
    
    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();
      
      const rect = steeringWheel.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
      
      updateSteering(angle);
    }
    
    function dragTouch(e) {
      if (!isDragging) return;
      e.preventDefault();
      
      const rect = steeringWheel.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const touch = e.touches[0];
      const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
      
      updateSteering(angle);
    }
    
    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      steeringWheel.style.cursor = 'grab';
    }
    
    function updateSteering(angle) {
      const deltaAngle = angle - startAngle;
      currentAngle += deltaAngle;
      
      // Count steering turns
      if (Math.abs(deltaAngle) > 5) { // Only count significant turns
        steeringTurns++;
        updateStats();
      }
      
      // Limit rotation to ±180 degrees
      currentAngle = Math.max(-180, Math.min(180, currentAngle));
      
      // Update wheel rotation
      steeringWheel.style.transform = `rotate(${currentAngle}deg)`;
      
      // Update angle display
      angleDisplay.textContent = `${Math.round(currentAngle)}°`;
      
      // Update site rotation (subtle effect)
      const siteRotation = currentAngle * 0.1; // Scale down for subtle effect
      document.documentElement.style.setProperty('--site-rotation', `${siteRotation}deg`);
      document.body.classList.add('site-rotated');
      
      // Trigger rolling animation for elements
      const now = Date.now();
      if (now - lastRotationTime > 100) { // Throttle rolling animation
        rollingElements.forEach(element => {
          element.classList.remove('rolling');
          setTimeout(() => {
            element.classList.add('rolling');
          }, 10);
        });
        lastRotationTime = now;
      }
      
      startAngle = angle;
    }
  }

  function updateStats() {
    if (statsNumbers[0]) {
      statsNumbers[0].textContent = interactionCount;
    }
    if (statsNumbers[1]) {
      statsNumbers[1].textContent = steeringTurns;
    }
  }

  // Add hover effects to experience cards
  experienceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});

// Mobile optimizations and gestures
document.addEventListener('DOMContentLoaded', () => {
  // Prevent zoom on double tap for better UX
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  
  // Improve touch scrolling
  document.addEventListener('touchstart', function() {}, { passive: true });
  document.addEventListener('touchmove', function() {}, { passive: true });
  
  // Add mobile-specific hover effects
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Replace hover effects with touch effects
    document.querySelectorAll('.feature-card, .experience-card').forEach(card => {
      card.addEventListener('touchstart', function() {
        this.style.transform = 'translateY(-4px) scale(1.02)';
      });
      
      card.addEventListener('touchend', function() {
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      });
    });
    
    // Improve button touch feedback
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
      });
      
      btn.addEventListener('touchend', function() {
        setTimeout(() => {
          this.style.transform = '';
        }, 100);
      });
    });
    
    // Optimize gallery touch scrolling
    const galleryTrack = document.querySelector('[data-draggable]');
    if (galleryTrack) {
      galleryTrack.style.scrollSnapType = 'x mandatory';
      galleryTrack.style.scrollBehavior = 'smooth';
      
      // Add snap points to gallery items
      document.querySelectorAll('.gallery__item').forEach(item => {
        item.style.scrollSnapAlign = 'center';
      });
    }
  }
  
  // Add pull-to-refresh prevention for better UX
  let startY = 0;
  document.addEventListener('touchstart', function(e) {
    startY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchmove', function(e) {
    const currentY = e.touches[0].clientY;
    const diffY = currentY - startY;
    
    // Prevent pull-to-refresh when scrolling down
    if (diffY > 0 && window.scrollY === 0) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Optimize steering wheel for mobile
  const steeringWheel = document.getElementById('steering-wheel');
  if (steeringWheel && isMobile) {
    // Increase touch target size
    steeringWheel.style.minWidth = '44px';
    steeringWheel.style.minHeight = '44px';
    
    // Add haptic feedback if available
    steeringWheel.addEventListener('touchstart', function() {
      if (navigator.vibrate) {
        navigator.vibrate(10); // Short vibration
      }
    });
  }
  
  // Improve mobile navigation
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('touchstart', function() {
      this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
    
    link.addEventListener('touchend', function() {
      setTimeout(() => {
        this.style.backgroundColor = '';
      }, 150);
    });
  });
  
  // Add mobile-specific loading optimizations
  if (isMobile) {
    // Reduce animation complexity on mobile
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
    
    // Optimize images for mobile
    document.querySelectorAll('img').forEach(img => {
      img.loading = 'lazy';
    });
  }
});

