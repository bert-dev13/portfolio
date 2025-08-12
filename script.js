// DOM Elements
const menu = document.getElementById("menu");
const closeButton = document.getElementById("close-mobile");
const nav = document.getElementById("nav-mobile");
const navLink = document.querySelectorAll(".nav-link");
const header = document.querySelector("header");
const sections = document.querySelectorAll("section");
const skillBoxes = document.querySelectorAll(".skill-box");
const projectCards = document.querySelectorAll(".card");
const contactForm = document.querySelector(".contact-form");

// Electrical Circuit Background Animation
class CircuitBackground {
  constructor() {
    this.canvas = document.getElementById('circuitCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.nodes = [];
    this.connections = [];
    this.shootingStars = [];
    this.particles = [];
    this.mouse = { x: 0, y: 0, active: false };
    
    this.init();
    this.animate();
    this.createShootingStars();
    this.createParticles();
    this.setupEventListeners();
    
    window.addEventListener('resize', () => this.handleResize());
  }
  
  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });
    
    // Add touch support for mobile
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.mouse.x = touch.clientX;
      this.mouse.y = touch.clientY;
      this.mouse.active = true;
    });
  }
  
  init() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    // Create circuit nodes
    for (let i = 0; i < 25; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01
      });
    }
    
    // Create connections between nearby nodes
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(this.nodes[i].x - this.nodes[j].x, 2) + 
          Math.pow(this.nodes[i].y - this.nodes[j].y, 2)
        );
        if (distance < 200) {
          this.connections.push({
            from: i,
            to: j,
            distance: distance,
            pulse: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.03 + 0.02
          });
        }
      }
    }
  }
  
  createShootingStars() {
    setInterval(() => {
      if (this.shootingStars.length < 3) {
        this.shootingStars.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height * 0.3,
          vx: (Math.random() - 0.5) * 8 + 2,
          vy: Math.random() * 3 + 2,
          life: 1,
          decay: Math.random() * 0.02 + 0.01,
          trail: []
        });
      }
    }, 2000);
  }
  
  createParticles() {
    setInterval(() => {
      if (this.particles.length < 15) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
          decay: Math.random() * 0.01 + 0.005,
          size: Math.random() * 3 + 1
        });
      }
    }, 1000);
  }
  
  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
  
  update() {
    // Update nodes with mouse interaction
    this.nodes.forEach(node => {
      node.pulse += node.speed;
      
      // Mouse interaction - nodes pulse more when mouse is near
      if (this.mouse.active) {
        const distance = Math.sqrt(
          Math.pow(node.x - this.mouse.x, 2) + 
          Math.pow(node.y - this.mouse.y, 2)
        );
        if (distance < 150) {
          node.speed = Math.min(node.speed * 1.1, 0.05);
          node.radius = Math.min(node.radius * 1.05, 4);
        } else {
          node.speed = Math.max(node.speed * 0.99, 0.01);
          node.radius = Math.max(node.radius * 0.99, 1);
        }
      }
    });
    
    // Update connections with enhanced electrical flow
    this.connections.forEach(conn => {
      conn.pulse += conn.speed;
      
      // Enhanced electrical flow based on mouse proximity
      if (this.mouse.active) {
        const from = this.nodes[conn.from];
        const to = this.nodes[conn.to];
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const distance = Math.sqrt(
          Math.pow(midX - this.mouse.x, 2) + 
          Math.pow(midY - this.mouse.y, 2)
        );
        if (distance < 100) {
          conn.speed = Math.min(conn.speed * 1.2, 0.08);
        } else {
          conn.speed = Math.max(conn.speed * 0.98, 0.02);
        }
      }
    });
    
    // Update shooting stars with enhanced trails
    this.shootingStars.forEach((star, index) => {
      star.x += star.vx;
      star.y += star.vy;
      star.life -= star.decay;
      star.trail.push({ x: star.x, y: star.y, life: 1 });
      
      // Remove old trail points
      star.trail = star.trail.filter(point => {
        point.life -= 0.02;
        return point.life > 0;
      });
      
      // Remove dead shooting stars
      if (star.life <= 0) {
        this.shootingStars.splice(index, 1);
      }
    });
    
    // Update particles with enhanced movement
    this.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= particle.decay;
      
      // Mouse interaction for particles
      if (this.mouse.active) {
        const distance = Math.sqrt(
          Math.pow(particle.x - this.mouse.x, 2) + 
          Math.pow(particle.y - this.mouse.y, 2)
        );
        if (distance < 100) {
          const angle = Math.atan2(this.mouse.y - particle.y, this.mouse.x - particle.x);
          particle.vx += Math.cos(angle) * 0.1;
          particle.vy += Math.sin(angle) * 0.1;
        }
      }
      
      // Bounce off edges with energy loss
      if (particle.x <= 0 || particle.x >= this.width) {
        particle.vx *= -0.8;
        particle.x = Math.max(0, Math.min(this.width, particle.x));
      }
      if (particle.y <= 0 || particle.y >= this.height) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(this.height, particle.y));
      }
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(index, 1);
      }
    });
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw connections with enhanced electrical effects
    this.connections.forEach(conn => {
      const from = this.nodes[conn.from];
      const to = this.nodes[conn.to];
      const alpha = (Math.sin(conn.pulse) + 1) * 0.3 + 0.1;
      
      // Enhanced connection line with glow
      this.ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
      this.ctx.lineWidth = 1;
      this.ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
      this.ctx.shadowBlur = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(from.x, from.y);
      this.ctx.lineTo(to.x, to.y);
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
      
      // Draw energy flow with enhanced visual
      const flowX = from.x + (to.x - from.x) * (Math.sin(conn.pulse) + 1) * 0.5;
      const flowY = from.y + (to.y - from.y) * (Math.sin(conn.pulse) + 1) * 0.5;
      
      // Energy pulse effect
      this.ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.8})`;
      this.ctx.beginPath();
      this.ctx.arc(flowX, flowY, 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Energy glow
      this.ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.3})`;
      this.ctx.beginPath();
      this.ctx.arc(flowX, flowY, 6, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    // Draw nodes with enhanced effects
    this.nodes.forEach(node => {
      const alpha = (Math.sin(node.pulse) + 1) * 0.4 + 0.2;
      const radius = node.radius + Math.sin(node.pulse) * 1;
      
      // Outer glow
      this.ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.1})`;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius + 8, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Middle glow
      this.ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.3})`;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius + 3, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Node core
      this.ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Inner highlight
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
      this.ctx.beginPath();
      this.ctx.arc(node.x - radius * 0.3, node.y - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    // Draw shooting stars with enhanced trails and effects
    this.shootingStars.forEach(star => {
      // Draw trail with gradient effect
      star.trail.forEach((point, index) => {
        const alpha = point.life * 0.8;
        const trailWidth = point.life * 3;
        
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.lineWidth = trailWidth;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        if (index > 0) {
          this.ctx.lineTo(star.trail[index - 1].x, star.trail[index - 1].y);
        }
        this.ctx.stroke();
      });
      
      // Draw shooting star with enhanced glow
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.life})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Enhanced glow layers
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.life * 0.3})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.fillStyle = `rgba(0, 255, 255, ${star.life * 0.2})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, 12, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    // Draw particles with enhanced effects
    this.particles.forEach(particle => {
      const alpha = particle.life * 0.6;
      
      // Particle glow
      this.ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.3})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size + 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Particle core
      this.ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    // Draw mouse interaction effects
    if (this.mouse.active) {
      // Mouse ripple effect
      this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, 50, 0, Math.PI * 2);
      this.ctx.stroke();
      
      this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, 80, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }
  
  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize circuit background
const circuitBackground = new CircuitBackground();

// Scroll Progress Indicator
function updateScrollProgress() {
  const scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  }
}

window.addEventListener('scroll', updateScrollProgress);

// Mobile Navigation
menu.addEventListener("click", () => {
  nav.classList.add("show");
  document.body.style.overflow = "hidden"; // Prevent background scroll
});

closeButton.addEventListener("click", () => {
  nav.classList.remove("show");
  document.body.style.overflow = "auto"; // Restore scroll
});

navLink.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("show");
    document.body.style.overflow = "auto";
  });
});

// Close mobile nav when clicking outside
document.addEventListener("click", (e) => {
  if (!nav.contains(e.target) && !menu.contains(e.target)) {
    nav.classList.remove("show");
    document.body.style.overflow = "auto";
  }
});

// Header scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Enhanced smooth scrolling with offset
function smoothScrollTo(targetId) {
  const target = document.querySelector(targetId);
  if (target) {
    const headerHeight = header.offsetHeight;
    const targetPosition = target.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Enhanced navigation link handling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    smoothScrollTo(targetId);
    
    // Close mobile nav if open
    if (nav.classList.contains('show')) {
      nav.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  });
});

// Enhanced intersection observer with better performance
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      
      // Add staggered animation for child elements
      const animatedElements = entry.target.querySelectorAll('[data-aos]');
      animatedElements.forEach((el, index) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }
  });
}, observerOptions);

// Observe sections for animation
sections.forEach(section => {
  section.classList.add('reveal');
  observer.observe(section);
});

// Enhanced skill box interactions
skillBoxes.forEach(box => {
  box.addEventListener("mouseenter", () => {
    box.style.transform = "translateY(-10px) scale(1.05)";
    box.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.4)";
  });
  
  box.addEventListener("mouseleave", () => {
    box.style.transform = "translateY(0) scale(1)";
    box.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  });
  
  // Add click interaction
  box.addEventListener("click", () => {
    box.style.transform = "scale(0.95)";
    setTimeout(() => {
      box.style.transform = "scale(1)";
    }, 150);
  });
});

// Enhanced project card interactions
projectCards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)";
    card.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.4)";
  });
  
  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
    card.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  });
  
  // Add click interaction for project buttons
  const projectButton = card.querySelector('.btn-primary');
  if (projectButton) {
    projectButton.addEventListener('click', (e) => {
      e.preventDefault();
      showNotification('Project details coming soon!', 'info');
    });
  }
});

// Enhanced form validation and submission
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value.trim();
    const email = contactForm.querySelector('input[type="email"]').value.trim();
    const message = contactForm.querySelector('textarea').value.trim();
    
    // Enhanced validation
    if (!name || !email || !message) {
      showNotification("Please fill in all required fields (Name, Email, and Message)", "error");
      return;
    }
    
    if (name.length < 2) {
      showNotification("Name must be at least 2 characters long", "error");
      return;
    }
    
    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }
    
    if (message.length < 10) {
      showNotification("Message must be at least 10 characters long", "error");
      return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
      showNotification("Message sent successfully! I'll get back to you soon.", "success");
      contactForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });
  
  // Real-time validation feedback
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    input.addEventListener('input', () => {
      clearFieldError(input);
    });
  });
}

// Field validation function
function validateField(field) {
  const value = field.value.trim();
  
  if (field.hasAttribute('required') && !value) {
    showFieldError(field, 'This field is required');
    return false;
  }
  
  if (field.type === 'email' && value && !isValidEmail(value)) {
    showFieldError(field, 'Please enter a valid email address');
    return false;
  }
  
  if (field.type === 'text' && field.placeholder.includes('Name') && value.length < 2) {
    showFieldError(field, 'Name must be at least 2 characters long');
    return false;
  }
  
  if (field.tagName === 'TEXTAREA' && value.length < 10) {
    showFieldError(field, 'Message must be at least 10 characters long');
    return false;
  }
  
  return true;
}

// Show field error
function showFieldError(field, message) {
  clearFieldError(field);
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    color: #f44336;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    animation: slideIn 0.3s ease;
  `;
  
  field.parentNode.appendChild(errorDiv);
  field.style.borderColor = '#f44336';
}

