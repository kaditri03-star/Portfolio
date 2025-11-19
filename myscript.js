// ======================
// CONFIGURATION
// ======================

const config = {
  typewriter: {
    texts: [
      'Developer',
      'Problem Solver',
      'Tech Enthusiast',
      'Creative Thinker'
    ],
    typingSpeed: 100,
    deletingSpeed: 50,
    delayBetweenTexts: 2000
  }
};

// TODO: Replace with actual project data
const projectsData = [
  {
    id: 1,
    title: 'Project One',
    description: 'A brief description of the first project. Add your actual project details here.',
    fullDescription: 'A comprehensive description of the project, including challenges faced, solutions implemented, and key learnings. Replace this with actual project details.',
    tech: ['React', 'Node.js', 'MongoDB'],
    image: '', // Add image path or leave empty for placeholder
    github: 'https://github.com/kaditri03-star',
    demo: '' // Add demo link if available
  },
  {
    id: 2,
    title: 'Project Two',
    description: 'A brief description of the second project. Add your actual project details here.',
    fullDescription: 'A comprehensive description of the project, including challenges faced, solutions implemented, and key learnings. Replace this with actual project details.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: '',
    github: 'https://github.com/kaditri03-star',
    demo: ''
  },
  {
    id: 3,
    title: 'Project Three',
    description: 'A brief description of the third project. Add your actual project details here.',
    fullDescription: 'A comprehensive description of the project, including challenges faced, solutions implemented, and key learnings. Replace this with actual project details.',
    tech: ['Python', 'Flask', 'PostgreSQL'],
    image: '',
    github: 'https://github.com/kaditri03-star',
    demo: ''
  }
];

// ======================
// STATE MANAGEMENT
// ======================

const state = {
  currentTheme: null,
  menuOpen: false,
  modalOpen: false,
  typewriterIndex: 0,
  typewriterTextIndex: 0,
  isDeleting: false
};

// ======================
// THEME MANAGEMENT
// ======================

function initTheme() {
  // Check for saved theme preference or default to dark mode
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  state.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  // Apply theme
  document.documentElement.setAttribute('data-theme', state.currentTheme);
  updateThemeIcon();
}

function toggleTheme() {
  state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.currentTheme);
  localStorage.setItem('theme', state.currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const themeIcon = document.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = state.currentTheme === 'dark' ? '☀️' : '🌙';
  }
}

// ======================
// NAVIGATION
// ======================

function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Toggle mobile menu
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      state.menuOpen = !state.menuOpen;
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Manage focus trap
      if (state.menuOpen) {
        trapFocus(navMenu);
      } else {
        navToggle.focus();
      }
    });
  }
  
  // Close menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (state.menuOpen) {
        state.menuOpen = false;
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.menuOpen) {
      state.menuOpen = false;
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      navToggle.focus();
    }
  });
}

function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
  
  firstElement.focus();
}

// ======================
// ACTIVE SECTION HIGHLIGHT
// ======================

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// ======================
// TYPEWRITER EFFECT
// ======================

function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;
  
  typewriter();
  
  function typewriter() {
    const currentText = config.typewriter.texts[state.typewriterTextIndex];
    
    if (state.isDeleting) {
      typewriterElement.textContent = currentText.substring(0, state.typewriterIndex - 1);
      state.typewriterIndex--;
    } else {
      typewriterElement.textContent = currentText.substring(0, state.typewriterIndex + 1);
      state.typewriterIndex++;
    }
    
    let typeSpeed = state.isDeleting ? config.typewriter.deletingSpeed : config.typewriter.typingSpeed;
    
    if (!state.isDeleting && state.typewriterIndex === currentText.length) {
      typeSpeed = config.typewriter.delayBetweenTexts;
      state.isDeleting = true;
    } else if (state.isDeleting && state.typewriterIndex === 0) {
      state.isDeleting = false;
      state.typewriterTextIndex = (state.typewriterTextIndex + 1) % config.typewriter.texts.length;
    }
    
    setTimeout(typewriter, typeSpeed);
  }
}

// ======================
// INTERSECTION OBSERVER
// ======================

function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        // Trigger proficiency bar animations
        if (entry.target.classList.contains('proficiency-item')) {
          animateProficiencyBar(entry.target);
        }
      }
    });
  }, observerOptions);
  
  // Observe elements
  const elementsToObserve = document.querySelectorAll(
    '.proficiency-item, .project-card, .timeline-item'
  );
  
  elementsToObserve.forEach(element => {
    observer.observe(element);
  });
}

function animateProficiencyBar(item) {
  const proficiency = item.getAttribute('data-proficiency');
  const fill = item.querySelector('.proficiency-fill');
  
  if (fill && proficiency) {
    setTimeout(() => {
      fill.style.width = `${proficiency}%`;
    }, 200);
  }
}

// ======================
// PROJECTS
// ======================

function initProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;
  
  projectsGrid.innerHTML = projectsData.map(project => `
    <article class="project-card glass-card" data-project-id="${project.id}" tabindex="0" role="button">
      <div class="project-image">
        ${project.image 
          ? `<img src="${project.image}" alt="${project.title}" loading="lazy" width="400" height="200">` 
          : `<div class="project-placeholder">💻</div>`
        }
      </div>
      <h3 class="project-title">${project.title}</h3>
      <p class="project-description">${project.description}</p>
      <div class="project-tech">
        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
      </div>
    </article>
  `).join('');
  
  // Add click and keyboard event listeners
  projectsGrid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectId = parseInt(card.getAttribute('data-project-id'));
      openProjectModal(projectId);
    });
    
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const projectId = parseInt(card.getAttribute('data-project-id'));
        openProjectModal(projectId);
      }
    });
  });
}

function openProjectModal(projectId) {
  const project = projectsData.find(p => p.id === projectId);
  if (!project) return;
  
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  
  modalBody.innerHTML = `
    <h2 id="modal-title">${project.title}</h2>
    ${project.image ? `<img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: 0.75rem; margin-bottom: 1.5rem;">` : ''}
    <p>${project.fullDescription}</p>
    <div class="project-tech" style="margin-top: 1.5rem;">
      ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
    </div>
    <div class="modal-links">
      ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">View Code</a>` : ''}
      ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Live Demo</a>` : ''}
    </div>
  `;
  
  modal.classList.add('active');
  state.modalOpen = true;
  
  // Focus management
  const closeButton = modal.querySelector('.modal-close');
  closeButton.focus();
  
  // Trap focus in modal
  trapFocus(modal.querySelector('.modal-content'));
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  modal.classList.remove('active');
  state.modalOpen = false;
}

function initModal() {
  const modal = document.getElementById('project-modal');
  const closeButton = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  
  // Close on button click
  closeButton.addEventListener('click', closeProjectModal);
  
  // Close on overlay click
  overlay.addEventListener('click', closeProjectModal);
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.modalOpen) {
      closeProjectModal();
    }
  });
}

// ======================
// LAZY LOADING IMAGES
// ======================

function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.src;
    });
  } else {
    // Fallback to Intersection Observer
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });
    
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => imageObserver.observe(img));
  }
}

// ======================
// CONTACT FORM
// ======================

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', handleSubmit);
  
  // Real-time validation
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  const errorElement = document.getElementById(`${fieldName}-error`);
  
  let errorMessage = '';
  
  if (!value) {
    errorMessage = 'This field is required';
  } else if (fieldName === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errorMessage = 'Please enter a valid email address';
    }
  }
  
  if (errorMessage) {
    field.classList.add('error');
    if (errorElement) errorElement.textContent = errorMessage;
    return false;
  } else {
    field.classList.remove('error');
    if (errorElement) errorElement.textContent = '';
    return true;
  }
}

function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const statusElement = document.getElementById('form-status');
  
  // Validate all fields
  const fields = form.querySelectorAll('input, textarea');
  let isValid = true;
  
  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  
  if (!isValid) {
    statusElement.textContent = 'Please fix the errors above';
    statusElement.className = 'form-status error';
    return;
  }
  
  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;
  
  // Mock submission (replace with actual API call)
  setTimeout(() => {
    // SUCCESS CASE
    statusElement.textContent = 'Message sent successfully! I\'ll get back to you soon.';
    statusElement.className = 'form-status success';
    form.reset();
    
    // Reset button
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
    
    // Clear status after 5 seconds
    setTimeout(() => {
      statusElement.textContent = '';
      statusElement.className = 'form-status';
    }, 5000);
  }, 1500);
  
  /* 
   * ACTUAL IMPLEMENTATION: Replace the setTimeout above with a real API call
   * 
   * Example using fetch:
   * 
   * fetch('/api/contact', {
   *   method: 'POST',
   *   headers: {
   *     'Content-Type': 'application/json',
   *   },
   *   body: JSON.stringify({
   *     name: formData.get('name'),
   *     email: formData.get('email'),
   *     subject: formData.get('subject'),
   *     message: formData.get('message')
   *   })
   * })
   * .then(response => {
   *   if (!response.ok) throw new Error('Network response was not ok');
   *   return response.json();
   * })
   * .then(data => {
   *   statusElement.textContent = 'Message sent successfully!';
   *   statusElement.className = 'form-status success';
   *   form.reset();
   * })
   * .catch(error => {
   *   statusElement.textContent = 'Failed to send message. Please try again.';
   *   statusElement.className = 'form-status error';
   * })
   * .finally(() => {
   *   submitButton.textContent = originalButtonText;
   *   submitButton.disabled = false;
   * });
   */
}

// ======================
// SMOOTH SCROLL
// ======================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Don't prevent default for "#" links
      if (href === '#') return;
      
      e.preventDefault();
      
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = document.querySelector('.header').offsetHeight;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ======================
// HEADER SCROLL EFFECT
// ======================

function initHeaderScroll() {
  const header = document.getElementById('header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      header.style.boxShadow = 'none';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }
    
    lastScroll = currentScroll;
  });
}

// ======================
// INITIALIZATION
// ======================

function init() {
  // Initialize all features
  initTheme();
  initNavigation();
  initScrollSpy();
  initTypewriter();
  initIntersectionObserver();
  initProjects();
  initModal();
  initLazyLoading();
  initContactForm();
  initSmoothScroll();
  initHeaderScroll();
  
  // Theme toggle event listener
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      state.currentTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', state.currentTheme);
      updateThemeIcon();
    }
  });
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}