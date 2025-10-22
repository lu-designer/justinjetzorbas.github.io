
document.addEventListener('DOMContentLoaded', () => {

/*** 🌄 Parallax Scroll Effect ***/
window.addEventListener('scroll', () => {
  document.querySelectorAll('.parallax').forEach(el => {
    const speed = el.dataset.speed || 0.5;
    const yPos = -(window.scrollY * speed);
    el.style.backgroundPosition = `center ${yPos}px`;
  });
});



 /*** 🎞️ Horizontal Storytelling Scroll — Stable Version ***/
const storytelling = document.querySelector('.storytelling');
const scrollContainer = document.querySelector('.scroll-container');
const track = document.querySelector('.project-track');

if (storytelling && scrollContainer && track) {
  function setStoryHeight() {
    const trackWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;

    if (trackWidth <= viewportWidth) {
      storytelling.style.height = `${window.innerHeight}px`;
      track.style.transform = 'translateX(0)';
      return;
    }

    const horizontalScrollLength = trackWidth - viewportWidth;
    storytelling.style.height = `${window.innerHeight + horizontalScrollLength}px`;
  }

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const start = storytelling.offsetTop;
    const maxScroll = storytelling.offsetHeight - window.innerHeight;

    if (scrollTop < start || maxScroll <= 0) {
      track.style.transform = 'translateX(0)';
      return;
    }

    const progress = Math.min(Math.max((scrollTop - start) / maxScroll, 0), 1);
    const maxTranslate = Math.max(track.scrollWidth - window.innerWidth, 0);
    const translateX = -progress * maxTranslate;
    track.style.transform = `translateX(${translateX}px)`;
  }

  // Recalculate after images fully load
  function initAfterImages() {
    setStoryHeight();
    handleScroll();
  }

  // ✅ Run after all content + images have loaded
  window.addEventListener('load', initAfterImages);

  // ✅ Also run after small delay to catch late layout shifts
  setTimeout(initAfterImages, 800);

  // ✅ Smoothly recalc on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setStoryHeight();
      handleScroll();
    }, 200);
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
}




    
    

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
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


/*** 🔊 Sound Intro + Hero Animation + Fancy Toggle + Parallax ***/
const intro = document.getElementById('sound-intro');
const audio = document.getElementById('ambient-audio');
const toggle = document.getElementById('sound-toggle');
const hero = document.querySelector('.hero');

let isPlaying = false;
let hoverSounds = []; // store all hover sound objects

// 🔈 Smooth fade helper
function fadeAudio(volumeTarget, duration = 1000) {
  const startVol = audio.volume;
  const step = (volumeTarget - startVol) / (duration / 50);
  let currentVol = startVol;
  const fade = setInterval(() => {
    currentVol += step;
    if ((step > 0 && currentVol >= volumeTarget) || (step < 0 && currentVol <= volumeTarget)) {
      audio.volume = volumeTarget;
      clearInterval(fade);
    } else {
      audio.volume = currentVol;
    }
  }, 50);
}

// 🧩 Initialize hover sounds (called after user interaction)
function initHoverSounds() {
  const projects = document.querySelectorAll('.project');
  hoverSounds = []; // reset

  projects.forEach(project => {
    const soundFile = project.getAttribute('data-sound');
    const hoverAudio = new Audio(`audio/${soundFile}`);
    hoverAudio.volume = 0.4;
    hoverAudio.muted = !isPlaying; // respect toggle state
    hoverSounds.push(hoverAudio);

    project.addEventListener('mouseenter', () => {
      if (!hoverAudio.muted) {
        hoverAudio.currentTime = 0;
        hoverAudio.play();
      }
    });
  });
}

// 🎬 Click overlay to start sound + hero animation
intro.addEventListener('click', () => {
  intro.classList.add('hidden');
  audio.volume = 0;
  audio.play().then(() => {
    fadeAudio(0.3, 2000);
    isPlaying = true;
    toggle.classList.add('visible', 'playing');
    toggle.innerHTML = '🔊';
    if (hero) hero.classList.add('hero-visible');

    // ✅ Initialize hover sounds *after* intro click
    initHoverSounds();
  }).catch(err => console.warn('Audio play blocked:', err));
});