// Clear field error
function clearFieldError(field) {
  const errorDiv = field.parentNode.querySelector('.field-error');
  if (errorDiv) {
    errorDiv.remove();
  }
  field.style.borderColor = 'rgba(255, 255, 255, 0.1)';
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Enhanced notification system with better positioning
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach(notification => {
    notification.remove();
  });
  
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Close notification">&times;</button>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);
  
  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto remove after 6 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => notification.remove(), 300);
    }
  }, 6000);
}

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Enhanced typing effect with better performance
function typeWriter(element, text, speed = 100) {
  if (!element || !text) return;
  
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize enhanced features when page loads
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  
  // Initialize typing effect
  const heroTitle = document.querySelector(".hero .container .content h1");
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 50);
  }
  
  // Add interactive elements class
  const interactiveElements = document.querySelectorAll('.skill-box, .card, .contact-item, .category, button, a');
  interactiveElements.forEach(el => {
    el.classList.add('interactive-element');
  });
  
  // Initialize scroll progress
  updateScrollProgress();
});

// Enhanced scroll reveal with better performance
function revealOnScroll() {
  const elements = document.querySelectorAll(".reveal");
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

// Initialize AOS with enhanced settings
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100,
    delay: 100,
    disable: 'mobile' // Disable on mobile for better performance
  });
}

// Add CSS animation for field errors
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
