/*** 🌄 Parallax Scroll Effect ***/
window.addEventListener('scroll', () => {
  document.querySelectorAll('.parallax').forEach(el => {
    const speed = el.dataset.speed || 0.5;
    const yPos = -(window.scrollY * speed);
    el.style.backgroundPosition = `center ${yPos}px`;
  });
});


// === Custom Glowing Dot Cursor ===
  const cursor = document.querySelector('.custom-cursor');

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .clickable').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('custom-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('custom-hover'));
  });



// Cursor enlarge slightly on hover over clickable items
const links = document.querySelectorAll("a, button");

links.forEach(link => {
  link.addEventListener("mouseenter", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(2)";
    cursor.style.backgroundColor = "#ffe07d";
  });
  link.addEventListener("mouseleave", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    cursor.style.backgroundColor = "#fff8cc";
  });
});


  /*** ✨ Fade/Slide Animations for Scrolling Sections ***/
  const animatedEls = document.querySelectorAll('.animate');
  const projects = document.querySelectorAll('.storytelling .project');
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal')) {
          entry.target.classList.add('visible');
        }
        if (entry.target.classList.contains('animate')) {
          entry.target.classList.add('show');
        }
        if (entry.target.classList.contains('project')) {
          entry.target.classList.add('show');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  [...animatedEls, ...projects, ...reveals].forEach(el => observer.observe(el));