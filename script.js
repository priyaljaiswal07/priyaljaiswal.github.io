/* GSAP + Lenis — professional portfolio motion */

(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function runBoot() {
    const boot = document.getElementById("boot");
    const fill = document.getElementById("bootFill");
    const pct = document.getElementById("bootPct");
    if (!boot) return Promise.resolve();

    return new Promise((resolve) => {
      if (reduce) {
        boot.remove();
        resolve();
        return;
      }
      let n = 0;
      const step = () => {
        n += Math.random() * 11 + 4;
        if (n > 100) n = 100;
        fill.style.width = n + "%";
        pct.textContent = Math.floor(n) + "%";
        if (n < 100) requestAnimationFrame(step);
        else {
          gsap.to(boot, {
            opacity: 0,
            duration: 0.7,
            ease: "power2.inOut",
            delay: 0.25,
            onComplete: () => {
              boot.remove();
              resolve();
            },
          });
        }
      };
      requestAnimationFrame(step);
    });
  }

  document.getElementById("contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = `${document.getElementById("fName").value} ${document.getElementById("lName").value}`.trim();
    const email = document.getElementById("fEmail").value;
    const msg = document.getElementById("fMsg").value;
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
    window.location.href = `mailto:priyaljaiswal07@gmail.com?subject=${subject}&body=${body}`;
  });

  async function boot() {
    gsap.registerPlugin(ScrollTrigger);
    await runBoot();

    if (!reduce && typeof Lenis !== "undefined") {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const nav = document.getElementById("nav");
    ScrollTrigger.create({
      start: 40,
      onUpdate: (s) => nav.classList.toggle("scrolled", s.scroll() > 40),
    });

    const progress = document.getElementById("scrollProgress");
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (s) => {
        progress.style.width = s.progress * 100 + "%";
      },
    });

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from(".portrait-frame", { y: 36, opacity: 0, scale: 0.96, duration: 1 }, 0)
      .from(".status-pill", { y: 12, opacity: 0, duration: 0.5 }, 0.35)
      .from(".hero-copy > *", { y: 24, opacity: 0, stagger: 0.07, duration: 0.75 }, 0.15)
      .from(".mini-card", { y: 16, opacity: 0, stagger: 0.08, duration: 0.55 }, 0.4)
      .from(".hero-scrub-hint", { opacity: 0, y: 10, duration: 0.45 }, 0.65);

    /* Soft portrait parallax — keep face sharp, no heavy grayscale */
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      })
      .to("#portrait", { scale: 1.06, yPercent: 4, ease: "none" }, 0)
      .to(".portrait-glow", { opacity: 0.45, ease: "none" }, 0)
      .to(".hero-copy", { y: 48, opacity: 0.35, ease: "none" }, 0);

    gsap.utils.toArray(".section-h, .pill-tag, .about-text, .section-sub").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    gsap.from(".exp-card", {
      scrollTrigger: { trigger: ".exp-grid", start: "top 80%", once: true },
      y: 36,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
    });

    gsap.from(".tech-cloud span", {
      scrollTrigger: { trigger: "#techCloud", start: "top 85%", once: true },
      scale: 0.9,
      opacity: 0,
      y: 12,
      stagger: { each: 0.025, from: "random" },
      duration: 0.45,
      ease: "back.out(1.3)",
    });

    document.querySelectorAll("[data-count]").forEach((el) => {
      const end = +el.dataset.count;
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () =>
          gsap.to(obj, {
            v: end,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.floor(obj.v);
            },
          }),
      });
    });

    const track = document.getElementById("projTrack");
    const pin = document.getElementById("projects");
    if (track && pin) {
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);
      gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const cards = gsap.utils.toArray(".proj-card");
            const i = Math.min(cards.length - 1, Math.floor(self.progress * cards.length));
            cards.forEach((c, idx) => c.classList.toggle("active", idx === i));
          },
        },
      });
    }

    gsap.from(".tl", {
      scrollTrigger: { trigger: ".timeline", start: "top 80%", once: true },
      y: 36,
      opacity: 0,
      stagger: 0.12,
      duration: 0.75,
    });

    gsap.from(".cert-card", {
      scrollTrigger: { trigger: ".cert-row", start: "top 85%", once: true },
      x: -20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
    });

    gsap.from(".contact-card, .contact-form", {
      scrollTrigger: { trigger: ".contact-grid", start: "top 80%", once: true },
      y: 36,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
    });

    ScrollTrigger.refresh();
  }

  Promise.all([
    document.fonts?.ready || Promise.resolve(),
    new Promise((r) => {
      const img = document.getElementById("portrait");
      if (!img || img.complete) return r();
      img.addEventListener("load", r);
      img.addEventListener("error", r);
    }),
  ]).then(boot);
})();
