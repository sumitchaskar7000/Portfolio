document.addEventListener('DOMContentLoaded', () => {
  // Initialize variables
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const modeToggle = document.getElementById('modeToggle');
  const resumeBtn = document.getElementById('resumeBtn');
  const contactForm = document.getElementById('contactForm');
  const sections = document.querySelectorAll('section');
  const progressBars = document.querySelectorAll('.progress-bar');

  // Smooth scrolling with offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      const headerOffset = 70;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  });

  // Set initial dark mode icon
  function setDarkModeIcon() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    modeToggle.innerHTML = isDark ? '☀️' : '🌙';
  }

  // Dark mode toggle functionality
  const body = document.body;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
  }

  // Toggle theme
  modeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setDarkModeIcon();
  });

  // Mobile navigation toggle with animation
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !navToggle.contains(e.target) && nav.classList.contains('active')) {
      nav.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });

  // Resume download
  resumeBtn.addEventListener('click', () => {
    window.open('img/Resume1.pdf', '_blank');
  });

  // Form validation with improved UX
  const formInputs = {
    name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
    message: { input: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  // Real-time validation
  Object.entries(formInputs).forEach(([field, { input, error }]) => {
    input.addEventListener('input', () => validateField(field, input, error));
    input.addEventListener('blur', () => validateField(field, input, error));
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate all fields
    Object.entries(formInputs).forEach(([field, { input, error }]) => {
      if (!validateField(field, input, error)) {
        isValid = false;
      }
    });

    if (isValid) {
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'Message sent successfully!';
      contactForm.appendChild(successMessage);

      // Reset form
      contactForm.reset();

      // Remove success message after 3 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    }
  });

  function validateField(field, input, errorElement) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (field) {
      case 'name':
        if (value === '') {
          errorMessage = 'Name is required';
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = 'Name must be at least 2 characters';
          isValid = false;
        }
        break;
      case 'email':
        if (value === '') {
          errorMessage = 'Email is required';
          isValid = false;
        } else if (!isValidEmail(value)) {
          errorMessage = 'Please enter a valid email';
          isValid = false;
        }
        break;
      case 'message':
        if (value === '') {
          errorMessage = 'Message is required';
          isValid = false;
        } else if (value.length < 10) {
          errorMessage = 'Message must be at least 10 characters';
          isValid = false;
        }
        break;
    }

    errorElement.textContent = errorMessage;
    input.style.borderColor = isValid ? 'var(--border-color)' : '#ef4444';
    return isValid;
  }

  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // Scroll-based animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        if (entry.target.classList.contains('progress-bar')) {
          const width = entry.target.style.width;
          entry.target.style.width = '0';
          setTimeout(() => {
            entry.target.style.width = width;
          }, 100);
        }
      }
    });
  }, observerOptions);

  // Observe sections and progress bars
  sections.forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  progressBars.forEach(bar => {
    observer.observe(bar);
  });

  // Header scroll effect
  let lastScroll = 0;
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      header.classList.remove('scroll-up');
      return;
    }

    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
      // Scroll down
      header.classList.remove('scroll-up');
      header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
      // Scroll up
      header.classList.remove('scroll-down');
      header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
  });

  // Interactive Rainbow Trail with Fading and Shrinking Particles
  (function() {
    const canvas = document.getElementById('rainbow-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high-DPI screens
    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle trail state
    const trail = [];
    const maxTrail = 80;
    let hue = 0;
    const baseRadius = 12;
    const fadeSpeed = 0.025; // How quickly particles fade
    const shrinkSpeed = 0.15; // How quickly particles shrink

    // Mouse tracking
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // Add a new particle at the mouse position
      trail.push({
        x: mouse.x,
        y: mouse.y,
        hue: hue,
        alpha: 1,
        radius: baseRadius
      });
      hue = (hue + 6) % 360;
      if (trail.length > maxTrail) trail.shift();
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw and update all particles
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.shadowColor = `hsl(${p.hue}, 100%, 60%)`;
        ctx.shadowBlur = 24;
        ctx.fillStyle = `hsl(${p.hue}, 100%, 60%)`;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore();
        // Fade and shrink
        p.alpha -= fadeSpeed;
        p.radius -= shrinkSpeed;
      }
      // Remove fully faded or shrunk particles
      while (trail.length && (trail[0].alpha <= 0 || trail[0].radius <= 0)) {
        trail.shift();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    animate();
  })();
}); 