// 🎚️ Toggle sound on/off (controls both music & hover effects)
toggle.addEventListener('click', () => {
  if (isPlaying) {
    fadeAudio(0, 500);
    setTimeout(() => audio.pause(), 600);
    toggle.innerHTML = '🔇';
    toggle.classList.remove('playing');
    isPlaying = false;

    // 🔇 Mute all hover sounds
    hoverSounds.forEach(snd => (snd.muted = true));
  } else {
    audio.play().then(() => {
      fadeAudio(0.3, 1000);
      toggle.innerHTML = '🔊';
      toggle.classList.add('playing');
      isPlaying = true;

      // 🔊 Unmute all hover sounds
      hoverSounds.forEach(snd => (snd.muted = false));
    }).catch(err => console.warn('Audio play error:', err));
  }
});



// --- Smooth fade out helper (can reuse your existing fadeAudio) ---
function fadeOutAudio(audioEl, duration = 800) {
  if (!audioEl) return;
  const step = audioEl.volume / (duration / 50);
  let currentVol = audioEl.volume;

  const fade = setInterval(() => {
    currentVol -= step;
    if (currentVol <= 0) {
      audioEl.volume = 0;
      audioEl.pause();
      clearInterval(fade);
    } else {
      audioEl.volume = currentVol;
    }
  }, 50);
}

// --- Fade out audio on internal link clicks ---
document.querySelectorAll('a[href]').forEach(link => {
  // Skip external links and hash links
  if (link.target === "_blank" || link.href.startsWith("#")) return;

  link.addEventListener('click', (e) => {
    if (audio && !audio.paused) {
      e.preventDefault(); // stop immediate navigation
      const targetUrl = link.href;

      fadeOutAudio(audio, 600); // fade out over 0.8s

      // Navigate after fade completes
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 800);
    }
  });
});



// Firefly Cursor Effect

const canvas = document.getElementById("firefly-canvas");
const ctx = canvas.getContext("2d");
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);
let fireflies = [];

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

document.addEventListener("mousemove", (e) => {
  for (let i = 0; i < 1; i++) {  // fewer fireflies per move (was 3)
    fireflies.push({
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 3 + 0.5, // smaller size (was 3 + 1)
      alpha: 1,
      velocityX: (Math.random() - 0.5) * 1,// slower movement (was * 2)
      velocityY: (Math.random() - 0.5) * 1,
    });
  }
});

function animate() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < fireflies.length; i++) {
    let f = fireflies[i];
    f.x += f.velocityX;
    f.y += f.velocityY;
    f.alpha -= 0.01;  // slower fade (was 0.015)

    ctx.beginPath();
    ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 240, 180, ${f.alpha})`; // warm golden glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(255, 240, 180, 0.8)";
    ctx.fill();

    if (f.alpha <= 0) fireflies.splice(i, 1);
  }

  requestAnimationFrame(animate);
}
animate();


// Custom Mouse Cursor

const cursor = document.querySelector(".custom-cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
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



// 🔇 Disable background audio & sound interactions on mobile
if (window.innerWidth <= 768) {
  // Target your ambient audio
  const ambientAudio = document.getElementById('ambient-audio');
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio.currentTime = 0;
    ambientAudio.removeAttribute('autoplay');
    ambientAudio.removeAttribute('loop');
  }

  // Disable sound intro click triggering playback
  const soundIntro = document.getElementById('sound-intro');
  if (soundIntro) {
    soundIntro.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Fade out intro overlay if needed
      soundIntro.style.display = 'none';
    });
  }

  // Also ensure any <audio> tags on the page are muted
  const allAudio = document.querySelectorAll('audio');
  allAudio.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
    audio.removeAttribute('autoplay');
    audio.removeAttribute('loop');
  });
}


// 🔹 Disable cursor animation on mobile
if (window.innerWidth <= 768) {
  const cursorDot = document.querySelector('.cursor-dot');
  if (cursorDot) cursorDot.style.display = 'none';

  // Stop cursor tracking listeners
  document.removeEventListener('mousemove', handleCursorMove);
}

  });

