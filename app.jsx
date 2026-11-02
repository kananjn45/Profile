// ==========================================================================
// Kanan Jain — Personal Portfolio (React + Tailwind CSS)
// Built with empathy, clarity, and craft. Zero emojis.
// ==========================================================================

const { useState, useEffect, useRef } = React;

// Import Firebase config
import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

let db = null;
if (isFirebaseConfigured()) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (err) {
    console.warn('Firebase notice:', err.message);
  }
}

// ==========================================================================
// Hero Particle Background (Petals in Light Mode, Snow in Dark Mode)
// ==========================================================================
function HeroParticles({ isDark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor(canvas, isDark) {
        this.canvas = canvas;
        this.reset(isDark, true);
      }

      reset(isDark, initial = false) {
        this.x = Math.random() * this.canvas.width;
        this.y = initial ? Math.random() * this.canvas.height : -20;
        this.isDark = isDark;

        if (isDark) {
          // Soft Snowfall
          this.size = Math.random() * 2.4 + 1.2;
          this.speedY = Math.random() * 0.8 + 0.35;
          this.speedX = Math.random() * 0.4 - 0.2;
          this.opacity = Math.random() * 0.55 + 0.25;
          this.wobble = Math.random() * Math.PI * 2;
          this.wobbleSpeed = Math.random() * 0.015 + 0.008;
        } else {
          // Delicate Falling Flower Petals
          this.size = Math.random() * 7 + 5;
          this.speedY = Math.random() * 1.1 + 0.55;
          this.speedX = Math.random() * 0.5 - 0.25;
          this.opacity = Math.random() * 0.45 + 0.35;
          this.angle = Math.random() * Math.PI * 2;
          this.angularSpeed = (Math.random() - 0.5) * 0.02;
          this.wobble = Math.random() * Math.PI * 2;
          this.wobbleSpeed = Math.random() * 0.02 + 0.01;
          const colors = [
            'rgba(246, 226, 233, ',
            'rgba(238, 206, 217, ',
            'rgba(242, 214, 223, ',
            'rgba(224, 195, 205, '
          ];
          this.colorBase = colors[Math.floor(Math.random() * colors.length)];
        }
      }

      update(isDark) {
        if (this.isDark !== isDark) {
          this.reset(isDark);
        }
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.6;
        this.y += this.speedY;

        if (!isDark) {
          this.angle += this.angularSpeed;
        }

        if (this.y > this.canvas.height + 25 || this.x < -25 || this.x > this.canvas.width + 25) {
          this.reset(isDark, false);
        }
      }

      draw(ctx, isDark) {
        ctx.save();
        if (isDark) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
          ctx.fill();
        } else {
          ctx.translate(this.x, this.y);
          ctx.rotate(this.angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fillStyle = `${this.colorBase}${this.opacity})`;
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const particleCount = 38;
    const particles = Array.from({ length: particleCount }, () => new Particle(canvas, isDark));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update(isDark);
        p.draw(ctx, isDark);
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
}

// ==========================================================================
// Top Announcement Strip (Updated: Projects, Freelance, Part-time, Internships)
// ==========================================================================
function AnnouncementStrip() {
  return (
    <div className="bg-[#F6E2E9] dark:bg-[#1C251E] text-[#1C241E] dark:text-[#E8F0E7] border-b border-[#B8CFB3]/40 dark:border-[#2E3C30] py-2 px-4 text-xs font-medium transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4D684B] dark:bg-[#A3C49D] animate-pulse"></span>
          <span>Open for Projects &middot; Freelance &middot; Part-Time &middot; Internships</span>
        </div>
        <div className="flex items-center gap-2 text-[#4A564C] dark:text-[#A3B4A2]">
          <span>BCA Student at IITM</span>
          <span>&middot;</span>
          <span>Delhi, India</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// Simplified, Approachable Navigation Bar
// ==========================================================================
function Navbar({ isDark, setIsDark }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FEFAF3]/90 dark:bg-[#141A15]/90 border-b border-[#B8CFB3]/30 dark:border-[#273529] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        
        {/* Brand */}
        <a href="#hero" className="flex items-center gap-2 text-[#1C241E] dark:text-[#F2F6F2] group">
          <span className="font-serif italic text-2xl font-semibold text-[#4D684B] dark:text-[#A3C49D]">KJ</span>
          <span className="text-sm font-semibold tracking-tight">Kanan Jain</span>
        </a>

        {/* Desktop Links (Simple & Human) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4A564C] dark:text-[#A8BBA7]">
          <a href="#about" className="hover:text-[#4D684B] dark:hover:text-[#F2F6F2] transition-colors">About</a>
          <a href="#projects" className="hover:text-[#4D684B] dark:hover:text-[#F2F6F2] transition-colors">Projects</a>
          <a href="#skills" className="hover:text-[#4D684B] dark:hover:text-[#F2F6F2] transition-colors">Skills</a>
          <a href="#experience" className="hover:text-[#4D684B] dark:hover:text-[#F2F6F2] transition-colors">Experience</a>
          <a href="#contact" className="hover:text-[#4D684B] dark:hover:text-[#F2F6F2] transition-colors">Contact</a>
        </nav>

        {/* Actions & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button 
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle Theme"
            className="p-2 rounded-full border border-[#B8CFB3]/50 dark:border-[#2E3C30] text-[#4A564C] dark:text-[#F2F6F2] hover:bg-[#F6E2E9]/60 dark:hover:bg-[#1E281F] transition-all"
            title={isDark ? "Switch to Light Theme (Flower Petals)" : "Switch to Dark Theme (Snowfall)"}
          >
            <i className={`fas ${isDark ? 'fa-sun text-amber-300' : 'fa-moon text-[#4D684B]'}`}></i>
          </button>

          {/* Resume PDF */}
          <a 
            href="assets/Kanan_Jain_Resume.pdf" 
            target="_blank" 
            download="Kanan_Jain_Resume.pdf"
            className="px-4 py-2 rounded-full border border-[#84A282] text-xs font-semibold text-[#1C241E] dark:text-[#F2F6F2] hover:bg-[#B8CFB3]/30 dark:hover:bg-[#1E281F] transition-all flex items-center gap-2"
          >
            <i className="fas fa-file-pdf"></i>
            <span>Resume</span>
          </a>

          {/* Contact Button */}
          <a 
            href="#contact"
            className="px-4 py-2 rounded-full bg-[#4D684B] dark:bg-[#84A282] text-white text-xs font-semibold hover:bg-[#3B5139] dark:hover:bg-[#6E8B6C] transition-all shadow-sm"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full border border-[#B8CFB3]/50 dark:border-[#2E3C30] text-[#1C241E] dark:text-[#F2F6F2]"
          >
            <i className={`fas ${isDark ? 'fa-sun text-amber-300' : 'fa-moon text-[#4D684B]'}`}></i>
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1C241E] dark:text-[#F2F6F2]"
            aria-label="Toggle Menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FEFAF3] dark:bg-[#141A15] border-b border-[#B8CFB3]/40 dark:border-[#273529] px-6 py-6 flex flex-col gap-4 text-base font-medium text-[#1C241E] dark:text-[#F2F6F2]">
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
          <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)}>Experience</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <div className="pt-2 flex flex-col gap-2">
            <a 
              href="assets/Kanan_Jain_Resume.pdf" 
              target="_blank" 
              download
              className="w-full text-center py-2.5 rounded-full border border-[#84A282] text-xs font-semibold"
            >
              <i className="fas fa-file-pdf mr-2"></i>Download Resume
            </a>
            <a 
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-[#4D684B] text-white text-xs font-semibold"
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

// ==========================================================================
// Hero Section with Canvas Background Particles
// ==========================================================================
function Hero({ isDark }) {
  return (
    <section id="hero" className="relative overflow-hidden py-6 sm:py-10 md:py-16 border-b border-[#B8CFB3]/25 dark:border-[#273529] transition-colors">
      
      {/* Particle background in Hero: Petals in light, Snow in dark */}
      <HeroParticles isDark={isDark} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6E2E9] dark:bg-[#202C21] border border-[#F6E2E9] dark:border-[#2B3A2C] text-xs font-semibold text-[#4D684B] dark:text-[#A3C49D] uppercase tracking-wider mb-2.5 sm:mb-4">
              <span>Developer & Creative Problem Solver</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1C241E] dark:text-[#F2F6F2] font-normal leading-tight tracking-tight mb-2.5 sm:mb-4">
              Building thoughtful web apps, accessible tools, and practical AI.
            </h1>

            <p className="text-sm sm:text-lg text-[#4A564C] dark:text-[#A8BBA7] leading-relaxed mb-4 sm:mb-6 max-w-xl">
              Hi, I am Kanan. I am a software developer and BCA student based in Delhi. I love building clean, helpful software — whether that is offline tools for emergency safety, smart voice assistants for local merchants, or accessible learning apps. Open for exciting projects, freelance work, and engineering roles.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 mb-4 sm:mb-6">
              <a 
                href="#projects" 
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#84A282] text-white font-medium text-xs sm:text-sm hover:bg-[#6F8E6D] transition-all shadow-md flex items-center gap-2"
              >
                <span>See My Projects</span>
                <i className="fas fa-arrow-down text-xs"></i>
              </a>
              <a 
                href="assets/Kanan_Jain_Resume.pdf" 
                target="_blank" 
                download
                className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-full border border-[#B8CFB3] dark:border-[#354637] text-[#1C241E] dark:text-[#F2F6F2] font-medium text-xs sm:text-sm hover:bg-[#FEFAF3] dark:hover:bg-[#1A231C] transition-all flex items-center gap-2"
              >
                <i className="fas fa-file-pdf text-xs"></i>
                <span>Resume (PDF)</span>
              </a>
              <a 
                href="https://github.com/kananjn45" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-2 text-[#4A564C] dark:text-[#A8BBA7] hover:text-[#1C241E] dark:hover:text-[#F2F6F2] text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <i className="fab fa-github"></i>
                <span>GitHub</span>
              </a>
            </div>

            {/* 3 Flowing Value Highlights */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-3 sm:pt-5 border-t border-[#B8CFB3]/30 dark:border-[#273529]">
              <div>
                <span className="font-mono text-xs font-semibold text-[#84A282] dark:text-[#A3C49D]">01</span>
                <strong className="block text-sm font-semibold text-[#1C241E] dark:text-[#F2F6F2] mt-0.5">Thoughtful Design</strong>
                <span className="text-xs text-[#526054] dark:text-[#8E9F90] mt-0.5 block">Accessible, calm interfaces that feel effortless.</span>
              </div>
              <div>
                <span className="font-mono text-xs font-semibold text-[#84A282] dark:text-[#A3C49D]">02</span>
                <strong className="block text-sm font-semibold text-[#1C241E] dark:text-[#F2F6F2] mt-0.5">Practical Solutions</strong>
                <span className="text-xs text-[#526054] dark:text-[#8E9F90] mt-0.5 block">Solving real human friction with technology.</span>
              </div>
              <div>
                <span className="font-mono text-xs font-semibold text-[#84A282] dark:text-[#A3C49D]">03</span>
                <strong className="block text-sm font-semibold text-[#1C241E] dark:text-[#F2F6F2] mt-0.5">Dependable Code</strong>
                <span className="text-xs text-[#526054] dark:text-[#8E9F90] mt-0.5 block">Fast, reliable software written with care and pride.</span>
              </div>
            </div>

          </div>

          {/* Right Portrait Column */}
          <div className="lg:col-span-5 flex justify-center mt-4 sm:mt-6 lg:mt-0">
            <div className="relative max-w-[260px] sm:max-w-sm w-full">
              
              {/* Photo Frame */}
              <div className="rounded-3xl overflow-hidden bg-[#F6E2E9]/70 dark:bg-[#1C261E] border border-[#B8CFB3]/60 dark:border-[#2E3C30] shadow-xl aspect-[4/4.8]">
                <img 
                  src="assets/profile.png" 
                  alt="Kanan Jain" 
                  className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              {/* Approachable Floating Card */}
              <div className="absolute -bottom-3 left-2 right-2 sm:-bottom-4 sm:left-4 sm:right-4 bg-white/95 dark:bg-[#18221A]/95 backdrop-blur-sm border border-[#B8CFB3]/40 dark:border-[#2D3C2F] rounded-2xl p-2.5 sm:p-4 shadow-lg flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#F6E2E9] dark:bg-[#253327] flex items-center justify-center text-[#4D684B] dark:text-[#A3C49D] text-sm sm:text-base shrink-0">
                  <i className="fas fa-heart"></i>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#1C241E] dark:text-[#F2F6F2] truncate">Woman in Tech & Builder</div>
                  <div className="text-[11px] text-[#526054] dark:text-[#95A796] truncate">Passionate about inclusive, real-world solutions</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ==========================================================================
// About Me Section (Authentic & Personal)
// ==========================================================================
function About() {
  return (
    <section id="about" className="py-6 sm:py-10 md:py-16 bg-white/50 dark:bg-[#161D17]/50 border-b border-[#B8CFB3]/25 dark:border-[#273529] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-start">
          
          <div className="lg:col-span-7">
            <span className="font-mono text-xs uppercase tracking-widest text-[#4D684B] dark:text-[#A3C49D] font-semibold">About Me</span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1C241E] dark:text-[#F2F6F2] font-normal mt-1 mb-3 sm:mb-5">
              A developer who cares about people, clarity, and genuine impact.
            </h2>
            <div className="space-y-3 text-[#4A564C] dark:text-[#A8BBA7] text-sm sm:text-base leading-relaxed">
              <p>
                My path into technology started with a simple belief: good software should make everyday life easier, not more complicated. As a woman studying computer applications at IITM Delhi, I enjoy exploring the balance between clean frontend interfaces, responsive full-stack backends, and practical machine learning.
              </p>
              <p>
                From leading our student team on national challenges to building offline tools that work with zero internet, I believe the best code comes from understanding real people first. I am always excited to take on challenging projects, collaborate with teams, and build software that matters.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
              <span className="px-3 py-1.5 rounded-full bg-[#FEFAF3] dark:bg-[#1E281F] border border-[#B8CFB3]/40 dark:border-[#2D3C2F] text-xs font-medium text-[#1C241E] dark:text-[#E8F0E7] flex items-center gap-1.5">
                <i className="fas fa-trophy text-[#84A282]"></i>
                <span>Top 6 Dextrix & Top 15 Nexhack</span>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#FEFAF3] dark:bg-[#1E281F] border border-[#B8CFB3]/40 dark:border-[#2D3C2F] text-xs font-medium text-[#1C241E] dark:text-[#E8F0E7] flex items-center gap-1.5">
                <i className="fas fa-graduation-cap text-[#84A282]"></i>
                <span>Class Representative, IITM Delhi</span>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#FEFAF3] dark:bg-[#1E281F] border border-[#B8CFB3]/40 dark:border-[#2D3C2F] text-xs font-medium text-[#1C241E] dark:text-[#E8F0E7] flex items-center gap-1.5">
                <i className="fas fa-microphone text-[#84A282]"></i>
                <span>Lafz Literary & Debate Society</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#FEFAF3] dark:bg-[#1A231B] border border-[#B8CFB3]/35 dark:border-[#2D3C2F] rounded-2xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-serif text-lg sm:text-xl text-[#1C241E] dark:text-[#F2F6F2] font-semibold mb-3 sm:mb-4">What Drives My Work</h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-[#84A282] dark:bg-[#A3C49D] mt-1.5 shrink-0"></div>
                <div>
                  <strong className="block text-xs sm:text-sm font-semibold text-[#1C241E] dark:text-[#F2F6F2]">Accessibility by Default</strong>
                  <p className="text-xs text-[#526054] dark:text-[#95A796] mt-0.5 leading-relaxed">
                    Building tools that everyone can comfortably use, including sign language speakers and users in low-connectivity areas.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-[#84A282] dark:bg-[#A3C49D] mt-1.5 shrink-0"></div>
                <div>
                  <strong className="block text-xs sm:text-sm font-semibold text-[#1C241E] dark:text-[#F2F6F2]">Empathy in Engineering</strong>
                  <p className="text-xs text-[#526054] dark:text-[#95A796] mt-0.5 leading-relaxed">
                    Listening to real human friction before designing complex technical architectures.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-[#84A282] dark:bg-[#A3C49D] mt-1.5 shrink-0"></div>
                <div>
                  <strong className="block text-xs sm:text-sm font-semibold text-[#1C241E] dark:text-[#F2F6F2]">Community & Continuous Learning</strong>
                  <p className="text-xs text-[#526054] dark:text-[#95A796] mt-0.5 leading-relaxed">
                    Supporting peers, welcoming diverse ideas, and embracing new challenges with curiosity.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

// ==========================================================================
// Projects Section (Accurately Credited, Leading with ORCA-Intel & Awaaz)
// ==========================================================================
function Projects() {
  const primaryProjects = [
    {
      id: "orca",
      title: "ORCA-Intel — Safe Sea Navigation for Fishermen",
      badge: "Smart India Hackathon 2026 Nominee (ISRO)",
      category: "Lead Project & Maritime Safety",
      lead: "Led our student team (BitVerse 404) to address ISRO's coastal safety challenge. Traditional satellite sea charts are difficult to read on small boats, and strong ocean currents can push fishermen across international borders. ORCA-Intel runs 100% offline on an Android phone, guiding them toward rich fishing zones and giving a proactive 15-minute advance alert before approaching boundary waters.",
      highlights: [
        { label: "100% Works Without Internet", text: "Downloads a compact 5.8 MB pack at the harbor so maps and sirens work anywhere in deep sea." },
        { label: "Spoken Local Languages", text: "Speaks clear audio alerts in Hindi, Tamil, and Telugu so boat skippers stay focused." }
      ],
      metrics: [
        { num: "15 Mins", label: "Early Border Warning" },
        { num: "20% - 30%", label: "Fuel Saved via Smart Routes" },
        { num: "Offline", label: "Zero Cellular Data Required" }
      ],
      tags: ["Flutter", "Python", "FastAPI", "SQLite", "Bhashini Voice AI"],
      github: "https://github.com/kananjn45/ORCA-Intel"
    },
    {
      id: "awaaz",
      title: "Awaaz Mobile — Real-Time Sign Language Translator",
      badge: "Top 6 Finalist, Dextrix Hackathon (Feb 2026)",
      category: "Mobile & Accessibility",
      lead: "Built during Dextrix Hackathon to bridge communication for deaf and hard-of-hearing individuals. Awaaz captures Indian Sign Language hand gestures directly through the phone camera and translates them into spoken voice and clear on-screen text in real time, running completely on-device without needing internet.",
      highlights: [
        { label: "Real-Time Hand Tracking", text: "Tracks 21 distinct hand landmarks using MediaPipe to understand signs with zero cloud lag." },
        { label: "Completely Offline", text: "Lightweight on-device neural network that works in remote places with zero connectivity." }
      ],
      metrics: [
        { num: "Top 6", label: "Dextrix Hackathon Sprint" },
        { num: "21 Points", label: "Real-Time Hand Tracking" },
        { num: "Zero Lag", label: "On-Device Offline Inference" }
      ],
      tags: ["Flutter", "MediaPipe", "TensorFlow Lite", "Python", "Chaquopy"],
      github: "https://github.com/kananjn45"
    },
    {
      id: "setu",
      title: "SETU — Smart Soundbox Assistant for Retailers",
      badge: "Paytm Build for India Hackathon",
      category: "Retail Voice Assistant",
      lead: "When a customer scans a shop's QR code to pay but the soundbox stays silent or lags, the counter stalls. SETU lets the shopkeeper simply ask aloud in their mother tongue ('Setu, did 500 arrive?') and verifies the bank records in seconds so shopkeepers do not have to guess or call customer support.",
      highlights: [
        { label: "Fast Spoken Confirmation", text: "Speaks the verified status and last digits of the payment in under 3 seconds in Hindi, Tamil, or Telugu." },
        { label: "Fake Payment Protection", text: "Scans payment screenshots to catch fake spoof apps and guarantees chimes only play on real credits." }
      ],
      metrics: [
        { num: "< 45s", label: "Full Dispute Resolution" },
        { num: "< 3s", label: "Voice Reply at Counter" },
        { num: "3 Languages", label: "Hindi, Tamil & Telugu" }
      ],
      tags: ["Python", "Sarvam Voice AI", "FastAPI", "LangGraph", "Vision OCR"],
      github: "https://github.com/kananjn45/Setu-AI-Autonomous"
    }
  ];

  const secondaryProjects = [
    {
      title: "Raksha — Zero-Internet Emergency Mesh Network",
      badge: "Top 15 Finalist, Nexhack (Sept 2026)",
      category: "Emergency & Safety",
      desc: "Built for disaster areas and cell dead-zones. Uses Bluetooth Low Energy (BLE) and Wi-Fi Direct to create an automatic phone-to-phone chain, relaying encrypted 1-tap SOS distress alerts directly without mobile networks.",
      tags: ["Android", "BLE 5.0", "Wi-Fi Direct", "AES-256", "Offline Mesh"],
      github: "https://github.com/kananjn45"
    },
    {
      title: "Cognify — Adaptive Learning Companion for Kids",
      badge: "Matrix Hackathon (April 2026)",
      category: "Education & Accessibility",
      desc: "An adaptive web companion for children with developmental barriers. Notices signs of frustration through gentle camera tracking in real time, automatically slowing down lessons and softening colors to keep learning positive.",
      tags: ["React.js", "Firebase", "OpenCV", "Python", "Vercel"],
      github: "https://github.com/kananjn45/Cognify"
    },
    {
      title: "BingeBuddy — Real-Time Watch Party",
      badge: "Full-Stack Web App",
      category: "Web & Real-Time",
      desc: "A fun synchronized watch-party platform where friends can watch YouTube videos together with synchronized play, pause, and seek controls, plus host controls and a live room chat.",
      tags: ["React.js", "JavaScript", "Node.js", "Socket.IO", "MongoDB"],
      github: "https://github.com/kananjn45/BingeBuddy"
    }
  ];

  return (
    <section id="projects" className="py-6 sm:py-10 md:py-16 border-b border-[#B8CFB3]/25 dark:border-[#273529] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="max-w-2xl mb-4 sm:mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#4D684B] dark:text-[#A3C49D] font-semibold">Featured Work</span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#1C241E] dark:text-[#F2F6F2] font-normal mt-1 mb-2">
            Projects Built with Purpose
          </h2>
          <p className="text-xs sm:text-base text-[#4A564C] dark:text-[#A8BBA7]">
            Here is a selection of projects showing how I combine frontend polish, practical AI, and real-world usefulness.
          </p>
        </div>

        {/* Featured Flagship Case Studies */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-5 sm:mb-8">
          {primaryProjects.map((p) => (
            <article 
              key={p.id}
              className="bg-white dark:bg-[#182119] border border-[#B8CFB3]/35 dark:border-[#2B3A2C] rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#B8CFB3]/25 dark:border-[#273529] mb-3 sm:mb-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase text-[#4D684B] dark:text-[#A3C49D]">{p.category}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F6E2E9] dark:bg-[#223023] text-[11px] sm:text-xs font-medium text-[#1C241E] dark:text-[#DCE8DB]">{p.badge}</span>
                </div>
                <a 
                  href={p.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FEFAF3] dark:bg-[#1E281F] border border-[#B8CFB3]/40 dark:border-[#324334] text-[#4A564C] dark:text-[#DCE8DB] hover:text-[#1C241E] transition-colors"
                >
                  <i className="fab fa-github"></i>
                  <span>GitHub</span>
                </a>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
                
                <div className="lg:col-span-8">
                  <h3 className="font-serif text-lg sm:text-2xl lg:text-3xl text-[#1C241E] dark:text-[#F2F6F2] font-medium mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-base text-[#4A564C] dark:text-[#A8BBA7] leading-relaxed mb-3 sm:mb-5">
                    {p.lead}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FEFAF3] dark:bg-[#131A14] border border-[#B8CFB3]/30 dark:border-[#243226] mb-3 sm:mb-5">
                    {p.highlights.map((h, i) => (
                      <div key={i}>
                        <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#4D684B] dark:text-[#A3C49D] mb-0.5">{h.label}</h4>
                        <p className="text-xs text-[#526054] dark:text-[#95A796] leading-relaxed">{h.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {p.tags.map((t, i) => (
                      <span key={i} className="font-mono text-[11px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-md bg-[#FEFAF3] dark:bg-[#1A231B] border border-[#B8CFB3]/40 dark:border-[#2A392C] text-[#526054] dark:text-[#9FB2A1]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-[#FEFAF3] dark:bg-[#131A14] border border-[#B8CFB3]/40 dark:border-[#273529] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-row lg:flex-col justify-around lg:justify-start gap-2.5 sm:gap-4">
                  {p.metrics.map((m, i) => (
                    <div key={i} className="pb-0 lg:pb-2.5 border-b-0 lg:border-b border-[#B8CFB3]/25 dark:border-[#253227] last:border-b-0 last:pb-0 text-center lg:text-left">
                      <div className="font-serif text-base sm:text-xl font-bold text-[#4D684B] dark:text-[#A3C49D]">{m.num}</div>
                      <div className="text-[10px] sm:text-xs font-semibold text-[#526054] dark:text-[#8E9F90]">{m.label}</div>
                    </div>
                  ))}
                </div>

              </div>
            </article>
          ))}
        </div>

        {/* 3 Secondary Cards (Raksha, Cognify, BingeBuddy) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
          {secondaryProjects.map((sp, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-[#182119] border border-[#B8CFB3]/35 dark:border-[#2B3A2C] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm hover:shadow transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] font-semibold uppercase text-[#4D684B] dark:text-[#A3C49D]">{sp.category}</span>
                  <a href={sp.github} target="_blank" rel="noopener noreferrer" className="text-[#84A282] hover:text-[#4D684B]">
                    <i className="fas fa-arrow-up-right-from-square text-xs"></i>
                  </a>
                </div>
                <div className="text-[11px] text-[#4D684B] dark:text-[#A3C49D] font-medium mb-1">{sp.badge}</div>
                <h4 className="font-serif text-base sm:text-lg font-medium text-[#1C241E] dark:text-[#F2F6F2] mb-1">{sp.title}</h4>
                <p className="text-xs text-[#526054] dark:text-[#95A796] leading-relaxed mb-3">{sp.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1 pt-2.5 border-t border-[#B8CFB3]/20 dark:border-[#243226]">
                {sp.tags.map((t, i) => (
                  <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#FEFAF3] dark:bg-[#131A14] border border-[#B8CFB3]/30 dark:border-[#273529] text-[#526054] dark:text-[#95A796]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ==========================================================================
// Skills Section (Pure JavaScript ES6+ & Clean Tech Stack)
// ==========================================================================
function Skills() {
  const groups = [
    { title: "Languages", items: ["Python", "JavaScript (ES6+)", "Dart", "SQL", "HTML5 & CSS3"] },
    { title: "Frontend & Mobile", items: ["React.js & Vite", "Flutter (Mobile)", "Tailwind CSS", "Bootstrap 5", "Responsive Web Design", "Web Accessibility (WCAG)"] },
    { title: "AI & Data", items: ["Scikit-learn (ML)", "TensorFlow & Keras", "OpenCV (Computer Vision)", "MediaPipe", "Pandas & NumPy", "Power BI & DAX"] },
    { title: "Backend & Tools", items: ["Firebase (Auth & Firestore)", "Node.js & Express", "FastAPI", "WebSockets (Socket.IO)", "Git & GitHub Workflows", "Vercel & Netlify"] }
  ];

  return (
    <section id="skills" className="py-6 sm:py-10 md:py-16 bg-white/40 dark:bg-[#161D17]/40 border-b border-[#B8CFB3]/25 dark:border-[#273529] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="max-w-2xl mb-4 sm:mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#4D684B] dark:text-[#A3C49D] font-semibold">Toolkit</span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#1C241E] dark:text-[#F2F6F2] font-normal mt-1 mb-2">
            Technologies & Tools
          </h2>
          <p className="text-xs sm:text-base text-[#4A564C] dark:text-[#A8BBA7]">
            The languages, frameworks, and tools I use to bring ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {groups.map((g, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-[#182119] border border-[#B8CFB3]/35 dark:border-[#2B3A2C] rounded-2xl p-4 sm:p-5 shadow-sm"
            >
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#4D684B] dark:text-[#A3C49D] pb-2 border-b border-[#B8CFB3]/25 dark:border-[#273529] mb-2.5">
                {g.title}
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {g.items.map((item, i) => (
                  <li key={i} className="text-xs sm:text-sm text-[#4A564C] dark:text-[#A8BBA7] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#84A282] shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ==========================================================================
// Experience & Journey Timeline (Accurate: Nexhack Top 15, Dextrix Top 6)
// ==========================================================================
function Experience() {
  const entries = [
    {
      year: "Sept 2026",
      badge: "Top 15 Finalist",
      title: "Nexhack Hackathon — Built Raksha",
      org: "National Collegiate Hackathon",
      desc: "Ranked in the Top 15 for building Raksha (RakshaNet AI), a zero-internet peer-to-peer phone mesh system that relays encrypted emergency distress signals in cell dead-zones."
    },
    {
      year: "2026",
      badge: "SIH Nominee",
      title: "Team Leader — BitVerse 404 (Smart India Hackathon 2026)",
      org: "Nominated by Institute of Information Technology and Management (IITM)",
      desc: "Leading a team of 6 students designing ORCA-Intel for ISRO's coastal challenge, building an offline mobile co-pilot that keeps fishermen safe in boundary waters."
    },
    {
      year: "Feb 2026",
      badge: "Top 6 Finalist",
      title: "Dextrix Hackathon — Built Awaaz Mobile",
      org: "36-Hour Engineering Sprint",
      desc: "Awarded Top 6 Finalist for creating Awaaz Mobile, an offline real-time Indian Sign Language translator turning gestures into text and speech on-device."
    },
    {
      year: "June 2026 – Aug 2026",
      badge: "Summer Trainee",
      title: "Summer Trainee — Applied AI with Python",
      org: "ShapeMySkills by DUCAT, Delhi",
      desc: "Developed the LegalMind AI contract analysis capstone on 510 contracts. Gained hands-on experience in machine learning, deep learning benchmarks, and interactive Power BI executive dashboards."
    },
    {
      year: "2025 – Present",
      badge: "Campus Leadership",
      title: "Class Representative & Lafz Debate Society Member",
      org: "IITM Delhi (GGSIP University)",
      desc: "Elected Class Representative for our BCA cohort; active speaker and event coordinator with the Lafz Debate and Literary Society."
    },
    {
      year: "2025 – 2028",
      badge: "Degree",
      title: "Bachelor of Computer Applications (BCA)",
      org: "Institute of Information Technology and Management (IITM), Delhi",
      desc: "Affiliated with Guru Gobind Singh Indraprastha University. Coursework in Data Structures, Database Systems (SQL), Object-Oriented Programming, and Web Technologies."
    }
  ];

  return (
    <section id="experience" className="py-6 sm:py-10 md:py-16 border-b border-[#B8CFB3]/25 dark:border-[#273529] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="mb-4 sm:mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#4D684B] dark:text-[#A3C49D] font-semibold">Journey</span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#1C241E] dark:text-[#F2F6F2] font-normal mt-1 mb-2">
            Experience & Milestones
          </h2>
          <p className="text-xs sm:text-base text-[#4A564C] dark:text-[#A8BBA7]">
            Milestones from my hackathons, technical training, and leadership.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {entries.map((item, idx) => (
            <div 
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 pb-4 sm:pb-6 border-b border-[#B8CFB3]/25 dark:border-[#273529] last:border-b-0 last:pb-0"
            >
              <div className="md:col-span-4">
                <span className="font-mono text-xs font-semibold text-[#1C241E] dark:text-[#F2F6F2]">{item.year}</span>
                <span className="block mt-1 text-[11px] font-semibold text-[#4D684B] dark:text-[#A3C49D] px-2 py-0.5 rounded bg-[#F6E2E9] dark:bg-[#1E281F] w-fit">
                  {item.badge}
                </span>
              </div>
              <div className="md:col-span-8">
                <h3 className="font-serif text-base sm:text-lg font-medium text-[#1C241E] dark:text-[#F2F6F2] mb-0.5">{item.title}</h3>
                <div className="text-xs italic text-[#4D684B] dark:text-[#A3C49D] mb-1">{item.org}</div>
                <p className="text-xs sm:text-sm text-[#4A564C] dark:text-[#A8BBA7] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ==========================================================================
// Contact Section with Direct Firebase Backend
// ==========================================================================
function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Please fill out your name, email, and message.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    const payload = {
      ...formData,
      clientTimestamp: new Date().toISOString()
    };

    try {
      if (db) {
        await addDoc(collection(db, 'inquiries'), {
          ...payload,
          serverTimestamp: serverTimestamp()
        });
        setStatus({ type: 'success', message: 'Thank you! Your message has been sent directly to my Firebase inbox. I will get back to you shortly.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const localKey = 'kanan_inquiries_staging';
        const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
        existing.push(payload);
        localStorage.setItem(localKey, JSON.stringify(existing));
        setStatus({ type: 'success', message: 'Message saved in staging. (Connect live Firestore credentials in firebase-config.js to push live).' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Unable to send message right now. Feel free to email me directly at kananjn45@gmail.com.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-6 sm:py-10 md:py-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="bg-white dark:bg-[#182119] border border-[#B8CFB3]/40 dark:border-[#2D3C2F] rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-10 shadow-sm">
          
          <div className="max-w-xl mb-4 sm:mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-[#4D684B] dark:text-[#A3C49D] font-semibold">Let's Connect</span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1C241E] dark:text-[#F2F6F2] font-normal mt-1 mb-2">
              Start a Conversation
            </h2>
            <p className="text-xs sm:text-base text-[#4A564C] dark:text-[#A8BBA7]">
              Have a project, freelance idea, or tech role in mind? Feel free to reach out anytime!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10">
            
            {/* Direct Info */}
            <div className="lg:col-span-5 flex flex-col gap-3.5 sm:gap-6 lg:border-r border-[#B8CFB3]/30 dark:border-[#273529] lg:pr-8">
              <div>
                <span className="font-mono text-xs text-[#526054] dark:text-[#8E9F90] uppercase block">Email Directly</span>
                <a href="mailto:kananjn45@gmail.com" className="text-sm font-semibold text-[#1C241E] dark:text-[#F2F6F2] hover:text-[#4D684B]">
                  kananjn45@gmail.com
                </a>
              </div>

              <div>
                <span className="font-mono text-xs text-[#526054] dark:text-[#8E9F90] uppercase block">Phone</span>
                <span className="text-sm font-semibold text-[#1C241E] dark:text-[#F2F6F2]">+91-8860828246</span>
              </div>

              <div>
                <span className="font-mono text-xs text-[#526054] dark:text-[#8E9F90] uppercase block">Location</span>
                <span className="text-sm font-semibold text-[#1C241E] dark:text-[#F2F6F2]">Delhi, India</span>
              </div>

              <div className="pt-1">
                <span className="font-mono text-xs text-[#526054] dark:text-[#8E9F90] uppercase block mb-2">Profiles</span>
                <div className="flex gap-2">
                  <a 
                    href="https://linkedin.com/in/kanan-jain-762785298" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-[#FEFAF3] dark:bg-[#131A14] border border-[#B8CFB3]/40 dark:border-[#273529] text-xs font-semibold text-[#1C241E] dark:text-[#F2F6F2] hover:border-[#84A282] transition-colors flex items-center gap-1.5"
                  >
                    <i className="fab fa-linkedin text-[#0A66C2]"></i>
                    <span>LinkedIn</span>
                  </a>
                  <a 
                    href="https://github.com/kananjn45" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-[#FEFAF3] dark:bg-[#131A14] border border-[#B8CFB3]/40 dark:border-[#273529] text-xs font-semibold text-[#1C241E] dark:text-[#F2F6F2] hover:border-[#84A282] transition-colors flex items-center gap-1.5"
                  >
                    <i className="fab fa-github"></i>
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C241E] dark:text-[#F2F6F2] mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Priya Sharma"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FEFAF3] dark:bg-[#131A14] border border-[#B8CFB3]/50 dark:border-[#273529] text-sm text-[#1C241E] dark:text-[#F2F6F2] focus:outline-none focus:border-[#84A282] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C241E] dark:text-[#F2F6F2] mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="priya@domain.com"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FEFAF3] dark:bg-[#131A14] border border-[#B8CFB3]/50 dark:border-[#273529] text-sm text-[#1C241E] dark:text-[#F2F6F2] focus:outline-none focus:border-[#84A282] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C241E] dark:text-[#F2F6F2] mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project Inquiry / Opportunity"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FEFAF3] dark:bg-[#131A14] border border-[#B8CFB3]/50 dark:border-[#273529] text-sm text-[#1C241E] dark:text-[#F2F6F2] focus:outline-none focus:border-[#84A282] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C241E] dark:text-[#F2F6F2] mb-1">Message *</label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me a bit about what you have in mind..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FEFAF3] dark:bg-[#131A14] border border-[#B8CFB3]/50 dark:border-[#273529] text-sm text-[#1C241E] dark:text-[#F2F6F2] focus:outline-none focus:border-[#84A282] transition-colors"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-[#84A282] text-white text-xs font-semibold hover:bg-[#6F8E6D] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{loading ? "Sending..." : "Send Message"}</span>
                  <i className="fas fa-paper-plane text-xs"></i>
                </button>

                {status && (
                  <div className={`p-3 rounded-xl text-xs ${status.type === 'success' ? 'bg-[#B8CFB3]/30 text-[#2D452B] dark:text-[#C5DDC3]' : 'bg-rose-100 text-rose-800'}`}>
                    {status.message}
                  </div>
                )}
              </form>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

// ==========================================================================
// Footer
// ==========================================================================
function Footer() {
  return (
    <footer className="py-5 sm:py-7 border-t border-[#B8CFB3]/30 dark:border-[#273529] text-xs text-[#526054] dark:text-[#8E9F90] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between flex-wrap gap-2.5">
        <div>
          <span className="font-semibold text-[#1C241E] dark:text-[#F2F6F2]">Kanan Jain</span> &copy; 2026. Designed with craft, warmth, and code.
        </div>
        <a href="#hero" className="hover:text-[#1C241E] dark:hover:text-[#F2F6F2] flex items-center gap-1.5 font-medium transition-colors">
          <span>Back to Top</span>
          <i className="fas fa-arrow-up text-[10px]"></i>
        </a>
      </div>
    </footer>
  );
}

// ==========================================================================
// Main App Component with Persistent Theme Management
// ==========================================================================
function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('kanan_theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kanan_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kanan_theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-[#FEFAF3] dark:bg-[#141A15] text-[#1C241E] dark:text-[#F2F6F2] font-sans transition-colors duration-300">
      <AnnouncementStrip />
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <main>
        <Hero isDark={isDark} />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

// Mount the React Application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
