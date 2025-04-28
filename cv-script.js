// Canvas setup and particle animation
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const numParticles = 100;

let mouse = {
  x: null,
  y: null,
  radius: 100
};

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

const draculaColors = [
  'rgba(139, 233, 253, 0.6)',
  'rgba(80, 250, 123, 0.4)',
  'rgba(189, 147, 249, 0.5)',
  'rgba(255, 121, 198, 0.4)',
  'rgba(255, 255, 255, 0.3)'
];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = 1 + Math.random() * 1.5;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
    this.color = this.getRandomColor();
  }

  getRandomColor() {
    return draculaColors[Math.floor(Math.random() * draculaColors.length)];
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const maxDistance = mouse.radius;
    const force = (maxDistance - distance) / maxDistance;

    if (distance < mouse.radius) {
      this.x -= forceDirectionX * force * this.density;
      this.y -= forceDirectionY * force * this.density;
    } else {
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / 15;
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / 15;
      }
    }
  }
}

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#282a36");
  gradient.addColorStop(1, "#1a1f28");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  connectParticles();

  requestAnimationFrame(animateParticles);
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const opacity = 1 - (distance / 100);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(139, 233, 253, ${opacity * 0.2})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

// Typing animation
const textToType = "Hello. I'm Thirulokesh.";
const typingElement = document.getElementById('typing-text');
let charIndex = 0;

function typeWriter() {
  if (charIndex < textToType.length) {
    typingElement.innerHTML = textToType.substring(0, charIndex + 1) + '<span class="cursor"></span>';
    charIndex++;
    setTimeout(typeWriter, 100);
  } else {
    typingElement.innerHTML = textToType + '<span class="cursor" style="animation: none; opacity: 1;"></span>';
  }
}

// Scroll animations
function checkVisible() {
  const sections = document.querySelectorAll('.fade-in');

  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 100) {
      section.classList.add('visible');
    }
  });
}

// Smooth scroll improvement with small offset for "View My Projects"
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      // Use a small offset for a smoother scroll (e.g., 50px)
      const offset = targetElement.offsetTop - 50; // Scroll a little less
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  });
});

// Download CV functionality
document.querySelector('.download-button').addEventListener('click', function(e) {
  e.preventDefault();

  const link = document.createElement('a');
  link.href = 'thirulokesh-cv.pdf'; // Make sure this file exists
  link.download = 'Thirulokesh-Alagarsamy-CV.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Hover effects
document.querySelectorAll('.icon-container').forEach(icon => {
  icon.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px)';
    this.style.boxShadow = '0 8px 20px rgba(139, 233, 253, 0.3)';
  });

  icon.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = 'none';
  });
});

document.querySelectorAll('.project-item').forEach(item => {
  item.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px)';
    this.style.transition = 'transform 0.3s ease';
  });

  item.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

// Initialize everything
window.addEventListener('load', () => {
  typeWriter();
  initParticles();
  animateParticles();
  checkVisible();
});

window.addEventListener('scroll', checkVisible);
